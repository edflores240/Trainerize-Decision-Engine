import type { ProgramMaster } from './types';

export const PROGRAM_LIBRARY: ProgramMaster[] = [
  // --- GRN (GREEN) / HEALTHY / UNRESTRICTED PROGRAMS ---
  {
    code: 'GRN_2D_FULL',
    name: '2-Day Full Body Foundations',
    trainerizeId: 'tz_GRN_2D_FULL',
    description: 'A twice-a-week comprehensive full body routine.',
    riskLevel: 'GREEN',
    vetoConditions: ['Osteoarthritis', 'Lumbar Herniation', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 10, WEIGHT_LOSS: 10 },
      environments: { GYM: 10, HOME: 5 },
      complexity: { HIGH: 5, MED: 10, LOW: 5 },
      impact: { HIGH: 5, MED: 10, LOW: 0 },
      reps: { LOW: 5, MED: 10, HIGH: 5 }
    }
  },
  {
    code: 'GRN_3D_FULL',
    name: '3-Day Full Body Hypertrophy',
    trainerizeId: 'tz_GRN_3D_FULL',
    description: 'A 3x weekly heavy hypertrophic full body split.',
    riskLevel: 'GREEN',
    vetoConditions: ['Osteoarthritis', 'Lumbar Herniation', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 20 },
      environments: { GYM: 15, HOME: 5 },
      complexity: { HIGH: 10, MED: 10, LOW: 0 },
      impact: { HIGH: 10, MED: 5, LOW: 0 },
      reps: { LOW: 10, MED: 10, HIGH: 0 }
    }
  },
  {
    code: 'GRN_4D_STRENGTH',
    name: '4-Day Split Strength Matrix',
    trainerizeId: 'tz_GRN_4D_STRENGTH',
    description: 'Advanced 4-day barbell strength split.',
    riskLevel: 'GREEN',
    vetoConditions: ['Osteoarthritis', 'Lumbar Herniation', 'Neuropathy', 'Hypertension', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 25 },
      environments: { GYM: 20 },
      complexity: { HIGH: 20, MED: 5, LOW: -10 },
      impact: { HIGH: 15, MED: 5, LOW: -10 },
      reps: { LOW: 20, MED: 5, HIGH: -10 }
    }
  },
  {
    code: 'GRN_2D_STR_MOB',
    name: '2-Day Strength & Mobility',
    trainerizeId: 'tz_GRN_2D_STR_MOB',
    description: 'Hybrid routine focused on lifting and deep mobility.',
    riskLevel: 'GREEN',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 10, MOBILITY: 20 },
      environments: { GYM: 10, HOME: 10 },
      complexity: { HIGH: 5, MED: 10, LOW: 10 },
      impact: { HIGH: -5, MED: 5, LOW: 10 },
      reps: { LOW: 0, MED: 10, HIGH: 10 }
    }
  },
  {
    code: 'GRN_3D_STR_MOB',
    name: '3-Day Strength & Mobility',
    trainerizeId: 'tz_GRN_3D_STR_MOB',
    description: 'Higher frequency hybrid mobility/strength.',
    riskLevel: 'GREEN',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 15, MOBILITY: 20 },
      environments: { GYM: 15, HOME: 10 },
      complexity: { HIGH: 10, MED: 10, LOW: 5 },
      impact: { HIGH: 0, MED: 10, LOW: 5 },
      reps: { LOW: 5, MED: 10, HIGH: 10 }
    }
  },
  {
    code: 'GRN_2D_MOBILITY',
    name: '2-Day Pure Mobility Flow',
    trainerizeId: 'tz_GRN_2D_MOBILITY',
    description: 'Strictly mobility, flexibility, and recovery.',
    riskLevel: 'GREEN',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 30, BALANCE: 10, HYPERTROPHY: -10 },
      environments: { HOME: 20, GYM: 10, CLASS: 10 },
      complexity: { HIGH: -10, MED: 10, LOW: 20 },
      impact: { HIGH: -20, MED: -10, LOW: 30 },
      reps: { LOW: -10, MED: 5, HIGH: 20 }
    }
  },

  // --- AMB (AMBER) / CLINICAL CONSTRAINT PROGRAMS ---
  {
    code: 'AMB_2D_MACHINE_FULL',
    name: '2-Day Machine Base (Low Complexity)',
    trainerizeId: 'tz_AMB_2D_MACHINE_FULL',
    description: 'Safe, locked-in machine workout avoiding free weights.',
    riskLevel: 'AMBER',
    vetoConditions: ['Neuropathy', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 15, WEIGHT_LOSS: 10 },
      environments: { GYM: 30, HOME: -50 },
      complexity: { HIGH: -30, MED: 5, LOW: 30 },
      impact: { HIGH: -20, MED: 10, LOW: 20 },
      reps: { LOW: 0, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'AMB_3D_MACHINE_FULL',
    name: '3-Day Machine Base (Low Complexity)',
    trainerizeId: 'tz_AMB_3D_MACHINE_FULL',
    description: 'Higher frequency machine-only training.',
    riskLevel: 'AMBER',
    vetoConditions: ['Neuropathy', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 20, WEIGHT_LOSS: 15 },
      environments: { GYM: 30, HOME: -50 },
      complexity: { HIGH: -30, MED: 5, LOW: 30 },
      impact: { HIGH: -20, MED: 10, LOW: 20 },
      reps: { LOW: 0, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'AMB_2D_JOINT_STR_MOB',
    name: '2-Day Joint-Friendly Hybrid',
    trainerizeId: 'tz_AMB_2D_JOINT_STR_MOB',
    description: 'Protects cartilage while building strength and mobility.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 25, HYPERTROPHY: 10 },
      environments: { HOME: 15, GYM: 15 },
      complexity: { HIGH: -10, MED: 15, LOW: 15 },
      impact: { HIGH: -40, MED: -10, LOW: 30 },
      reps: { LOW: -10, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'AMB_3D_JOINT_STR_MOB',
    name: '3-Day Joint-Friendly Hybrid',
    trainerizeId: 'tz_AMB_3D_JOINT_STR_MOB',
    description: 'Higher frequency cartilage protection.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 25, HYPERTROPHY: 15 },
      environments: { HOME: 15, GYM: 15 },
      complexity: { HIGH: -10, MED: 15, LOW: 15 },
      impact: { HIGH: -40, MED: -10, LOW: 30 },
      reps: { LOW: -10, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'AMB_2D_BALANCE',
    name: '2-Day Balance Deficit Protocol',
    trainerizeId: 'tz_AMB_2D_BALANCE',
    description: 'Ground-up stability and proprioception recovery.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { BALANCE: 40, MOBILITY: 10 },
      environments: { HOME: 15, GYM: 10 },
      complexity: { HIGH: -30, MED: -10, LOW: 30 },
      impact: { HIGH: -50, MED: -20, LOW: 40 },
      reps: { LOW: 10, MED: 15, HIGH: 0 }
    }
  },
  {
    code: 'AMB_2D_LOWCAP',
    name: '2-Day Low Capacity (COPD/Cardiac)',
    trainerizeId: 'tz_AMB_2D_LOWCAP',
    description: 'High-rest, low-exertion medical baseline.',
    riskLevel: 'RED',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { CARDIO: 15, WEIGHT_LOSS: 10 },
      environments: { HOME: 20, GYM: 5 },
      complexity: { HIGH: -20, MED: 0, LOW: 20 },
      impact: { HIGH: -40, MED: -10, LOW: 30 },
      reps: { LOW: -20, MED: 10, HIGH: 20 }
    }
  },
  {
    code: 'AMB_3D_LOWCAP',
    name: '3-Day Low Capacity (COPD/Cardiac)',
    trainerizeId: 'tz_AMB_3D_LOWCAP',
    description: 'Frequent but very light exertion sessions.',
    riskLevel: 'RED',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { CARDIO: 20, WEIGHT_LOSS: 15 },
      environments: { HOME: 20, GYM: 5 },
      complexity: { HIGH: -20, MED: 0, LOW: 20 },
      impact: { HIGH: -40, MED: -10, LOW: 30 },
      reps: { LOW: -20, MED: 10, HIGH: 20 }
    }
  },
  
  // --- SPECIALTY PROGRAMS ---
  {
    code: 'BALANCE_PROGRESSIVE',
    name: 'Progressive Balance Optimization',
    trainerizeId: 'tz_BALANCE_PROGRESSIVE',
    description: 'Advancing beyond basic stability into active balance metrics.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain', 'Neuropathy'],
    boosts: {
      goals: { BALANCE: 30 },
      environments: { GYM: 10, HOME: 10 },
      complexity: { HIGH: 15, MED: 15, LOW: -10 },
      impact: { HIGH: 0, MED: 10, LOW: 10 },
      reps: { LOW: 10, MED: 10, HIGH: 0 }
    }
  },
  {
    code: 'HOME_LOW_CAPACITY',
    name: 'Strict Home Safety Baseline',
    trainerizeId: 'tz_HOME_LOW_CAPACITY',
    description: 'Zero equipment, ultra-safe recovery baseline.',
    riskLevel: 'RED',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 10, BALANCE: 10, CARDIO: 10 },
      environments: { HOME: 50, GYM: -50 },
      complexity: { HIGH: -50, MED: -20, LOW: 40 },
      impact: { HIGH: -50, MED: -30, LOW: 40 },
      reps: { LOW: 0, MED: 10, HIGH: 10 }
    }
  },
  {
    code: 'RETURN_TO_EXERCISE',
    name: 'Return To Exercise Protocol',
    trainerizeId: 'tz_RETURN_TO_EXERCISE',
    description: 'The standard on-ramp for detrained individuals.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain', 'Osteoarthritis', 'Hypertension'],
    boosts: {
      goals: { WEIGHT_LOSS: 20, CARDIO: 10, HYPERTROPHY: 10 },
      environments: { GYM: 15, HOME: 15 },
      complexity: { HIGH: -20, MED: 0, LOW: 20 },
      impact: { HIGH: -10, MED: 10, LOW: 10 },
      reps: { LOW: 0, MED: 10, HIGH: 20 }
    }
  },
  {
    code: 'MOBILITY_ONLY',
    name: 'Clinical Mobility Restoration',
    trainerizeId: 'tz_MOBILITY_ONLY',
    description: 'Deep restorative work for post-injury or severe tightness.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 50 },
      environments: { HOME: 20, GYM: 10 },
      complexity: { HIGH: -30, MED: 0, LOW: 30 },
      impact: { HIGH: -60, MED: -30, LOW: 50 },
      reps: { LOW: -20, MED: 10, HIGH: 30 }
    }
  },
  {
    code: 'AMB_PREGNANCY_HOME',
    name: 'Prenatal Safe Foundations (Home)',
    trainerizeId: 'tz_PREGNANCY_SAFE',
    description: 'Specialized prenatal care, avoiding supine and high impact.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain', 'Hypertension', 'Heart Condition'],
    boosts: {
      goals: { MOBILITY: 15, BALANCE: 10 },
      environments: { HOME: 30 },
      complexity: { HIGH: -20, MED: 10, LOW: 10 },
      impact: { HIGH: -50, MED: -20, LOW: 40 },
      reps: { LOW: -10, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'AMB_POST_SURGICAL_GYM',
    name: 'Post-Surgical Strength Rehab (Gym)',
    trainerizeId: 'tz_POST_SURGICAL_REHAB',
    description: 'Controlled machine-based loading for post-surgical recovery.',
    riskLevel: 'AMBER',
    vetoConditions: ['Heart Condition', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { HYPERTROPHY: 10, MOBILITY: 10 },
      environments: { GYM: 40 },
      complexity: { HIGH: -50, MED: -20, LOW: 40 },
      impact: { HIGH: -60, MED: -30, LOW: 50 },
      reps: { LOW: 0, MED: 15, HIGH: 10 }
    }
  },
  {
    code: 'GRN_3D_ATHLETIC_GYM',
    name: '3-Day Athletic Performance Split',
    trainerizeId: 'tz_ATHLETIC_PERFORMANCE',
    description: 'Explosive, high-performance athletic training protocol.',
    riskLevel: 'GREEN',
    vetoConditions: ['Osteoarthritis', 'Osteoporosis', 'Heart Condition', 'Balance Issues', 'Undiagnosed Severe Pain'],
    boosts: {
      goals: { ATHLETIC: 40, HYPERTROPHY: 15 },
      environments: { GYM: 20 },
      complexity: { HIGH: 30, MED: 0, LOW: -20 },
      impact: { HIGH: 30, MED: 5, LOW: -20 },
      reps: { LOW: 10, MED: 15, HIGH: -10 }
    }
  },
  {
    code: 'AMB_2D_CHAIR_BASE',
    name: 'Seated Chair Foundations',
    trainerizeId: 'tz_CHAIR_FOUNDATIONS',
    description: 'Ultra-low impact, seated-only movements for restricted mobility.',
    riskLevel: 'AMBER',
    vetoConditions: ['Undiagnosed Severe Pain'],
    boosts: {
      goals: { MOBILITY: 10, BALANCE: 20 },
      environments: { HOME: 20, GYM: 5 },
      complexity: { HIGH: -40, MED: -10, LOW: 40 },
      impact: { HIGH: -70, MED: -30, LOW: 60 },
      reps: { LOW: -10, MED: 10, HIGH: 20 }
    }
  }
];
