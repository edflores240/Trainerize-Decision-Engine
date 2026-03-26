import { PROGRAM_LIBRARY } from './programs';
import { CONDITION_RISK_MAP } from './types';
import type { SurveyInputV2, ProgramScore, RiskLevel, Goal, Environment, PreferenceLevel } from './types';

const RISK_PRIORITY: Record<RiskLevel, number> = {
  'BLACK': 4,
  'RED': 3,
  'AMBER': 2,
  'GREEN': 1
};

export function runHeuristicTriage(input: SurveyInputV2): ProgramScore[] {
  // --- 1. DETERMINE HIGHEST TRIGGERED RISK LEVEL ---
  let userRisk: RiskLevel = 'GREEN';
  input.conditions.forEach(c => {
    const level = CONDITION_RISK_MAP[c];
    if (RISK_PRIORITY[level] > RISK_PRIORITY[userRisk]) {
      userRisk = level;
    }
  });

  // --- 2. THE BLACK STOP GATE ---
  // If the user triggers a BLACK level condition, return no programs (triggers UI referral)
  if (userRisk === ('BLACK' as RiskLevel)) {
    return [];
  }

  // --- 3. FILTER LIBRARY TO ACTIVE TIER ---
  // A user only sees programs at their specific risk level (or below if specified)
  let filteredLibrary = PROGRAM_LIBRARY.filter(p => p.riskLevel === userRisk);
  
  // Custom Routing Rules: AMBER users can also safely see RED programs
  if (userRisk === ('AMBER' as RiskLevel)) {
    const redPrograms = PROGRAM_LIBRARY.filter(p => p.riskLevel === 'RED');
    filteredLibrary = [...filteredLibrary, ...redPrograms];
  }

  // --- 4. EVALUATE FILTERED PROGRAMS ---
  const scoredPrograms: ProgramScore[] = filteredLibrary.map(prog => {
    let finalScore = 0;
    let banned = false;
    const bannedReasons: string[] = [];
    const explainLog: string[] = [];

    // --- 1. THE VETO GATE (Local Contraindications) ---
    for (const condition of input.conditions) {
      if (prog.vetoConditions.includes(condition)) {
        banned = true;
        bannedReasons.push(condition);
      }
    }

    if (banned) {
      finalScore = -9999;
    } else {
      // --- 2. THE SCORING LOOP ---
      
      // Goals
      for (const goal of input.goals) {
        const pts = prog.boosts.goals[goal as Goal];
        if (pts) {
          finalScore += pts;
          explainLog.push(`${pts > 0 ? '+' : ''}${pts} Points alignment: ${goal}`);
        }
      }

      // Environments
      for (const env of input.environments) {
        const pts = prog.boosts.environments[env as Environment];
        if (pts) {
          finalScore += pts;
          explainLog.push(`${pts > 0 ? '+' : ''}${pts} Points matching env: ${env}`);
        }
      }

      // Complexity
      const cpxPts = prog.boosts.complexity[input.complexity as PreferenceLevel];
      finalScore += cpxPts;
      explainLog.push(`${cpxPts > 0 ? '+' : ''}${cpxPts} Points for ${input.complexity} Complexity`);

      // Impact
      const impPts = prog.boosts.impact[input.impact as PreferenceLevel];
      finalScore += impPts;
      explainLog.push(`${impPts > 0 ? '+' : ''}${impPts} Points for ${input.impact} Impact`);

      // Reps
      const repPts = prog.boosts.reps[input.reps as PreferenceLevel];
      finalScore += repPts;
      explainLog.push(`${repPts > 0 ? '+' : ''}${repPts} Points for ${input.reps} Reps`);
    }

    return {
      code: prog.code,
      name: prog.name,
      trainerizeId: prog.trainerizeId,
      riskLevel: prog.riskLevel,
      finalScore,
      banned,
      bannedReasons,
      explainLog
    };
  });

  // Sort by score descending
  return scoredPrograms.sort((a, b) => b.finalScore - a.finalScore);
}
