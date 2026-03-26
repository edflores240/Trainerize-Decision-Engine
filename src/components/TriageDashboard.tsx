import { useState, useMemo } from 'react';
import { runHeuristicTriage } from '../engine/v2/engine';
import type { SurveyInputV2, HealthCondition, Goal, Environment, PreferenceLevel } from '../engine/v2/types';
import { Activity, Dumbbell, Home, Users, Bone, ShieldAlert, ActivitySquare, Ban, Zap, ArrowUpRight, Sparkles } from 'lucide-react';

const CONDITIONS: { id: HealthCondition; label: string; icon: any }[] = [
  { id: 'Shoulder Pain', label: 'Shoulder Pain', icon: Activity },
  { id: 'Knee Pain', label: 'Knee Pain', icon: Activity },
  { id: 'Hip Pain', label: 'Hip Pain', icon: Activity },
  { id: 'Low Back Pain', label: 'Low Back Pain', icon: Activity },
  { id: 'Osteoarthritis', label: 'Osteoarthritis', icon: Bone },
  { id: 'Osteoporosis', label: 'Osteoporosis', icon: Bone },
  { id: 'Neuropathy', label: 'Neuropathy', icon: ActivitySquare },
  { id: 'Balance Issues', label: 'Balance Issues', icon: ShieldAlert },
  { id: 'No Floor Work', label: 'No Floor Work', icon: Ban },
  { id: 'Machine Only Preference', label: 'Machine Only', icon: Dumbbell },
];

const GOALS: { id: Goal; label: string }[] = [
  { id: 'HYPERTROPHY', label: 'Muscle Growth' },
  { id: 'CARDIO', label: 'Cardio Fitness' },
  { id: 'MOBILITY', label: 'Mobility' },
  { id: 'BALANCE', label: 'Balance & Confidence' },
  { id: 'GENERAL_STRENGTH', label: 'General Strength' },
];

const ENVIRONMENTS: { id: Environment; label: string; icon: any }[] = [
  { id: 'GYM', label: 'Full Gym', icon: Dumbbell },
  { id: 'HOME', label: 'Home Setup', icon: Home },
  { id: 'CLASS', label: 'Studio Class', icon: Users },
];

const PREFS: PreferenceLevel[] = ['LOW', 'MED', 'HIGH'];

export default function TriageDashboard() {
  const [input, setInput] = useState<SurveyInputV2>({
    walkingAid: false,
    fallsHistory: 'NONE',
    chairRiseDifficulty: false,
    floorTransferDifficulty: false,
    unsteadyGait: false,
    dizziness: false,
    breathlessLightActivity: false,
    walking10MinContinuous: true,
    strengthHistory: 'NONE',
    daysPerWeek: 3,
    
    doctorSaysSupervision: false,
    chestPainRecent: false,
    uncontrolledConditions: false,
    recentSurgeryNotCleared: false,
    repeatedFallsInjury: false,
    severePainDaily: false,
    neuroConditionUnchecked: false,

    conditions: [],
    goals: ['GENERAL_STRENGTH'],
    environments: ['GYM'],
    complexity: 'MED',
    impact: 'MED',
    reps: 'MED',
  });

  const results = useMemo(() => runHeuristicTriage(input), [input]);

  const setInputVal = (key: keyof SurveyInputV2, val: any) => {
    setInput(prev => ({ ...prev, [key]: val }));
  };

  const toggleArray = (key: 'conditions' | 'goals' | 'environments', val: any) => {
    setInput(prev => {
      const arr = prev[key] as any[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 p-4 lg:p-6 overflow-hidden">

      {/* LEFT COLUMN: The Matrix Sidebar */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)] lg:pr-4 scrollbar-hide">
        
        {/* Header Header */}
        <div className="border-b border-zinc-200 pb-4">
           <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
             <TriageIcon className="w-6 h-6 text-blue-600" /> Triage Engine V2.1
           </h1>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Heuristic Scoring + Modifier Matrix</p>
        </div>

        {/* Section 1: Medical Hard Stops */}
        <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200">
          <h2 className="text-[11px] font-black text-rose-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Hard Stop Referral Check
          </h2>
          <div className="space-y-2">
             {[
               { id: 'doctorSaysSupervision', label: 'Supervision Required by MD' },
               { id: 'chestPainRecent', label: 'Chest Pain (last 30 days)' },
               { id: 'severePainDaily', label: 'Severe Pain with daily tasks' }
             ].map(q => (
               <label key={q.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-rose-100 cursor-pointer hover:bg-rose-100 transition-all">
                 <input 
                   type="checkbox" 
                   checked={input[q.id as keyof SurveyInputV2] as boolean} 
                   onChange={(e) => setInputVal(q.id as keyof SurveyInputV2, e.target.checked)}
                   className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                 />
                 <span className="text-[11px] font-bold text-rose-900 leading-tight">{q.label}</span>
               </label>
             ))}
          </div>
        </div>

        {/* Section 2: Functional Gating (The Merge) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
           <h2 className="text-[11px] font-black text-zinc-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <ActivitySquare className="w-4 h-4 text-blue-600" /> Functional Safety Filters
          </h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
               <span className="text-[11px] font-bold text-zinc-800">Use Walking Aid?</span>
               <button 
                 onClick={() => setInputVal('walkingAid', !input.walkingAid)}
                 className={`w-12 h-6 rounded-full transition-all relative ${input.walkingAid ? 'bg-zinc-900' : 'bg-zinc-200'}`}
               >
                 <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all ${input.walkingAid ? 'left-7' : 'left-1'}`} />
               </button>
             </div>

             <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'unsteadyGait', label: 'Unsteady Gait' },
                  { id: 'dizziness', label: 'Positional Dizziness' },
                  { id: 'chairRiseDifficulty', label: 'Manual Chair Rise' },
                  { id: 'breathlessLightActivity', label: 'Breathless (Light)' },
                ].map(q => (
                  <label key={q.id} className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${input[q.id as keyof SurveyInputV2] ? 'bg-amber-50 border-amber-200 text-amber-900 font-black' : 'bg-white border-zinc-100 text-zinc-500'}`}>
                    <input type="checkbox" checked={input[q.id as keyof SurveyInputV2] as boolean} onChange={(e) => setInputVal(q.id as keyof SurveyInputV2, e.target.checked)} className="hidden" />
                    <span className="text-[10px]">{q.label}</span>
                  </label>
                ))}
             </div>
          </div>
        </div>

        {/* Section 3: Original Heuristic Controls (Scoring Drivers) */}
        <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-xl">
           <h2 className="text-[11px] font-black text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Heuristic Scoring Drivers
          </h2>
          
          <div className="space-y-6">
            {/* Goals */}
            <div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Primary Goals</span>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button 
                    key={g.id}
                    onClick={() => toggleArray('goals', g.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${input.goals.includes(g.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity & Impact */}
            <div className="grid grid-cols-2 gap-4">
               {['complexity', 'impact'].map(k => (
                 <div key={k}>
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{k}</span>
                   <div className="flex bg-zinc-800 rounded-xl p-1 border border-zinc-700">
                     {PREFS.map(p => (
                       <button
                         key={p}
                         onClick={() => setInputVal(k as any, p)}
                         className={`flex-1 py-1 text-[9px] font-black rounded-lg transition-all ${input[k as keyof SurveyInputV2] === p ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                       >
                         {p}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
            </div>

            {/* Environments */}
            <div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Equipment Access</span>
              <div className="flex gap-2">
                 {ENVIRONMENTS.map(e => (
                   <button
                    key={e.id}
                    onClick={() => toggleArray('environments', e.id)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${input.environments.includes(e.id) ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                   >
                     {e.label}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Conditions (Clinical Modifiers) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-[11px] font-black text-zinc-900 mb-4 uppercase tracking-widest">Clinical Conditions</h2>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c => {
              const Icon = c.icon;
              const isActive = input.conditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleArray('conditions', c.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl border text-[10px] font-bold transition-all ${isActive ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200'}`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-blue-500' : 'text-zinc-400'}`} />
                  <span className="truncate">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: The Matched Programs (Heuristic Ranking) */}
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-50 rounded-[40px] p-6 border border-zinc-200 shadow-inner overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-hide">
        <div className="mb-8 flex items-end justify-between">
           <div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tighter">Recommended Matrix</h2>
              <div className="flex items-center gap-3 mt-2">
                 <span className="bg-zinc-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Engine Mode: Heuristic + Matrix Merge</span>
                 <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{results.length} Candidates Found</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {results.map((res, i) => (
            <div 
              key={res.code} 
              className={`group flex flex-col bg-white rounded-[32px] p-6 border-2 transition-all duration-300 relative shadow-sm hover:shadow-xl ${i === 0 ? 'border-zinc-900 ring-4 ring-zinc-100 scale-[1.02]' : 'border-transparent hover:border-zinc-200'}`}
            >
              {i === 0 && <div className="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-xl">Top Clinical Match</div>}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-0.5">
                   <h3 className="text-xl font-black text-zinc-900 tracking-tight">{res.name}</h3>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{res.code}</span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black border ${
                  res.riskLevel === 'RED' ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                  res.riskLevel === 'AMBER' ? 'bg-amber-50 border-amber-200 text-amber-600' : 
                  'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                   {res.riskLevel} TIER
                </div>
              </div>

              {/* Explainer (Mini Tooltip) */}
              <div className="bg-zinc-50 rounded-2xl p-4 mb-4 border border-zinc-100 flex flex-col gap-2">
                 <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Pricing Strategy Calculation</span>
                 <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-zinc-900 tracking-tighter">{res.finalScore} <span className="text-sm text-zinc-400 font-medium">pts</span></span>
                    <div className="flex flex-col items-end group/info relative">
                       <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                       <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-zinc-200 rounded-xl p-3 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none">
                          <p className="text-[9px] font-black text-zinc-400 uppercase mb-2">Score Breakdown</p>
                          {res.explainLog.slice(0, 4).map((l, j) => (
                            <div key={j} className="text-[10px] text-zinc-600 font-bold mb-1 flex items-center gap-1">
                               <div className="w-1 h-1 rounded-full bg-emerald-400" /> {l}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Modifiers & Swaps (The Merge UI) */}
              <div className="mt-auto space-y-4 pt-4 border-t border-zinc-100">
                 {/* Modifiers */}
                 <div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Clinical Modifiers</span>
                    <div className="flex flex-wrap gap-1.5">
                       {res.modifiers.map(m => (
                         <span key={m} className={`px-2 py-1 rounded-lg text-[9px] font-black border ${m.startsWith('REFERRAL') ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                            {m}
                         </span>
                       ))}
                       {res.modifiers.length === 0 && <span className="text-[9px] text-zinc-300 font-medium italic">No safety modifiers required.</span>}
                    </div>
                 </div>

                 {/* Swaps */}
                 {Object.keys(res.swaps).length > 0 && (
                   <div className="bg-zinc-50/50 rounded-xl p-3 border border-dashed border-zinc-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Exercise Swaps Recommended</span>
                      </div>
                      <div className="space-y-1.5">
                         {Object.entries(res.swaps).map(([pat, rep]) => (
                           <div key={pat} className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-zinc-500 uppercase text-[8px]">{pat}</span>
                              <span className="text-zinc-800 bg-white px-2 py-0.5 rounded border border-zinc-100 shadow-sm">{rep}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TriageIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l4.24 4.24" />
      <path d="M14.83 14.83l4.24 4.24" />
      <path d="M2 12h6" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l4.24-4.24" />
      <path d="M14.83 9.17l4.24-4.24" />
    </svg>
  );
}
