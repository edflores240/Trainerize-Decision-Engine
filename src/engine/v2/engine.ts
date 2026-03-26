import { PROGRAM_LIBRARY } from './programs';
import { CONDITION_MODIFIER_MAP } from './types';
import type { SurveyInputV2, ProgramScore, ModifierTag } from './types';

/**
 * MARCH 26TH REFACTOR: 
 * Rule Hierarchy Engine.
 */

// Section 6: Exact Exercise Swap Table
const SWAP_RULES: Record<string, Record<string, string>> = {
  'SQUAT': {
    'MOD-KNEE': 'High box squat pain-free ROM',
    'MOD-HIP': 'Sit-to-stand from high box',
    'MOD-BALANCE': 'Supported sit-to-stand holding rail/TRX/cable',
    'MOD-DECONDITIONED': 'Bodyweight sit-to-stand from high box',
    'MOD-MACHINE-ONLY': 'Leg press',
    'MOD-HIGHBMI': 'Leg press or high box sit-to-stand'
  },
  'LUNGE': {
    'MOD-KNEE': 'Leg press split stance not required',
    'MOD-HIP': 'Glute bridge or leg press',
    'MOD-BALANCE': 'Supported split squat hold or remove',
  },
  'HINGE': {
    'MOD-LOWBACK': 'Glute bridge',
    'MOD-BALANCE': 'Glute bridge or cable pull-through supported',
    'MOD-BEGINNER': 'Hip hinge drill to wall or bridge',
    'MOD-HIP': 'Glute bridge',
    'MOD-MACHINE-ONLY': 'Cable pull-through or bridge'
  },
  'PUSH_HORIZONTAL': {
    'MOD-SHOULDER': 'Chest press machine neutral/pain-free range',
    'MOD-BEGINNER': 'Chest press machine',
  },
  'PUSH_VERTICAL': {
    'MOD-SHOULDER': 'Incline chest press',
    'MOD-NO-OVERHEAD': 'Chest press/incline press',
    'MOD-LOWBACK': 'Seated chest press/incline press',
    'MOD-BEGINNER': 'Chest press machine'
  },
  'ROW': {
    'MOD-LOWBACK': 'Seated row machine',
    'MOD-BALANCE': 'Seated row machine',
    'MOD-DECONDITIONED': 'Seated row machine bilateral'
  },
  'CORE': {
    'MOD-NO-FLOOR': 'Seated march + bracing',
    'MOD-SHOULDER': 'Standing cable anti-rotation press',
    'MOD-DIZZINESS': 'Seated anti-rotation hold'
  },
  'CARDIO': {
    'MOD-CARDIOLOW': 'Recumbent bike 5–10 min easy',
    'MOD-BALANCE': 'Recumbent bike or supervised treadmill only',
    'MOD-KNEE': 'Recumbent bike',
    'MOD-DECONDITIONED': 'Continuous easy pace cardio',
    'MOD-DIZZINESS': 'Seated bike steady only'
  }
};

export function runHeuristicTriage(input: SurveyInputV2): ProgramScore[] {
  const modifiers = new Set<ModifierTag>();
  const explainLog: string[] = [];
  let assignedProgramCode = '';

  // --- 1. HARD STOP / REFERRAL (Section 3A) ---
  const isHardStop = 
    input.doctorSaysSupervision || 
    input.chestPainRecent || 
    input.uncontrolledConditions || 
    input.recentSurgeryNotCleared || 
    input.repeatedFallsInjury || 
    input.severePainDaily || 
    input.neuroConditionUnchecked;

  if (isHardStop) {
    assignedProgramCode = 'P-RED-REF';
    modifiers.add('REFERRAL-GP');
    explainLog.push("Triggered Hard Stop Medical referral.");
  }

  // --- 2. FUNCTION / SAFETY GATING (Section 3B) ---
  if (!assignedProgramCode) {
    if (input.walkingAid) {
      assignedProgramCode = 'P-BAL-2';
      modifiers.add('MOD-BALANCE');
      modifiers.add('MOD-MACHINE-ONLY');
      explainLog.push("Walking Aid gated to Balance Program.");
    } else if (input.fallsHistory === 'TWO_OR_INJURY' || input.unsteadyGait) {
      assignedProgramCode = 'P-BAL-2';
      modifiers.add('MOD-BALANCE');
      explainLog.push("Falls risk (2+ or unsteady) gated to Balance Program.");
    } else if (input.fallsHistory === 'ONE_NO_INJURY' || input.dizziness) {
      assignedProgramCode = 'P-AMB-2';
      modifiers.add('MOD-BALANCE');
      if (input.dizziness) modifiers.add('MOD-DIZZINESS');
      explainLog.push("Safety gate applied: Amber template due to instability/dizziness.");
    }
  }

  // --- 3. TRAINING HISTORY / CAPACITY (Section 3C) ---
  if (!assignedProgramCode) {
    if (input.breathlessLightActivity) {
      assignedProgramCode = 'P-CAR-2';
      modifiers.add('MOD-CARDIOLOW');
      modifiers.add('MOD-RECUMBENT-CARDIO');
      explainLog.push("Breathlessness gated to Cardio-Low Program.");
    } else if (!input.walking10MinContinuous) {
      assignedProgramCode = 'P-AMB-2';
      modifiers.add('MOD-CARDIOLOW');
      explainLog.push("Low walking capacity gated to Amber Program.");
    } else if (input.chairRiseDifficulty) {
      assignedProgramCode = 'P-AMB-2';
      modifiers.add('MOD-SIT-TO-STAND-ASSIST');
      explainLog.push("Chair rise difficulty gated to Amber Program.");
    }
  }

  // --- 4. BASE PROGRAM SELECTION (Section 5) ---
  if (!assignedProgramCode) {
    // Default to Green if no safety gates triggered
    const freq = input.daysPerWeek;
    if (input.strengthHistory === 'HIGH') {
      assignedProgramCode = `P-GRN-${freq}`;
      explainLog.push(`Assigned Active Green ${freq}-day Template.`);
    } else {
      assignedProgramCode = `P-GRN-2`; // Beginner default
      modifiers.add('MOD-BEGINNER');
      explainLog.push("Assigned Beginner Green 2-day Template.");
    }
  }

  // --- 5. CONDITION-BASED MODIFIERS (Section 4) ---
  input.conditions.forEach(c => {
    const tags = CONDITION_MODIFIER_MAP[c];
    if (tags) {
      tags.forEach(t => modifiers.add(t));
      explainLog.push(`Applied Modifier for: ${c}`);
    }
  });

  // Additional implicit modifiers from Section 3
  if (input.floorTransferDifficulty) modifiers.add('MOD-NO-FLOOR');

  // --- 6. CONFLICT ENTROPY RULES (Section 8) ---
  let entropyScore = 0;
  const conflictPool: ModifierTag[] = ['MOD-BALANCE', 'MOD-DIZZINESS', 'MOD-NEURO', 'MOD-DECONDITIONED', 'MOD-CARDIOLOW'];
  conflictPool.forEach(t => { if (modifiers.has(t)) entropyScore++; });

  if (entropyScore >= 2) {
    modifiers.add('MANUAL-REVIEW');
    explainLog.push(`Escalated: ${entropyScore} conflicts triggered Manual Review.`);
    // Force P-AMB-2 minimum as per Rule 2
    if (assignedProgramCode.startsWith('P-GRN')) {
      assignedProgramCode = 'P-AMB-2';
    }
  }

  // Rule 4: 4-day Override
  if (input.daysPerWeek === 4 && entropyScore > 0) {
    assignedProgramCode = 'P-GRN-2'; // or P-AMB-2
    explainLog.push("Overridden 4-day request due to safety modifiers.");
  }

  // --- 7. EXERCISE SWAPS (Section 6) ---
  const activeSwaps: Record<string, string> = {};
  Object.keys(SWAP_RULES).forEach(pattern => {
    const rules = SWAP_RULES[pattern];
    // Find the first matching modifier for this pattern
    for (const mod of Array.from(modifiers)) {
      if (rules[mod]) {
        activeSwaps[pattern] = rules[mod];
        break; // Priority to the first modifier found
      }
    }
  });

  // --- FINAL BUNDLE ---
  const prog = PROGRAM_LIBRARY.find(p => p.code === assignedProgramCode) || PROGRAM_LIBRARY[0];
  
  return [{
    code: prog.code,
    name: prog.name,
    trainerizeId: prog.trainerizeId,
    riskLevel: prog.riskLevel,
    finalScore: 100, // Score is binary in this new model (Selected vs Not)
    banned: assignedProgramCode === 'P-RED-REF',
    bannedReasons: isHardStop ? ["Clinical Referral Required"] : [],
    explainLog,
    modifiers: Array.from(modifiers),
    swaps: activeSwaps
  }];
}
