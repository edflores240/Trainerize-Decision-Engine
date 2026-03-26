export const PROGRAM_MAPPING: Record<string, string> = {
  // --- MEDICAL DEFINITIVE ---
  MED_HOLD: 'tz_000000_MEDICAL_REFERRAL',

  // --- GREEN JOINT CONSTRAINED (Collapses Goals) ---
  GRN_JOINT_GYM: 'tz_100101_GRN_JOINT_GYM_V1',
  GRN_JOINT_HOME: 'tz_100102_GRN_JOINT_HOME_V1',

  // --- GREEN BALANCE CONSTRAINED (Collapses Goals) ---
  GRN_BAL_GYM: 'tz_100201_GRN_BAL_GYM_V1',
  GRN_BAL_HOME: 'tz_100202_GRN_BAL_HOME_V1',

  // --- GREEN LOW CAPACITY (Collapses Goals & Setting) ---
  GRN_LOWCAP_BASE: 'tz_100300_GRN_LOWCAP_BASE_V1',

  // --- GREEN UNCONSTRAINED (Follows Goals) ---
  GRN_GYM_STR: 'tz_101001_GRN_GYM_STRENGTH_V1',
  GRN_GYM_CARDIO: 'tz_101002_GRN_GYM_CRDIO_V1',
  GRN_GYM_MOBILITY: 'tz_101003_GRN_GYM_MOBILITY_V1',
  
  GRN_HOME_STR: 'tz_102001_GRN_HOME_STRENGTH_V1',
  GRN_HOME_CARDIO: 'tz_102002_GRN_HOME_CRDIO_V1',
  GRN_HOME_MOBILITY: 'tz_102003_GRN_HOME_MOBILITY_V1',

  // --- AMBER CONSTRAINED (Collapses Goals & Modifiers) ---
  AMB_CONSTRAINED_GYM: 'tz_200101_AMB_MODIFIED_GYM_V1',
  AMB_CONSTRAINED_HOME: 'tz_200102_AMB_MODIFIED_HOME_V1',

  // --- AMBER UNCONSTRAINED (Collapses Goals) ---
  AMB_STD_GYM: 'tz_201001_AMB_BASE_GYM_V1',
  AMB_STD_HOME: 'tz_201002_AMB_BASE_HOME_V1',

  // --- CLASSES ---
  CLASS_PATHWAY_GRN: 'tz_900001_GRN_CLASS_ROUTER_V1',
  CLASS_PATHWAY_AMB: 'tz_900002_AMB_CLASS_ROUTER_V1',
};

export const PROGRAM_NAMES: Record<string, string> = {
  MED_HOLD: 'Physician Clearance Required',
  GRN_JOINT_GYM: 'Joint-Friendly Gym Protocol',
  GRN_JOINT_HOME: 'Joint-Friendly Home Protocol',
  GRN_BAL_GYM: 'Stability & Core Gym Focus',
  GRN_BAL_HOME: 'Stability & Core Home Focus',
  GRN_LOWCAP_BASE: 'Absolute Beginner Foundation',
  GRN_GYM_STR: 'Gym Hypertrophy & Strength',
  GRN_GYM_CARDIO: 'Gym Conditioning & Power',
  GRN_GYM_MOBILITY: 'Gym Restoration & Mobility',
  GRN_HOME_STR: 'Home Bodyweight Strength',
  GRN_HOME_CARDIO: 'Home HIIT & Conditioning',
  GRN_HOME_MOBILITY: 'Home Flow & Mobility',
  AMB_CONSTRAINED_GYM: 'Amber Modified Gym (Coach Monitored)',
  AMB_CONSTRAINED_HOME: 'Amber Modified Home (Coach Monitored)',
  AMB_STD_GYM: 'Amber Base Gym (Coach Monitored)',
  AMB_STD_HOME: 'Amber Base Home (Coach Monitored)',
  CLASS_PATHWAY_GRN: 'Studio Class Router (Independent)',
  CLASS_PATHWAY_AMB: 'Studio Class Router (Monitored)',
};
