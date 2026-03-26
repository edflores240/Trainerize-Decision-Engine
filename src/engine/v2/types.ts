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
  | 'Shoulder Pain'
  | 'Knee Pain'
  | 'Hip Pain'
  | 'Low Back Pain'
  | 'No Floor Work'          // User preference
  | 'Machine Only Preference'; // User preference

export type PreferenceLevel = 'LOW' | 'MED' | 'HIGH';
export type Environment = 'GYM' | 'HOME' | 'CLASS';
export type Goal = 'HYPERTROPHY' | 'CARDIO' | 'MOBILITY' | 'BALANCE' | 'WEIGHT_LOSS' | 'ATHLETIC' | 'GENERAL_STRENGTH';

export interface UserIdentity {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * MARCH 26TH UPDATE: 
 * Extending original v2 survey with functional gating questions.
 */
export interface SurveyInputV2 {
  // Functional Gating (Section 3B/3C)
  walkingAid: boolean;               
  fallsHistory: 'NONE' | 'ONE_NO_INJURY' | 'TWO_OR_INJURY'; 
  chairRiseDifficulty: boolean;      
  floorTransferDifficulty: boolean;  
  unsteadyGait: boolean;             
  dizziness: boolean;                
  breathlessLightActivity: boolean;   
  walking10MinContinuous: boolean;   
  strengthHistory: 'NONE' | 'LOW' | 'HIGH'; 
  daysPerWeek: 2 | 3 | 4;            

  // Medical Flags (Section 3A)
  doctorSaysSupervision: boolean;
  chestPainRecent: boolean;
  uncontrolledConditions: boolean;
  recentSurgeryNotCleared: boolean;
  repeatedFallsInjury: boolean;       
  severePainDaily: boolean;
  neuroConditionUnchecked: boolean;

  // General Inputs (Original V2)
  conditions: HealthCondition[];
  environments: Environment[];
  goals: Goal[];
  complexity: PreferenceLevel;
  impact: PreferenceLevel;
  reps: PreferenceLevel;
  identity?: Partial<UserIdentity>;
}

export type RiskLevel = 'BLACK' | 'RED' | 'AMBER' | 'GREEN';
export type ModifierTag = 
  | 'MOD-SHOULDER' | 'MOD-KNEE' | 'MOD-HIP' | 'MOD-LOWBACK' 
  | 'MOD-BALANCE' | 'MOD-CARDIOLOW' | 'MOD-DECONDITIONED' 
  | 'MOD-OSTEOARTHRITIS' | 'MOD-NEURO' | 'MOD-OSTEOPOROSIS' 
  | 'MOD-DIZZINESS' | 'MOD-HIGHBMI' | 'MOD-BEGINNER' 
  | 'MOD-MACHINE-ONLY' | 'MOD-NO-FLOOR' | 'MOD-NO-OVERHEAD' 
  | 'MOD-SIT-TO-STAND-ASSIST' | 'MANUAL-REVIEW' | 'REFERRAL-GP';

export interface ProgramScore {
  code: string;
  name: string;
  trainerizeId: string;
  riskLevel: RiskLevel;
  finalScore: number;
  banned: boolean;
  bannedReasons: string[];
  explainLog: string[];
  
  // MERGED Production Fields
  modifiers: ModifierTag[];
  swaps: Record<string, string>;
}

export const CONDITION_RISK_MAP: Record<HealthCondition, RiskLevel> = {
  'Undiagnosed Severe Pain': 'BLACK',
  'Hypertension': 'RED',
  'Heart Condition': 'RED',
  'POTS': 'RED',
  'COPD': 'RED',
  'Glaucoma': 'RED',
  'Osteoporosis': 'RED',
  'Osteoarthritis': 'AMBER',
  'Lumbar Herniation': 'AMBER',
  'Neuropathy': 'AMBER',
  'Pregnancy': 'AMBER',
  'Post-Surgical': 'AMBER',
  'Balance Issues': 'AMBER',
  'Shoulder Pain': 'GREEN',
  'Knee Pain': 'GREEN',
  'Hip Pain': 'GREEN',
  'Low Back Pain': 'GREEN',
  'No Floor Work': 'GREEN',
  'Machine Only Preference': 'GREEN',
};

// Map conditions to modifiers (Section 4)
export const CONDITION_MODIFIER_MAP: Record<HealthCondition, ModifierTag[]> = {
  'Shoulder Pain': ['MOD-SHOULDER', 'MOD-NO-OVERHEAD'],
  'Knee Pain': ['MOD-KNEE'],
  'Hip Pain': ['MOD-HIP'],
  'Low Back Pain': ['MOD-LOWBACK'],
  'Lumbar Herniation': ['MOD-LOWBACK'],
  'Osteoarthritis': ['MOD-OSTEOARTHRITIS'],
  'Osteoporosis': ['MOD-OSTEOPOROSIS'],
  'Neuropathy': ['MOD-NEURO'],
  'No Floor Work': ['MOD-NO-FLOOR'],
  'Machine Only Preference': ['MOD-MACHINE-ONLY'],
  'Hypertension': [],
  'Heart Condition': [],
  'POTS': [],
  'COPD': ['MOD-CARDIOLOW'],
  'Glaucoma': [],
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
  vetoConditions: HealthCondition[];
  boosts: {
    goals: Partial<Record<Goal, number>>;
    environments: Partial<Record<Environment, number>>;
    complexity: Record<PreferenceLevel, number>;
    impact: Record<PreferenceLevel, number>;
    reps: Record<PreferenceLevel, number>;
  };
}
