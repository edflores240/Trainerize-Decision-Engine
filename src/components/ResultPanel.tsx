import type { DecisionPacket, SurveyInput } from '../engine';

interface ResultPanelProps {
  packet: DecisionPacket;
  input: SurveyInput;
  onReset: () => void;
}

const STATUS_CONFIG = {
  AUTO_OK: {
    label: 'Cleared',
    color: 'text-zinc-900',
    bg: 'bg-zinc-100',
    icon: '✓',
    heading: 'Program Assigned',
    description: 'The client is cleared for automatic program assignment in Trainerize.',
  },
  REVIEW_REQUIRED: {
    label: 'Review Needed',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    icon: '!',
    heading: 'Coach Review Needed',
    description: 'This case has been flagged for manual coach review before program assignment.',
  },
  REFERRAL_REQUIRED: {
    label: 'Medical Hold',
    color: 'text-rose-700',
    bg: 'bg-rose-100',
    icon: '✕',
    heading: 'Referral Required',
    description: 'Program assignment has been halted. A medical clearance referral workflow has been triggered.',
  },
};

const NEXT_STEP_LABELS: Record<string, string> = {
  ASSIGN_TRAINERIZE_PROGRAM: 'Auto-assign program in Trainerize',
  NOTIFY_COACH: 'Send notification to Coach for manual review',
  TRIGGER_DOCTOR_REFERRAL_WORKFLOW: 'Generate Medical Clearance PDF + Notify Doctor',
  FALLBACK_REVIEW: 'Route to manual review queue',
};

const INPUT_LABELS: Record<string, Record<string, string>> = {
  risk: { GREEN: 'Cleared for Exercise', AMBER: 'Cleared with Limitations', RED: 'Active Medical Condition', REFER_OUT: 'Undiagnosed Severe Pain' },
  modifier: { STANDARD: 'No Limitations', MACHINE: 'Machine-Based Only', JOINT: 'Low-Impact Required', BALANCE: 'Balance Deficit', LOWCAP: 'Severely Deconditioned' },
  setting: { GYM: 'Commercial Gym', HOME: 'Home Setup', CLASS: 'Group Fitness' },
  goal: { FULL: 'Body Recomposition', STRENGTH: 'Hypertrophy & Strength', STR_MOB: 'Functional Athletics', MOBILITY: 'Mobility & Restoration', BALANCE: 'Core & Stability', CARDIO: 'Cardiovascular Endurance' },
};

export default function ResultPanel({ packet, input, onReset }: ResultPanelProps) {
  const config = STATUS_CONFIG[packet.action_status];
  const isReferral = packet.action_status === 'REFERRAL_REQUIRED';

  if (packet.program_name && packet.action_status !== 'REFERRAL_REQUIRED') {
    config.heading = packet.program_name;
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-[100dvh] md:min-h-0 md:rounded-3xl md:shadow-float md:border border-zinc-100 overflow-hidden flex flex-col relative animate-fade-in">
      
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        
        {/* Header Ribbon / Status */}
        <div className="flex items-center justify-between mb-8">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 ${config.bg} ${config.color}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </div>
          <button onClick={onReset} className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
            Start Over
          </button>
        </div>

        {/* Triage Verdict */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
            {config.heading}
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
            {config.description}
          </p>
        </div>

        {/* Danger Alert */}
        {isReferral && (
          <div className="mb-8 bg-rose-50 border border-rose-100 rounded-2xl p-5 text-center">
            <h3 className="font-semibold text-rose-800 mb-1">Safety Hold Active</h3>
            <p className="text-sm text-rose-600">Client must present physician clearance prior to physical exertion.</p>
          </div>
        )}

        {/* Details Card */}
        <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-5 mb-8 space-y-5">
          <div>
            <span className="block text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-1">Assigned Routine ID</span>
            <span className="font-mono text-zinc-900 font-medium">
              {packet.program_code || '—'}
            </span>
          </div>
          <div className="h-px w-full bg-zinc-200/60" />
          <div>
            <span className="block text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-1">Next Automated Step</span>
            <span className="text-zinc-700 font-medium text-sm">
              {NEXT_STEP_LABELS[packet.next_step] ?? packet.next_step}
            </span>
          </div>
          <div className="h-px w-full bg-zinc-200/60" />
          <div>
            <span className="block text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-2">Input Manifest</span>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(input).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 capitalize">{key}</span>
                  <span className="text-xs text-zinc-900 font-medium">{INPUT_LABELS[key]?.[String(value)] ?? String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-auto mt-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
            Rule Executed: {packet.matched_rule_id}
          </p>
        </div>

      </div>
    </div>
  );
}
