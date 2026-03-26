import { PROGRAM_LIBRARY } from './programs';
import { CONDITION_RISK_MAP, CONDITION_MODIFIER_MAP } from './types';
import type { SurveyInputV2, ProgramScore, RiskLevel, Goal, Environment, ModifierTag, HealthCondition } from './types';

const RISK_PRIORITY: Record<RiskLevel, number> = {
  'BLACK': 4,
  'RED': 3,
  'AMBER': 2,
  'GREEN': 1
};

// Exercise Swap Table (Section 6)
const SWAP_RULES: Record<string, Record<string, string>> = {
  'SQUAT': {
    'MOD-KNEE': 'High box squat pain-free ROM',
    'MOD-HIP': 'Sit-to-stand from high box',
    'MOD-BALANCE': 'Supported sit-to-stand holding rail/TRX/cable',
    'MOD-DECONDITIONED': 'Bodyweight sit-to-stand from high box',
    'MOD-MACHINE-ONLY': 'Leg press',
  },
  'LUNGE': {
    'MOD-KNEE': 'Leg press split stance not required',
    'MOD-HIP': 'Glute bridge or leg press',
    'MOD-BALANCE': 'Supported split squat hold or remove',
  },
  'HINGE': {
    'MOD-LOWBACK': 'Glute bridge',
    'MOD-BALANCE': 'Glute bridge or cable pull-through supported',
    'MOD-HIP': 'Glute bridge',
    'MOD-MACHINE-ONLY': 'Cable pull-through or bridge'
  },
  'PUSH_HORIZONTAL': {
    'MOD-SHOULDER': 'Chest press machine neutral/pain-free range',
    'MOD-BEGINNER': 'Chest press machine',
  },
  'CORE': {
    'MOD-NO-FLOOR': 'Seated march + bracing',
    'MOD-DIZZINESS': 'Seated anti-rotation hold'
  },
  'CARDIO': {
    'MOD-CARDIOLOW': 'Recumbent bike 5–10 min easy',
    'MOD-BALANCE': 'Recumbent bike or supervised treadmill only',
    'MOD-KNEE': 'Recumbent bike',
  }
};

export function runHeuristicTriage(input: SurveyInputV2): ProgramScore[] {
  const modifiers = new Set<ModifierTag>();
  const explainLog: string[] = [];

  // --- 1. DETERMINE HIGHEST TRIGGERED RISK LEVEL ---
  let userRisk: RiskLevel = 'GREEN';
  input.conditions.forEach(c => {
    const level = CONDITION_RISK_MAP[c];
    if (RISK_PRIORITY[level] > RISK_PRIORITY[userRisk]) {
      userRisk = level;
    }
  });

  // --- 2. INTEGRATE FUNCTIONAL SAFETY GATING (March 26th Logic) ---
  const isHardStop = input.doctorSaysSupervision || input.chestPainRecent || input.uncontrolledConditions || 
                     input.recentSurgeryNotCleared || input.repeatedFallsInjury || input.severePainDaily || 
                     input.neuroConditionUnchecked;

  if (isHardStop) {
    userRisk = 'BLACK';
    modifiers.add('REFERRAL-GP');
    explainLog.push("Triggered Hard Stop Medical referral.");
  }

  // Functional Overrides
  if (userRisk !== 'BLACK') {
    if (input.walkingAid || input.fallsHistory === 'TWO_OR_INJURY' || input.unsteadyGait) {
      if (RISK_PRIORITY['RED'] > RISK_PRIORITY[userRisk]) userRisk = 'RED'; // Force higher safety
      modifiers.add('MOD-BALANCE');
      explainLog.push("Gating Override: Elevated risk pools due to balance/walking aid.");
    }
    if (input.dizziness || input.fallsHistory === 'ONE_NO_INJURY' || input.chairRiseDifficulty) {
      if (RISK_PRIORITY['AMBER'] > RISK_PRIORITY[userRisk]) userRisk = 'AMBER';
      modifiers.add('MOD-BALANCE');
      explainLog.push("Gating Override: Amber tier pool forced for stability safety.");
    }
    if (input.breathlessLightActivity) {
      if (RISK_PRIORITY['RED'] > RISK_PRIORITY[userRisk]) userRisk = 'RED';
      modifiers.add('MOD-CARDIOLOW');
      explainLog.push("Gating Override: Red tier pool forced due to light-activity breathlessness.");
    }
  }

  // --- 3. APPLY MSK ENTROPY (Section 8: Conflict Sets) ---
  // If user has 2+ distinct MSK/Joint paints, escalate to AMBER
  const mskConditions: HealthCondition[] = ['Shoulder Pain', 'Knee Pain', 'Hip Pain', 'Low Back Pain', 'Lumbar Herniation', 'Osteoarthritis'];
  const mskCount = input.conditions.filter(c => mskConditions.includes(c)).length;

  if (mskCount >= 2 && RISK_PRIORITY['AMBER'] > RISK_PRIORITY[userRisk]) {
    userRisk = 'AMBER';
    explainLog.push(`Escalation: ${mskCount} joint pains (Conflict Set) forced AMBER tier.`);
  }

  // --- 4. THE BLACK STOP GATE ---
  if (userRisk === 'BLACK') {
    return [{
       code: 'P-REF-RED',
       name: 'Clinical Referral Required',
       trainerizeId: 'tz_ref',
       riskLevel: 'BLACK',
       finalScore: 0,
       banned: true,
       bannedReasons: ["Hard-stop clinical clinical risk detected."],
       explainLog: ["Clinical referral required before assignment."],
       modifiers: Array.from(modifiers),
       swaps: {}
    }];
  }

  // --- 4. FILTER LIBRARY TO ACTIVE TIER ---
  let filteredLibrary = PROGRAM_LIBRARY.filter(p => p.riskLevel === userRisk);
  if (userRisk === 'AMBER') {
    const redPrograms = PROGRAM_LIBRARY.filter(p => p.riskLevel === 'RED');
    filteredLibrary = [...filteredLibrary, ...redPrograms];
  }

  // --- 5. EVALUATE FILTERED PROGRAMS (Original V2 Scoring) ---
  const scoredPrograms: ProgramScore[] = filteredLibrary.map(prog => {
    let finalScore = 0;
    let banned = false;
    const bannedReasons: string[] = [];
    const localExplain: string[] = [...explainLog];

    // Veto Gate
    for (const condition of input.conditions) {
      if (prog.vetoConditions.includes(condition)) {
        banned = true;
        bannedReasons.push(condition);
      }
    }

    if (!banned) {
      for (const goal of input.goals) {
        const pts = prog.boosts.goals[goal as Goal];
        if (pts) {
          finalScore += pts;
          localExplain.push(`${pts > 0 ? '+' : ''}${pts} Points alignment: ${goal}`);
        }
      }
      for (const env of input.environments) {
        const pts = prog.boosts.environments[env as Environment];
        if (pts) {
          finalScore += pts;
          localExplain.push(`${pts > 0 ? '+' : ''}${pts} Points matching env: ${env}`);
        }
      }
      const cpxPts = prog.boosts.complexity[input.complexity];
      finalScore += cpxPts;
      localExplain.push(`${cpxPts > 0 ? '+' : ''}${cpxPts} Pts: ${input.complexity} Complexity`);

      const impPts = prog.boosts.impact[input.impact];
      finalScore += impPts;
      localExplain.push(`${impPts > 0 ? '+' : ''}${impPts} Pts: ${input.impact} Impact`);

      const repPts = prog.boosts.reps[input.reps];
      finalScore += repPts;
      localExplain.push(`${repPts > 0 ? '+' : ''}${repPts} Pts: ${input.reps} Reps`);
    } else {
      finalScore = -9999;
    }

    // --- 6. ATTACH MODIFIERS & SWAPS (Merged Logic) ---
    const localModifiers = new Set<ModifierTag>(modifiers);
    
    // Rule: 2+ MSK conditions add Manual Review tag
    if (mskCount >= 2) localModifiers.add('MANUAL-REVIEW');
    
    input.conditions.forEach(c => {
      const tags = CONDITION_MODIFIER_MAP[c];
      if (tags) tags.forEach(t => localModifiers.add(t));
    });
    if (input.floorTransferDifficulty) localModifiers.add('MOD-NO-FLOOR');
    if (input.strengthHistory === 'NONE') localModifiers.add('MOD-BEGINNER');

    const activeSwaps: Record<string, string> = {};
    Object.keys(SWAP_RULES).forEach(pattern => {
       const rules = SWAP_RULES[pattern];
       for (const mod of Array.from(localModifiers)) {
         if (rules[mod]) {
           activeSwaps[pattern] = rules[mod];
           break;
         }
       }
    });

    return {
      code: prog.code,
      name: prog.name,
      trainerizeId: prog.trainerizeId,
      riskLevel: prog.riskLevel,
      finalScore,
      banned,
      bannedReasons,
      explainLog: localExplain,
      modifiers: Array.from(localModifiers),
      swaps: activeSwaps
    };
  });

  return scoredPrograms.filter(p => !p.banned).sort((a, b) => b.finalScore - a.finalScore);
}
