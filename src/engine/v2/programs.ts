import type { ProgramMaster } from './types';

/**
 * MARCH 26TH REFACTOR: 
 * Consolidated Base Program Library.
 */
export const PROGRAM_LIBRARY: ProgramMaster[] = [
  {
    code: 'P-GRN-2',
    name: 'Green / Independent / 2 Days',
    trainerizeId: 'tz_P_GRN_2',
    description: 'Green / Independent / 2 days per week',
    riskLevel: 'GREEN'
  },
  {
    code: 'P-GRN-3',
    name: 'Green / Independent / 3 Days',
    trainerizeId: 'tz_P_GRN_3',
    description: 'Green / Independent / 3 days per week',
    riskLevel: 'GREEN'
  },
  {
    code: 'P-GRN-4',
    name: 'Green / Independent / 4 Days',
    trainerizeId: 'tz_P_GRN_4',
    description: 'Green / Independent / 4 days per week',
    riskLevel: 'GREEN'
  },
  {
    code: 'P-AMB-2',
    name: 'Amber / Supported / 2 Days',
    trainerizeId: 'tz_P_AMB_2',
    description: 'Amber / Supported / 2 days per week',
    riskLevel: 'AMBER'
  },
  {
    code: 'P-AMB-3',
    name: 'Amber / Supported / 3 Days',
    trainerizeId: 'tz_P_AMB_3',
    description: 'Amber / Supported / 3 days per week',
    riskLevel: 'AMBER'
  },
  {
    code: 'P-BAL-2',
    name: 'Balance / Falls-Prevention',
    trainerizeId: 'tz_P_BAL_2',
    description: 'Balance / Falls-prevention emphasis / 2 days per week',
    riskLevel: 'BALANCE'
  },
  {
    code: 'P-CAR-2',
    name: 'Cardio-First / Low Musculoskeletal',
    trainerizeId: 'tz_P_CAR_2',
    description: 'Cardio-first / low musculoskeletal load / 2 days per week',
    riskLevel: 'CARDIO_LOW'
  },
  {
    code: 'P-MOB-2',
    name: 'Mobility & Movement Foundation',
    trainerizeId: 'tz_P_MOB_2',
    description: 'Mobility & movement foundation / 2 days per week',
    riskLevel: 'MOBILITY_FOUNDATION'
  },
  {
    code: 'P-RED-REF',
    name: 'Referral Required',
    trainerizeId: 'tz_P_RED_REF',
    description: 'Referral required / no auto-program',
    riskLevel: 'BLACK'
  }
];
