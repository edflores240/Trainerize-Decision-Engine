import { runHeuristicTriage } from './src/engine/v2/engine';
import type { SurveyInputV2 } from './src/engine/v2/types';

const defaultInput: SurveyInputV2 = {
  walkingAid: false,
  fallsHistory: 'NONE',
  chairRiseDifficulty: false,
  floorTransferDifficulty: false,
  unsteadyGait: false,
  dizziness: false,
  breathlessLightActivity: false,
  walking10MinContinuous: true,
  strengthHistory: 'NONE',
  daysPerWeek: 2,
  doctorSaysSupervision: false,
  chestPainRecent: false,
  uncontrolledConditions: false,
  recentSurgeryNotCleared: false,
  repeatedFallsInjury: false,
  severePainDaily: false,
  neuroConditionUnchecked: false,
  conditions: [],
  environments: ['GYM'],
  goals: ['GENERAL_STRENGTH'],
  complexity: 'MED',
  impact: 'MED',
  reps: 'MED'
};

const testCases: { name: string; input: SurveyInputV2 }[] = [
  {
    name: "Scenario A: Healthy Active (Green 3-Day)",
    input: {
      ...defaultInput,
      strengthHistory: 'HIGH',
      daysPerWeek: 3
    }
  },
  {
    name: "Scenario B: Falls Risk (Balance Program + Modifiers)",
    input: {
      ...defaultInput,
      fallsHistory: 'TWO_OR_INJURY',
      conditions: ['Shoulder Pain']
    }
  },
  {
    name: "Scenario C: Conflict Entropy (2+ Modifiers -> Manual Review)",
    input: {
      ...defaultInput,
      dizziness: true,
      walkingAid: true
    }
  },
  {
    name: "Scenario D: Black Stop (Chest Pain)",
    input: {
      ...defaultInput,
      chestPainRecent: true
    }
  }
];

console.log("=========================================");
console.log("🚀 MARCH 26TH MODIFIER-BASED VALIDATION");
console.log("=========================================");

testCases.forEach((tc) => {
  console.log(`\n[SCENARIO] -> ${tc.name}`);
  
  const results = runHeuristicTriage(tc.input);
  const res = results[0];

  console.log(`🏆 TEMPLATE: ${res.name} (${res.code}) [Tier: ${res.riskLevel}]`);
  
  if (res.modifiers.length > 0) {
    console.log(`🏷️  MODIFIERS: ${res.modifiers.join(', ')}`);
  }
  
  if (Object.keys(res.swaps).length > 0) {
    console.log(`🔄 SWAPS: ${Object.entries(res.swaps).map(([k, v]) => `${k}->${v}`).join(' | ')}`);
  }

  console.log(`📜 LOG: ${res.explainLog.join(' -> ')}`);
  console.log("-----------------------------------------");
});
