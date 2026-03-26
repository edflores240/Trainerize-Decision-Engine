import { runHeuristicTriage } from './src/engine/v2/engine';
import type { SurveyInputV2 } from './src/engine/v2/types';

const testCases: { name: string; input: SurveyInputV2 }[] = [
  {
    name: "Test 1: Healthy Performance (No Injuries + Hypertrophy + Gym + High Impact)",
    input: {
      conditions: [],
      goals: ['HYPERTROPHY', 'ATHLETIC'],
      environments: ['GYM'],
      complexity: 'HIGH',
      impact: 'HIGH',
      reps: 'LOW'
    }
  },
  {
    name: "Test 2: AMBER Modification (Osteoarthritis + Hypertrophy + Gym)",
    input: {
      conditions: ['Osteoarthritis'],
      goals: ['HYPERTROPHY'],
      environments: ['GYM'],
      complexity: 'HIGH',
      impact: 'HIGH',
      reps: 'LOW'
    }
  },
  {
    name: "Test 3: RED Clinical (Heart Condition + Hypertrophy)",
    input: {
      conditions: ['Heart Condition'],
      goals: ['HYPERTROPHY'],
      environments: ['GYM'],
      complexity: 'MED',
      impact: 'MED',
      reps: 'MED'
    }
  },
  {
    name: "Test 4: BLACK Stop (Undiagnosed Severe Pain)",
    input: {
      conditions: ['Undiagnosed Severe Pain'],
      goals: ['ATHLETIC'],
      environments: ['GYM'],
      complexity: 'HIGH',
      impact: 'HIGH',
      reps: 'LOW'
    }
  }
];

console.log("=========================================");
console.log("🚀 FITNESS ENGINE V4-TIER VALIDATION");
console.log("=========================================");

testCases.forEach((tc) => {
  console.log(`\n[SCENARIO] -> ${tc.name}`);
  
  const results = runHeuristicTriage(tc.input);
  
  if (results.length === 0) {
    console.log("🚨 RESULT: BLACK STOP TRIGGERED. (Referral Required)");
    console.log("-----------------------------------------");
    return;
  }

  // Find top undisputed winner
  const winner = results[0];
  const banned = results.filter(r => r.banned);

  console.log(`🏆 WINNER: ${winner.name} [Code: ${winner.code}] (Points: ${winner.finalScore})`);
  console.log(`   💡 Score Log: \n      - ${winner.explainLog.slice(0, 3).join('\n      - ')}...`);

  console.log(`\n📦 MATCHES IN TIER: ${results.length} Programs`);
  console.log("-----------------------------------------");
});
