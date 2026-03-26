#!/usr/bin/env node
// Comprehensive engine verification test — run with: node test-engine.mjs
// Tests the new realistic 15-rule matrix

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const matrixPath = join(__dirname, 'src/engine/logic-matrix.json');
const matrix = JSON.parse(readFileSync(matrixPath, 'utf-8'));

function fieldMatches(conditionValue, inputValue) {
  if (conditionValue === '*') return true;
  if (Array.isArray(conditionValue)) return conditionValue.includes(inputValue);
  return conditionValue === inputValue;
}

function parseRules(matrix) {
  return matrix.rules
    .map(rule => ({
      ...rule,
      match: (input) =>
        fieldMatches(rule.conditions.risk, input.risk) &&
        fieldMatches(rule.conditions.modifier, input.modifier) &&
        fieldMatches(rule.conditions.setting, input.setting) &&
        fieldMatches(rule.conditions.goal, input.goal),
    }))
    .sort((a, b) => b.priority - a.priority);
}

function processInput(input, rules) {
  for (const rule of rules) {
    if (rule.match(input)) {
      return { program_name: rule.results.program_name, program_code: rule.results.program_code, action_status: rule.results.action_status, next_step: rule.results.next_step, matched_rule_id: rule.id };
    }
  }
  return { program_name: null, program_code: null, action_status: 'REVIEW_REQUIRED', next_step: 'FALLBACK_REVIEW', matched_rule_id: 'FALLBACK', error: 'No rule matched' };
}

const rules = parseRules(matrix);

// ── Test cases ───────────────────────────────────────────────────────────────

const tests = [
  {
    name: 'R001 — Absolute Medical Stop (RED)',
    input: { risk: 'RED', modifier: 'STANDARD', setting: 'GYM', goal: 'STRENGTH', frequency: 3 },
    expect: { action_status: 'REFERRAL_REQUIRED', program_code: null, matched_rule_id: 'R001' },
  },
  {
    name: 'R002 — Amber + Low Capacity',
    input: { risk: 'AMBER', modifier: 'LOWCAP', setting: 'HOME', goal: 'CARDIO', frequency: 2 },
    expect: { action_status: 'REVIEW_REQUIRED', program_code: 'AMBER-LOWCAP-V1', matched_rule_id: 'R002' },
  },
  {
    name: 'R004 — Amber + Machine in Gym',
    input: { risk: 'AMBER', modifier: 'MACHINE', setting: 'GYM', goal: 'STRENGTH', frequency: 3 },
    expect: { action_status: 'AUTO_OK', program_code: 'AMBER-GYM-MACHINES-V1', matched_rule_id: 'R004' },
  },
  {
    name: 'R010 — Green + Joint (Strength)',
    input: { risk: 'GREEN', modifier: 'JOINT', setting: 'GYM', goal: 'STRENGTH', frequency: 4 },
    expect: { action_status: 'AUTO_OK', program_code: 'GRN-GYM-LOW-IMPACT-STR-V1', matched_rule_id: 'R010' },
  },
  {
    name: 'R011 — Green + Joint (Cardio)',
    input: { risk: 'GREEN', modifier: 'JOINT', setting: 'HOME', goal: 'CARDIO', frequency: 3 },
    expect: { action_status: 'AUTO_OK', program_code: 'GRN-LISS-CARDIO-V1', matched_rule_id: 'R011' },
  },
  {
    name: 'R020 — Green + Home (Strength)',
    input: { risk: 'GREEN', modifier: 'STANDARD', setting: 'HOME', goal: 'STRENGTH', frequency: 3 },
    expect: { action_status: 'AUTO_OK', program_code: 'GRN-HOME-DB-STR-V1', matched_rule_id: 'R020' },
  },
  {
    name: 'R031 — Green + Gym (STR_MOB)',
    input: { risk: 'GREEN', modifier: 'STANDARD', setting: 'GYM', goal: 'STR_MOB', frequency: 4 },
    expect: { action_status: 'AUTO_OK', program_code: 'GRN-GYM-FUNC-ATHLETE-V1', matched_rule_id: 'R031' },
  },
  {
    name: 'R040 — Class Setting Override',
    input: { risk: 'GREEN', modifier: 'STANDARD', setting: 'CLASS', goal: 'STRENGTH', frequency: 3 },
    expect: { action_status: 'AUTO_OK', program_code: 'GRN-CLASS-PASSTHROUGH-V1', matched_rule_id: 'R040' },
  },
];

let passed = 0;
let failed = 0;

console.log('─── Running Logic Engine Tests ───\n');

for (const test of tests) {
  const result = processInput(test.input, rules);
  const ok =
    result.action_status === test.expect.action_status &&
    result.program_code === test.expect.program_code &&
    result.matched_rule_id === test.expect.matched_rule_id;

  if (ok) {
    console.log(`✅ PASS : ${test.name}`);
    console.log(`          (Input: ${JSON.stringify(test.input)})`);
    console.log(`          (Output: Rule ${result.matched_rule_id} -> ${result.program_code || 'REFERRAL'})\n`);
    passed++;
  } else {
    console.log(`❌ FAIL : ${test.name}`);
    console.log(`          Expected: ${JSON.stringify(test.expect)}`);
    console.log(`          Got:      action_status=${result.action_status}, program_code=${result.program_code}, rule=${result.matched_rule_id}\n`);
    failed++;
  }
}

console.log(`================================`);
console.log(`${passed}/${tests.length} tests passed`);
console.log(`================================\n`);
if (failed > 0) process.exit(1);
