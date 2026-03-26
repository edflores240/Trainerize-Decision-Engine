/**
 * @file triageEngine.ts
 * @description The core stateless processor of the Fitness Triage Engine.
 *
 * PROCESSING HIERARCHY (enforced by rule priority in logic-matrix.json):
 *   1. Safety / Risk Gate      → priority 100+  (R001: RED/REFER_OUT → REFERRAL_REQUIRED)
 *   2. Physical Modifiers      → priority 50–99 (R002: BALANCE/JOINT overrides)
 *   3. Environment / Setting   → priority 10–49 (GYM/HOME/CLASS routing)
 *   4. Performance / Goals     → priority 1–9   (Standard program assignment)
 *   5. Global Fallback         → priority 0–4   (R004: catch-all REVIEW_REQUIRED)
 *
 * This module is STATELESS — it holds no session data between calls.
 */

import type { DecisionPacket, SurveyInput } from './types';
import type { ParsedRule } from './rulesParser';

/** Fallback packet returned when NO rule matches (should be unreachable if R004 exists) */
const SAFE_FALLBACK: DecisionPacket = {
  program_name: null,
  program_code: null,
  action_status: 'REVIEW_REQUIRED',
  next_step: 'FALLBACK_REVIEW',
  matched_rule_id: 'FALLBACK',
  error: 'No matching rule found. Input routed to manual review.',
};

/**
 * Validates a SurveyInput object for required fields.
 * Returns an error string if invalid, or null if valid.
 */
function validateInput(input: unknown): string | null {
  if (!input || typeof input !== 'object') return 'Input must be an object';
  const i = input as Record<string, unknown>;
  const required = ['risk', 'modifier', 'setting', 'goal', 'frequency'];
  for (const field of required) {
    if (i[field] === undefined || i[field] === null) {
      return `Missing required field: "${field}"`;
    }
  }
  return null;
}

/**
 * Processes a SurveyInput against an ordered list of ParsedRules.
 *
 * Rules are evaluated in priority order (highest first).
 * The FIRST matching rule's result becomes the DecisionPacket.
 *
 * @param input   - Survey data from the client (validated before use)
 * @param rules   - ParsedRules array from rulesParser (sorted by priority desc)
 * @returns       - A complete DecisionPacket ready for downstream consumption
 *
 * @example
 * const rules = parseRules(logicMatrix);
 * const result = processInput(
 *   { risk: 'RED', modifier: 'STANDARD', setting: 'GYM', goal: 'STRENGTH', frequency: 3 },
 *   rules
 * );
 * // → { action_status: 'REFERRAL_REQUIRED', program_code: null, next_step: 'TRIGGER_DOCTOR_REFERRAL_WORKFLOW', ... }
 */
export function processInput(
  input: SurveyInput,
  rules: ParsedRule[]
): DecisionPacket {
  // ── 1. Validate input ──────────────────────────────────────────────────────
  const validationError = validateInput(input);
  if (validationError) {
    return {
      ...SAFE_FALLBACK,
      error: `Validation error: ${validationError}`,
    };
  }

  // ── 2. Evaluate rules in priority order ────────────────────────────────────
  try {
    for (const rule of rules) {
      if (rule.match(input)) {
        return {
          program_name: rule.results.program_name,
          program_code: rule.results.program_code,
          action_status: rule.results.action_status,
          next_step: rule.results.next_step,
          matched_rule_id: rule.id,
        };
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown engine error';
    return {
      ...SAFE_FALLBACK,
      error: `Engine error: ${message}`,
    };
  }

  // ── 3. No match — return safe fallback ────────────────────────────────────
  // This should never be reached if a wildcard fallback rule (R004) exists.
  return SAFE_FALLBACK;
}
