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
  | 'Undiagnosed Severe Pain';

export type PreferenceLevel = 'LOW' | 'MED' | 'HIGH';
export type Environment = 'GYM' | 'HOME' | 'CLASS';
export type Goal = 'HYPERTROPHY' | 'CARDIO' | 'MOBILITY' | 'BALANCE' | 'WEIGHT_LOSS' | 'ATHLETIC';

export interface UserIdentity {
  firstName: string;
  lastName: string;
  email: string;
}

export interface SurveyInputV2 {
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
  explainLog: string[]; // e.g. ["+10 for Hypertrophy Goal", "-5 for High Impact Request"]
}

export type RiskLevel = 'BLACK' | 'RED' | 'AMBER' | 'GREEN';

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
};

export interface ProgramMaster {
  code: string;
  name: string;
  trainerizeId: string;
  description: string;
  riskLevel: RiskLevel; // The 'tier' this program belongs to
  
  // Veto Engine Flags
  vetoConditions: HealthCondition[]; // If a user has ANY of these conditions, the program is BANNED
  
  // Scoring Engine Boosts
  boosts: {
    goals: Partial<Record<Goal, number>>;
    environments: Partial<Record<Environment, number>>;
    complexity: Record<PreferenceLevel, number>;
    impact: Record<PreferenceLevel, number>;
    reps: Record<PreferenceLevel, number>;
  };
}
