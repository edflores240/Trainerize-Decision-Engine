/**
 * @file types.ts
 * @description TypeScript type definitions for the Fitness Triage Engine.
 * All interfaces mirror the logic-matrix.json schema exactly.
 */

// ─── Input ───────────────────────────────────────────────────────────────────

/** Medical/safety risk level assessed during intake */
export type RiskLevel = 'GREEN' | 'AMBER' | 'RED' | 'REFER_OUT';

/** Physical modifier based on injury or capacity screening */
export type PhysicalModifier = 'STANDARD' | 'MACHINE' | 'JOINT' | 'BALANCE' | 'LOWCAP';

/** Training environment / equipment availability */
export type TrainingSetting = 'GYM' | 'HOME' | 'CLASS';

/** Primary fitness goal */
export type FitnessGoal = 'FULL' | 'STRENGTH' | 'STR_MOB' | 'MOBILITY' | 'BALANCE' | 'CARDIO';

/** Training frequency in sessions per week */
export type TrainingFrequency = 2 | 3 | 4;

export interface UserIdentity {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * The raw survey input payload sent from any frontend or service.
 * This is the only input the engine requires.
 */
export interface SurveyInput {
  risk: RiskLevel;
  modifier: PhysicalModifier;
  setting: TrainingSetting;
  goal: FitnessGoal;
  frequency: TrainingFrequency;
  identity?: UserIdentity;
}

// ─── Output ──────────────────────────────────────────────────────────────────

/**
 * Action to take downstream after triage:
 * - AUTO_OK: Automatically assign to Trainerize program
 * - REVIEW_REQUIRED: Notify Coach for manual review
 * - REFERRAL_REQUIRED: Halt assignment, trigger Doctor Referral workflow
 */
export type ActionStatus = 'AUTO_OK' | 'REVIEW_REQUIRED' | 'REFERRAL_REQUIRED';

/** Downstream workflow identifier */
export type NextStep =
  | 'ASSIGN_TRAINERIZE_PROGRAM'
  | 'NOTIFY_COACH'
  | 'TRIGGER_DOCTOR_REFERRAL_WORKFLOW'
  | 'FALLBACK_REVIEW';

/**
 * The Decision Packet — the engine's output.
 * This is the single source of truth for all downstream actions.
 */
export interface DecisionPacket {
  /** Human-readable program title, e.g. "Hypertrophy Foundations" */
  program_name: string | null;
  /** Unique program identifier (e.g. "GRN-GYM-4D-STRENGTH-V1"). Null if REFERRAL_REQUIRED. */
  program_code: string | null;
  /** Determines the downstream workflow to trigger */
  action_status: ActionStatus;
  /** Specific downstream action to invoke */
  next_step: NextStep;
  /** The rule ID that produced this result (for auditability) */
  matched_rule_id: string;
  /** Non-null only when engine encounters an unexpected error */
  error?: string;
}

// ─── Rules Matrix (logic-matrix.json schema) ─────────────────────────────────

/** Wildcard "*" matches ANY value for that condition field */
export type WildcardOrValue<T> = T | T[] | '*';

export interface RuleConditions {
  risk: WildcardOrValue<RiskLevel>;
  modifier: WildcardOrValue<PhysicalModifier>;
  setting: WildcardOrValue<TrainingSetting>;
  goal: WildcardOrValue<FitnessGoal>;
}

export interface RuleResult {
  program_name: string | null;
  program_code: string | null;
  action_status: ActionStatus;
  next_step: NextStep;
}

export interface Rule {
  id: string;
  priority: number;
  description: string;
  conditions: RuleConditions;
  results: RuleResult;
}

export interface LogicMatrix {
  engine_version: string;
  rules: Rule[];
}
