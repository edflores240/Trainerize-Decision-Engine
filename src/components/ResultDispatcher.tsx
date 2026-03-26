import type { DecisionPacket, SurveyInput } from '../engine';
import { PROGRAM_MAPPING } from '../constants/programMapping';
import { useTrainerizeSync } from '../integrations/useTrainerizeSync';

interface ResultDispatcherProps {
  packet: DecisionPacket;
  input: SurveyInput;
  onReset: () => void;
}

const INPUT_LABELS: Record<string, Record<string, string>> = {
  risk: { GREEN: 'Cleared for Exercise', AMBER: 'Cleared with Limitations', RED: 'Active Medical Condition', REFER_OUT: 'Undiagnosed Severe Pain' },
  modifier: { STANDARD: 'No Limitations', MACHINE: 'Machine-Based Only', JOINT: 'Low-Impact Required', BALANCE: 'Balance Deficit', LOWCAP: 'Severely Deconditioned' },
  setting: { GYM: 'Commercial Gym', HOME: 'Home Setup', CLASS: 'Group Fitness' },
  goal: { FULL: 'Body Recomposition', STRENGTH: 'Hypertrophy & Strength', STR_MOB: 'Functional Athletics', MOBILITY: 'Mobility & Restoration', BALANCE: 'Core & Stability', CARDIO: 'Cardiovascular Endurance' },
};

export default function ResultDispatcher({ packet, input, onReset }: ResultDispatcherProps) {
  const isReferral = packet.action_status === 'REFERRAL_REQUIRED';
  const trainerizeId = packet.program_code ? PROGRAM_MAPPING[packet.program_code] : null;
  const { status, sync } = useTrainerizeSync();

  // The Pseudo-Personalization Engine
  const generateExplanation = () => {
    const goalStr = INPUT_LABELS.goal[input.goal] || input.goal;
    const modStr = INPUT_LABELS.modifier[input.modifier] || input.modifier;
    const setStr = INPUT_LABELS.setting[input.setting] || input.setting;

    if (input.risk === 'RED' || input.risk === 'REFER_OUT') {
      return `Your safety is our top priority. Based on your medical disclosure, we cannot safely assign a physical program at this time.`;
    }

    if (input.modifier !== 'STANDARD') {
      return `Because you requested to train in a ${setStr.toLowerCase()} environment, but have a ${modStr.toLowerCase()} constraint, we have prioritized your safety. Your primary goal of ${goalStr.toLowerCase()} has been collapsed into this specialized protective pathway.`;
    }

    return `Based on your focus on ${goalStr.toLowerCase()} and your ${modStr.toLowerCase()} status, we've perfectly matched you with this curated ${setStr.toLowerCase()} program.`;
  };

  const handleSync = () => {
    // Note: If input.identity is undefined (e.g., from old dev state), fallback to a test identity
    const identity = input.identity || { firstName: 'Test', lastName: 'User', email: 'test@example.com' };
    sync(identity, packet, input, generateExplanation(), trainerizeId);
  };

  // SAFETY GATE: Hard Stop for Referrals
  if (isReferral) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white min-h-[100dvh] md:min-h-0 md:rounded-3xl md:shadow-float md:border border-zinc-100 overflow-hidden flex flex-col relative animate-fade-in">
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl text-rose-600">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">
            Medical Clearance Required
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed mb-8">
            {generateExplanation()}
          </p>
          
          <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-6 text-left mb-8 shadow-sm">
            <h3 className="font-bold text-rose-900 mb-2 uppercase tracking-widest text-[10px]">Action Required</h3>
            <p className="text-sm font-medium text-rose-700">
              Please download your clearance form and have it signed by your primary care physician before continuing.
            </p>
            <button className="mt-4 w-full bg-white border border-rose-200 text-rose-700 font-semibold py-2.5 rounded-xl shadow-sm hover:bg-rose-50 transition-colors text-sm">
              Download Medical Form PDF
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-auto mb-6">
            AUTOMATION HALTED • WEBHOOKS BLOCKED
          </p>

          <button onClick={onReset} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // STANDARD ROUTING (AUTO_OK or REVIEW_REQUIRED)
  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-[100dvh] md:min-h-0 md:rounded-3xl md:shadow-float md:border border-zinc-100 overflow-hidden flex flex-col relative animate-fade-in">
      
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        
        {/* Header Ribbon / Status */}
        <div className="flex items-center justify-between mb-8">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 
            ${packet.action_status === 'REVIEW_REQUIRED' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${packet.action_status === 'REVIEW_REQUIRED' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
            <span>{packet.action_status === 'REVIEW_REQUIRED' ? 'Coach Review' : 'Auto-Assigned'}</span>
          </div>
          <button onClick={onReset} className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
            Start Over
          </button>
        </div>

        {/* Pathway Verdict */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4 leading-tight">
            {packet.program_name || 'Curated Pathway'}
          </h1>
          <p className="text-sm font-medium text-zinc-600 leading-relaxed p-4 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm">
            "{generateExplanation()}"
          </p>
        </div>

        {/* Integration Specs */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 mb-8 space-y-5">
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-1.5">Trainerize Master ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-900 font-semibold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 text-sm">
                {trainerizeId || 'PENDING_REVIEW'}
              </span>
            </div>
          </div>
          <div className="h-px w-full bg-zinc-100" />
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-1.5">Internal Logic Node</span>
            <span className="text-zinc-700 font-medium text-sm inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {packet.program_code || '—'} (Rule {packet.matched_rule_id})
            </span>
          </div>
        </div>

        {/* Sync Lifecycle Footer */}
        <div className="mt-auto">
          {status === 'SUCCESS' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fade-in shadow-sm">
               <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-200">
                 <span className="text-emerald-600 text-xl font-bold">✓</span>
               </div>
               <h3 className="font-bold text-emerald-900 mb-1">Account Provisioned!</h3>
               <p className="text-sm text-emerald-700 font-medium">Please check your email for your official Trainerize invitation link.</p>
            </div>
          ) : status === 'ERROR' ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center animate-fade-in shadow-sm">
               <h3 className="font-bold text-rose-900 mb-1">Network Outage</h3>
               <p className="text-sm text-rose-700 font-medium mb-4">We couldn't connect to the routing server.</p>
               <button onClick={handleSync} className="w-full bg-white border border-rose-200 text-rose-700 font-bold py-2.5 rounded-xl shadow-sm hover:bg-rose-100 transition-colors text-sm">
                 Retry Sync Action
               </button>
            </div>
          ) : (
            <div className="space-y-4">
              {packet.action_status === 'REVIEW_REQUIRED' && (
                <p className="text-xs text-amber-700 font-semibold text-center px-2 bg-amber-50 py-2 rounded-lg border border-amber-100">
                  Note: A senior coach will personally review your specific modifier flags before your dynamic program goes live.
                </p>
              )}
              <button 
                onClick={handleSync}
                disabled={status === 'SYNCING'}
                className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                  ${status === 'SYNCING' 
                    ? 'bg-zinc-100 text-zinc-400 shadow-none cursor-wait border border-zinc-200' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10 hover:-translate-y-0.5 border border-zinc-900'
                  }
                `}
              >
                {status === 'SYNCING' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
                    Connecting to Trainerize...
                  </>
                ) : packet.action_status === 'REVIEW_REQUIRED' ? (
                  'Request Coach Review & Sync'
                ) : (
                  'Load Program in App'
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
