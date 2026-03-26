/**
 * MARCH 26TH REFACTOR: 
 * Moving from a large library of specific programs to a 
 * "Base Template + Modifiers + Exercise Swaps" architecture.
 */

export type RiskLevel = 'BLACK' | 'RED' | 'AMBER' | 'GREEN' | 'BALANCE' | 'CARDIO_LOW' | 'MOBILITY_FOUNDATION';

// Specific tags that drive exercise selection and coach review
export type ModifierTag = 
  | 'MOD-SHOULDER' 
  | 'MOD-KNEE' 
  | 'MOD-HIP' 
  | 'MOD-LOWBACK' 
  | 'MOD-BALANCE' 
  | 'MOD-CARDIOLOW' 
  | 'MOD-DECONDITIONED' 
  | 'MOD-OSTEOARTHRITIS' 
  | 'MOD-NEURO' 
  | 'MOD-OSTEOPOROSIS' 
  | 'MOD-DIZZINESS' 
  | 'MOD-HIGHBMI' 
  | 'MOD-BEGINNER' 
  | 'MOD-RECUMBENT-CARDIO' 
  | 'MOD-MACHINE-ONLY' 
  | 'MOD-NO-FLOOR' 
  | 'MOD-NO-OVERHEAD' 
  | 'MOD-SIT-TO-STAND-ASSIST' 
  | 'MANUAL-REVIEW' 
  | 'REFERRAL-GP' 
  | 'REFERRAL-EP-PHYSIO';

export type HealthCondition = 
  | 'Osteoarthritis' 
  | 'Osteoporosis' 
  | 'Hypertension' 
  | 'Heart Condition' 
  | 'Lumbar Herniation' 
  | 'Neuropathy' 
  | 'COPD' 
  | 'Glaucoma' 
  | 'POTS'
  | 'Pregnancy'
  | 'Post-Surgical'
  | 'Balance Issues'
  | 'Undiagnosed Severe Pain'
  | 'No Floor Work'          // User preference
  | 'Machine Only Preference' // User preference
  | 'Shoulder Pain'
  | 'Knee Pain'
  | 'Hip Pain'
  | 'Low Back Pain';

export type PreferenceLevel = 'LOW' | 'MED' | 'HIGH';
export type Environment = 'GYM' | 'HOME' | 'CLASS';
export type Goal = 'HYPERTROPHY' | 'CARDIO' | 'MOBILITY' | 'BALANCE' | 'WEIGHT_LOSS' | 'ATHLETIC' | 'GENERAL_STRENGTH';

export interface UserIdentity {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Functional Safety & Gating Questions (Section 3)
 */
export interface SurveyInputV2 {
  // Functional Gating (Section 3B/3C)
  walkingAid: boolean;               // Question: Need aid for most walking?
  fallsHistory: 'NONE' | 'ONE_NO_INJURY' | 'TWO_OR_INJURY'; // Question: Fallen in last 12m?
  chairRiseDifficulty: boolean;      // Question: Can get up from chair without hands?
  floorTransferDifficulty: boolean;  // Question: Can comfortably get to/from floor?
  unsteadyGait: boolean;             // Question: Feel unsteady when walking/turning?
  dizziness: boolean;                // Question: Dizzy when standing/changing position?
  breathlessLightActivity: boolean;   // Question: Breathless with very light activity?
  walking10MinContinuous: boolean;   // Question: Can walk 10m continuously?
  strengthHistory: 'NONE' | 'LOW' | 'HIGH'; // Question: Done strength in past 3m?
  daysPerWeek: 2 | 3 | 4;            // Question: Days/wk to train?

  // Medical Flags (Section 3A + Section 4)
  doctorSaysSupervision: boolean;
  chestPainRecent: boolean;
  uncontrolledConditions: boolean;
  recentSurgeryNotCleared: boolean;
  repeatedFallsInjury: boolean;       // Maps to BLACK referral
  severePainDaily: boolean;
  neuroConditionUnchecked: boolean;

  // General Inputs
  conditions: HealthCondition[];
  environments: Environment[];
  goals: Goal[];
  complexity: PreferenceLevel;
  impact: PreferenceLevel;
  reps: PreferenceLevel;
  identity?: Partial<UserIdentity>;
}

export interface ProgramScore {
  code: string;
  name: string;
  trainerizeId: string;
  riskLevel: RiskLevel;
  finalScore: number;
  banned: boolean;
  bannedReasons: string[];
  explainLog: string[];
  
  // NEW Production Fields
  modifiers: ModifierTag[];
  swaps: Record<string, string>; // Pattern -> Replacement
}

// Map conditions to modifiers (Section 4)
export const CONDITION_MODIFIER_MAP: Record<HealthCondition, ModifierTag[]> = {
  'Hypertension': [],
  'Heart Condition': [],
  'Shoulder Pain': ['MOD-SHOULDER', 'MOD-NO-OVERHEAD'],
  'Knee Pain': ['MOD-KNEE'],
  'Hip Pain': ['MOD-HIP'],
  'Low Back Pain': ['MOD-LOWBACK'],
  'Osteoarthritis': ['MOD-OSTEOARTHRITIS'],
  'Osteoporosis': ['MOD-OSTEOPOROSIS'],
  'Neuropathy': ['MOD-NEURO'],
  'No Floor Work': ['MOD-NO-FLOOR'],
  'Machine Only Preference': ['MOD-MACHINE-ONLY'],
  'Lumbar Herniation': ['MOD-LOWBACK'],
  'COPD': ['MOD-CARDIOLOW'],
  'Glaucoma': [],
  'POTS': [],
  'Pregnancy': [],
  'Post-Surgical': [],
  'Balance Issues': ['MOD-BALANCE'],
  'Undiagnosed Severe Pain': [],
};

export interface ProgramMaster {
  code: string;
  name: string;
  trainerizeId: string;
  description: string;
  riskLevel: RiskLevel;
}
