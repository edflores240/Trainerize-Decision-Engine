/**
 * @file index.ts
 * @description Public API for the Fitness Triage Engine ("The Brain").
 *
 * This is the ONLY entry point external consumers should import.
 * The internal rule parsing and processing are hidden behind this facade.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *
 * // Import the engine
 * import { triage } from './engine';
 * import type { SurveyInput, DecisionPacket } from './engine';
 *
 * // Call with survey data
 * const input: SurveyInput = {
 *   risk: 'GREEN',
 *   modifier: 'STANDARD',
 *   setting: 'GYM',
 *   goal: 'STRENGTH',
 *   frequency: 4,
 * };
 *
 * const result: DecisionPacket = triage(input);
 * // → { program_code: 'GRN-GYM-4D-STRENGTH-V1', action_status: 'AUTO_OK', ... }
 *
 * ─── MAKE.COM / WEBHOOK INTEGRATION ─────────────────────────────────────────
 *
 * After calling triage(), pass the DecisionPacket to your webhook handler:
 *
 * import { triggerMakeWebhook } from '../integrations/makeWebhook';
 * await triggerMakeWebhook(result);
 *
 * ─── UPDATING RULES ──────────────────────────────────────────────────────────
 *
 * To add/modify rules, edit src/engine/logic-matrix.json only.
 * No engine code changes are required.
 */

import logicMatrix from './logic-matrix.json';
import { parseRules } from './rulesParser';
import { processInput } from './triageEngine';
import type { SurveyInput, DecisionPacket, LogicMatrix } from './types';

// Parse and cache rules at module load time (not per-call) for performance
const _parsedRules = parseRules(logicMatrix as LogicMatrix);

/**
 * The main triage function — the "Black Box".
 *
 * Takes a SurveyInput, evaluates it against the prioritized rules matrix,
 * and returns a DecisionPacket indicating what program to assign and what
 * downstream action to trigger.
 *
 * @param input - Survey responses from the client
 * @returns     - A DecisionPacket with program_code, action_status, and next_step
 *
 * @example
 * triage({ risk: 'RED', modifier: 'STANDARD', setting: 'GYM', goal: 'STRENGTH', frequency: 3 })
 * // → { action_status: 'REFERRAL_REQUIRED', program_code: null, ... }
 */
export function triage(input: SurveyInput): DecisionPacket {
  return processInput(input, _parsedRules);
}

// Re-export types for consumers
export type { SurveyInput, DecisionPacket, ActionStatus, RiskLevel, PhysicalModifier, TrainingSetting, FitnessGoal, TrainingFrequency, Rule, UserIdentity } from './types';
