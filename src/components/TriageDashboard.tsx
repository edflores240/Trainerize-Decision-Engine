import { useState, useMemo } from 'react';
import { runHeuristicTriage } from '../engine/v2/engine';
import type { SurveyInputV2, HealthCondition } from '../engine/v2/types';
import { Activity, Dumbbell, Bone, ShieldAlert, ActivitySquare, CheckCircle2, Ban, Zap, ArrowUpRight, Footprints, AlertCircle } from 'lucide-react';

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
    daysPerWeek: 2,
    
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
  const mainResult = results[0];

  const toggleCondition = (c: HealthCondition) => {
    setInput(prev => ({
      ...prev,
      conditions: prev.conditions.includes(c) ? prev.conditions.filter(x => x !== c) : [...prev.conditions, c]
    }));
  };

  const setInputVal = (key: keyof SurveyInputV2, val: any) => {
    setInput(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 p-4 lg:p-0">

      {/* LEFT COLUMN: The Control Panel */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-6">

        {/* Section 3A: Hard Stop Questions */}
        <div className="bg-rose-50 rounded-3xl p-6 shadow-sm border border-rose-200">
          <h2 className="text-sm font-black text-rose-900 mb-4 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Medical Hard Stops
          </h2>
          <div className="space-y-2">
             {[
               { id: 'doctorSaysSupervision', label: 'Doctor says no unsupervised exercise' },
               { id: 'chestPainRecent', label: 'Chest pain at rest/activity (30 days)' },
               { id: 'severePainDaily', label: 'Severe pain with daily movement' },
               { id: 'neuroConditionUnchecked', label: 'Neurological condition affecting balance' }
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

        {/* Section 3B: Functional Gating */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-sm font-black text-zinc-900 mb-4 uppercase tracking-widest flex items-center gap-2">
            <ActivitySquare className="w-4 h-4 text-blue-600" /> Functional Safety Filters
          </h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
               <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-zinc-800">Use Walking Aid?</span>
                 <span className="text-[9px] text-zinc-500 font-medium italic">e.g. Cane, walker</span>
               </div>
               <button 
                 onClick={() => setInputVal('walkingAid', !input.walkingAid)}
                 className={`w-12 h-6 rounded-full transition-all relative ${input.walkingAid ? 'bg-zinc-900' : 'bg-zinc-200'}`}
               >
                 <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all ${input.walkingAid ? 'left-7' : 'left-1'}`} />
               </button>
             </div>

             <div className="space-y-2">
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Falls in last 12 months?</span>
               <div className="flex gap-2">
                 {[
                   { id: 'NONE', label: 'None' },
                   { id: 'ONE_NO_INJURY', label: '1 (No Injury)' },
                   { id: 'TWO_OR_INJURY', label: '2+ or Injury' }
                 ].map(o => (
                   <button 
                     key={o.id}
                     onClick={() => setInputVal('fallsHistory', o.id)}
                     className={`flex-1 py-2 text-[10px] font-black rounded-xl border transition-all ${input.fallsHistory === o.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-500'}`}
                   >
                     {o.label}
                   </button>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'unsteadyGait', label: 'Unsteady Walking' },
                  { id: 'dizziness', label: 'Dizzy Standing' },
                  { id: 'chairRiseDifficulty', label: 'Hard to Rise/Chair' },
                  { id: 'floorTransferDifficulty', label: 'Hard to Floor' },
                  { id: 'breathlessLightActivity', label: 'Breathless Lights' },
                ].map(q => (
                  <label key={q.id} className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${input[q.id as keyof SurveyInputV2] ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-zinc-100 text-zinc-500'}`}>
                    <input 
                       type="checkbox" 
                       checked={input[q.id as keyof SurveyInputV2] as boolean} 
                       onChange={(e) => setInputVal(q.id as keyof SurveyInputV2, e.target.checked)}
                       className="hidden"
                    />
                    <span className="text-[10px] font-bold">{q.label}</span>
                  </label>
                ))}
             </div>
          </div>
        </div>

        {/* Section 3C: Training History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
           <h2 className="text-sm font-black text-zinc-900 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-600" /> Training Capacity
          </h2>
          <div className="space-y-4">
             <div className="space-y-2">
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Strength training (last 3m)?</span>
               <div className="flex gap-2">
                 {[
                   { id: 'NONE', label: 'No' },
                   { id: 'LOW', label: '1-2x/wk' },
                   { id: 'HIGH', label: '3+x/wk' }
                 ].map(o => (
                   <button 
                     key={o.id}
                     onClick={() => setInputVal('strengthHistory', o.id)}
                     className={`flex-1 py-2 text-[10px] font-black rounded-xl border transition-all ${input.strengthHistory === o.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-500'}`}
                   >
                     {o.label}
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Days per week</label>
               <div className="flex gap-2">
                 {[2, 3, 4].map(d => (
                   <button 
                     key={d}
                     onClick={() => setInputVal('daysPerWeek', d)}
                     className={`flex-1 py-2 text-[11px] font-black rounded-xl border transition-all ${input.daysPerWeek === d ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-500'}`}
                   >
                     {d} Days
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Section 4: Condition Conditions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-sm font-black text-zinc-900 mb-4 uppercase tracking-widest">Clinical Conditions</h2>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c => {
              const Icon = c.icon;
              const isActive = input.conditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCondition(c.id)}
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

      {/* RIGHT COLUMN: Production Matrix Output */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-1">
              {mainResult && (
                <span className={`inline-block px-3 py-1 rounded-xl mr-2 text-lg align-middle border-2 ${
                  mainResult.riskLevel === 'BLACK' ? 'bg-zinc-900 border-zinc-900 text-white' :
                  mainResult.riskLevel === 'RED' ? 'bg-rose-50 border-rose-500 text-rose-600' : 
                  mainResult.riskLevel === 'AMBER' ? 'bg-amber-50 border-amber-500 text-amber-600' : 
                  'bg-emerald-50 border-emerald-500 text-emerald-600'
                }`}>
                  {mainResult.riskLevel} TIER
                </span>
              )}
              Routing Matrix
            </h1>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">March 26th Production Logic Execution.</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 pb-12 pr-2">
          {!mainResult ? (
             <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-10 text-center flex flex-col items-center gap-4">
                <p className="text-zinc-400 font-bold">No program selected</p>
             </div>
          ) : (
            <div className={`w-full rounded-3xl border-2 transition-all duration-500 p-6 flex flex-col gap-6 bg-white shadow-xl ${mainResult.code === 'P-RED-REF' ? 'border-rose-500 ring-rose-50' : 'border-zinc-900 ring-zinc-50'}`}>
              
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-zinc-100 pb-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-zinc-900">{mainResult.name}</h2>
                    <span className="bg-zinc-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{mainResult.code}</span>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium italic">Base template routing outcome.</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Routing Integrity</span>
                   <span className="text-emerald-500 font-black text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 100% Match</span>
                </div>
              </div>

              {/* Modifiers List */}
              <div>
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> Modifier Tags Triggered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mainResult.modifiers.length > 0 ? mainResult.modifiers.map(m => (
                    <span key={m} className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${m.startsWith('REFERRAL') || m === 'MANUAL-REVIEW' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                       {m}
                    </span>
                  )) : <span className="text-xs text-zinc-400 font-medium">No modifiers triggered. Standard profile.</span>}
                </div>
              </div>

              {/* Exercise Swaps Table */}
              {Object.keys(mainResult.swaps).length > 0 && (
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Automated Exercise Swaps
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(mainResult.swaps).map(([pattern, replacement]) => (
                      <div key={pattern} className="flex items-center justify-between text-[11px] font-bold">
                         <span className="text-zinc-500 uppercase tracking-tighter">{pattern.replace('_', ' ')} Pattern</span>
                         <div className="flex items-center gap-2">
                            <span className="text-zinc-300">→</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-900 shadow-sm">{replacement}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explain Log (The "Why") */}
              <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Routing Justification
                 </h3>
                 <div className="space-y-2">
                    {mainResult.explainLog.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] text-zinc-300 font-medium">
                         <div className="mt-1 w-1 h-1 rounded-full bg-zinc-600" />
                         {log}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Referral Warning */}
              {mainResult.code === 'P-RED-REF' && (
                <div className="bg-rose-500 rounded-2xl p-5 text-white flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-full">
                      <AlertCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-black text-sm uppercase tracking-tight">Clinical referral required</p>
                      <p className="text-[11px] font-medium opacity-90">Based on Section 3A medical risk factors, this client cannot be auto-assigned.</p>
                   </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
