import { useState, useMemo } from 'react';
import { runHeuristicTriage } from '../engine/v2/engine';
// import { useTrainerizeSyncV2 } from '../integrations/useTrainerizeSyncV2';
import type { SurveyInputV2, HealthCondition, Goal, Environment, PreferenceLevel, RiskLevel } from '../engine/v2/types';
import { CONDITION_RISK_MAP } from '../engine/v2/types';
import { Activity, Dumbbell, Home, Users, HeartPulse, Bone, ShieldAlert, ActivitySquare, CheckCircle2, Ban, Baby, Stethoscope, Zap, Info } from 'lucide-react';
import { PROGRAM_LIBRARY } from '../engine/v2/programs';

const CONDITIONS: { id: HealthCondition; label: string; icon: any }[] = [
  { id: 'Osteoarthritis', label: 'Osteoarthritis', icon: Bone },
  { id: 'Osteoporosis', label: 'Osteoporosis', icon: Activity },
  { id: 'Hypertension', label: 'Hypertension', icon: HeartPulse },
  { id: 'Heart Condition', label: 'Heart Condition', icon: HeartPulse },
  { id: 'Lumbar Herniation', label: 'Lumbar Issues', icon: ShieldAlert },
  { id: 'Neuropathy', label: 'Neuropathy', icon: ActivitySquare },
  { id: 'COPD', label: 'COPD', icon: Activity },
  { id: 'Glaucoma', label: 'Glaucoma', icon: Activity },
  { id: 'POTS', label: 'POTS', icon: HeartPulse },
  { id: 'Pregnancy', label: 'Pregnancy', icon: Baby },
  { id: 'Post-Surgical', label: 'Post-Surgical', icon: Stethoscope },
  { id: 'Balance Issues', label: 'Balance Issues', icon: ShieldAlert },
  { id: 'Undiagnosed Severe Pain', label: 'Severe Pain', icon: ShieldAlert },
];

const GOALS: { id: Goal; label: string }[] = [
  { id: 'HYPERTROPHY', label: 'Muscle Growth' },
  { id: 'WEIGHT_LOSS', label: 'Weight Loss' },
  { id: 'CARDIO', label: 'Cardio Fitness' },
  { id: 'MOBILITY', label: 'Mobility' },
  { id: 'BALANCE', label: 'Balance & Stability' },
  { id: 'ATHLETIC', label: 'Athletic Performance' },
];

const ENVIRONMENTS: { id: Environment; label: string; icon: any }[] = [
  { id: 'GYM', label: 'Full Gym', icon: Dumbbell },
  { id: 'HOME', label: 'Home Setup', icon: Home },
  { id: 'CLASS', label: 'Studio Class', icon: Users },
];

const PREFS: PreferenceLevel[] = ['LOW', 'MED', 'HIGH'];

export default function TriageDashboard() {
  const [input, setInput] = useState<SurveyInputV2>({
    conditions: [],
    goals: [],
    environments: [],
    complexity: 'MED',
    impact: 'MED',
    reps: 'MED',
  });

  // const [selectedProgamId, setSelectedProgramId] = useState<string | null>(null);

  // REAL-TIME ENGINE EVALUATION
  const userRisk: RiskLevel = useMemo(() => {
    let max: RiskLevel = 'GREEN';
    const priority: Record<RiskLevel, number> = { 'BLACK': 4, 'RED': 3, 'AMBER': 2, 'GREEN': 1 };
    input.conditions.forEach(c => {
      const level = CONDITION_RISK_MAP[c];
      if (priority[level] > priority[max]) max = level;
    });
    return max;
  }, [input.conditions]);

  const results = useMemo(() => runHeuristicTriage(input), [input]);
  // const winningProgram = results.length > 0 && !results[0].banned ? results[0] : null;

  // const { status, triggerSync } = useTrainerizeSyncV2(winningProgram, input);

  const toggleCondition = (c: HealthCondition) => {
    setInput(prev => ({
      ...prev,
      conditions: prev.conditions.includes(c) ? prev.conditions.filter(x => x !== c) : [...prev.conditions, c]
    }));
  };

  const toggleGoal = (g: Goal) => {
    setInput(prev => ({
      ...prev,
      goals: prev.goals.includes(g) ? prev.goals.filter(x => x !== g) : [...prev.goals, g]
    }));
  };

  const toggleEnv = (e: Environment) => {
    setInput(prev => ({
      ...prev,
      environments: prev.environments.includes(e) ? prev.environments.filter(x => x !== e) : [...prev.environments, e]
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 p-4 lg:p-0">

      {/* LEFT COLUMN: The Control Panel */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 mb-1 flex items-center gap-2">
            <ActivitySquare className="w-5 h-5 text-blue-600" /> Clinical Intakes
          </h2>
          <p className="text-sm text-zinc-500 mb-6 font-medium leading-tight">Strict safety vetoes based on medical flags.</p>

          <div className="grid grid-cols-1 gap-2.5">
            {CONDITIONS.map(c => {
              const Icon = c.icon;
              const isActive = input.conditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCondition(c.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-xs font-semibold transition-all ${isActive ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-500' : 'text-zinc-400'}`} />
                  {c.label}
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-rose-500" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Training Environment</h2>
          <div className="grid grid-cols-3 gap-3">
            {ENVIRONMENTS.map(e => {
              const Icon = e.icon;
              const isActive = input.environments.includes(e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => toggleEnv(e.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${isActive ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-black tracking-widest uppercase">{e.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Fitness Goals</h2>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => {
              const isActive = input.goals.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-2 ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                >
                  {g.id === 'ATHLETIC' && <Zap className="w-2.5 h-2.5" />}
                  {g.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            {[
              { id: 'complexity', label: 'Exercise Complexity' },
              { id: 'impact', label: 'Impact Tolerance' },
              { id: 'reps', label: 'Repetition Scheme' }
            ].map(prefGroup => (
              <div key={prefGroup.id}>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{prefGroup.label}</label>
                <div className="flex rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 p-1">
                  {PREFS.map(lvl => {
                    const isActive = input[prefGroup.id as keyof SurveyInputV2] === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setInput(prev => ({ ...prev, [prefGroup.id]: lvl }))}
                        className={`flex-1 py-1 text-[10px] font-black transition-all rounded-lg ${isActive ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
                      >
                        {lvl}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Real-Time Results Matrix */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-1">
              <span className={`inline-block px-3 py-1 rounded-xl mr-2 text-lg align-middle border-2 ${
                userRisk === ('BLACK' as RiskLevel) ? 'bg-zinc-900 border-zinc-900 text-white' :
                userRisk === ('RED' as RiskLevel) ? 'bg-rose-50 border-rose-500 text-rose-600' : 
                userRisk === ('AMBER' as RiskLevel) ? 'bg-amber-50 border-amber-500 text-amber-600' : 
                'bg-emerald-50 border-emerald-500 text-emerald-600'
              }`}>
                {userRisk} TIER
              </span>
              Programs
            </h1>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Clinical safety optimized routing.</p>
          </div>
          <div className="text-[10px] font-black text-white bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 uppercase tracking-widest shadow-lg shadow-zinc-200">
            {results.length} Matches Found
          </div>
        </div>

        <div className="flex-1 space-y-4 pb-12 pr-2">
          {userRisk === ('BLACK' as RiskLevel) ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-10 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
               <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200 mb-2">
                 <ShieldAlert className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-black text-rose-900">Immediate Clinical Stop</h2>
               <p className="text-rose-700 max-w-sm text-sm leading-relaxed">
                 Based on report, we cannot safely assign a self-guided program at this time.
               </p>
               <div className="h-px w-20 bg-rose-200 my-2" />
               <p className="text-xs font-bold text-rose-800 uppercase tracking-widest text-center px-4 py-2 border-2 border-rose-200 rounded-xl bg-white shadow-sm">
                 Next Steps: Refer to Medical Professional
               </p>
            </div>
          ) : (
            results.map((res, index) => {
              const isWinner = index === 0 && !res.banned;
              
              const tierColors: Record<RiskLevel, { border: string, bg: string, ring: string, accent: string, text: string }> = {
                'BLACK': { border: 'border-rose-300', bg: 'bg-rose-50', ring: 'shadow-rose-500/10', accent: 'rose', text: 'text-rose-600' },
                'RED': { border: 'border-rose-200', bg: 'bg-rose-50/50', ring: 'shadow-rose-500/10', accent: 'rose', text: 'text-rose-600' },
                'AMBER': { border: 'border-amber-200', bg: 'bg-amber-50/50', ring: 'shadow-amber-500/10', accent: 'amber', text: 'text-amber-600' },
                'GREEN': { border: 'border-emerald-200', bg: 'bg-emerald-50/50', ring: 'shadow-emerald-500/10', accent: 'emerald', text: 'text-emerald-600' }
              };

              const colors = tierColors[res.riskLevel];

              return (
                <div
                  key={res.code}
                  className={`w-full rounded-3xl border-2 transition-all duration-500 p-5 flex flex-col md:flex-row gap-5 items-start md:items-center relative group 
                    ${res.banned ? 'bg-zinc-50 border-zinc-200 opacity-60 grayscale' : isWinner ? `bg-white border-${colors.accent}-500 shadow-xl ${colors.ring} scale-[1.01] z-10` : `${colors.bg} ${colors.border} hover:border-${colors.accent}-400 hover:bg-white hover:shadow-lg shadow-sm`}
                  `}
                >
                  {/* Score Avatar */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-col flex-shrink-0 transition-all shadow-sm
                    ${res.banned ? 'bg-zinc-200 text-zinc-400' : isWinner ? `bg-${colors.accent}-500 text-white shadow-inner` : `bg-white border border-${colors.border} ${colors.text}`}
                  `}>
                    {res.banned ? <Ban className="w-6 h-6" /> : (
                      <>
                        <span className="text-xl font-black leading-none">{res.finalScore > 0 ? '+' : ''}{res.finalScore}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 mt-1">Pts</span>
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-black truncate ${res.banned ? 'text-zinc-500 line-through decoration-zinc-300' : 'text-zinc-900'}`}>
                          {res.name}
                        </h3>
                        {isWinner && (
                          <span className={`px-2 py-0.5 rounded-full bg-${colors.accent}-100 text-${colors.accent}-800 text-[8px] font-black uppercase tracking-widest border border-${colors.accent}-200`}>
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className={`text-[9px] font-mono font-bold ${colors.text} bg-${colors.accent}-50 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-${colors.border}`}>
                          {res.code}
                        </code>
                        <span className={`text-[8px] font-black uppercase tracking-widest opacity-60`}>{res.riskLevel} TIER</span>
                      </div>
                    </div>

                    {res.banned ? (
                      <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                        <ShieldAlert className="w-3.5 h-3.5" /> Safety Veto: {res.bannedReasons.join(', ')}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 line-clamp-1 italic">
                        {PROGRAM_LIBRARY.find(p => p.code === res.code)?.description}
                      </p>
                    )}
                  </div>

                  {/* Action Area */}
                  {!res.banned && (
                    <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      {/* Mathematical Breakdown Tooltip Trigger */}
                      <div className="relative group/breakdown">
                        <button className={`p-3 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-${colors.accent}-600 hover:border-${colors.accent}-300 hover:bg-${colors.accent}-50 transition-all shadow-sm`}>
                          <Info className="w-5 h-5" />
                        </button>
                        
                        {/* Light Mode Tooltip */}
                        <div className="absolute right-0 bottom-full mb-3 w-64 bg-white text-zinc-900 text-[10px] rounded-2xl p-4 shadow-2xl opacity-0 group-hover/breakdown:opacity-100 pointer-events-none transition-all z-30 border border-zinc-200 translate-y-2 group-hover/breakdown:translate-y-0">
                          <p className="font-bold text-zinc-400 mb-2 border-b border-zinc-100 pb-2 uppercase tracking-widest text-[9px]">Calculated Breakdown</p>
                          <ul className="space-y-1.5 flex flex-col">
                            {res.explainLog.map((log, i) => {
                              const isPositive = log.startsWith('+');
                              const isNegative = log.startsWith('-');
                              return (
                                <li key={i} className={`flex items-start gap-1.5 ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-zinc-500'}`}>
                                  <span className="mt-0.5">{isPositive ? '▲' : isNegative ? '▼' : '•'}</span>
                                  <span>{log.replace(/^[+-]\d+\sPoints\s/, '')} <strong className="float-right bg-zinc-50 px-1 rounded border border-zinc-100">{log.split(' ')[0]}</strong></span>
                                </li>
                              );
                            })}
                            <li className="mt-3 pt-2 border-t border-zinc-100 flex justify-between font-bold text-zinc-900 text-xs">
                              Final Matrix Score: <span>{res.finalScore}</span>
                            </li>
                          </ul>
                          <div className="absolute right-6 -bottom-2 w-4 h-4 bg-white border-r border-b border-zinc-200 rotate-45" />
                        </div>
                      </div>

                      {/* 
                      <button
                        onClick={() => {
                          setSelectedProgramId(res.trainerizeId);
                          if (isWinner) triggerSync();
                        }}
                        disabled={status === 'SYNCING' || (selectedProgamId === res.trainerizeId && status === 'SUCCESS')}
                        className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-[11px] font-black transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-widest
                          ${isWinner && status !== 'SUCCESS' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : `bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50`}
                          ${status === 'SUCCESS' && selectedProgamId === res.trainerizeId ? 'bg-emerald-500 text-white border-emerald-500' : ''}
                        `}
                      >
                        {status === 'SYNCING' && selectedProgamId === res.trainerizeId ? (
                          'Syncing...'
                        ) : status === 'SUCCESS' && selectedProgamId === res.trainerizeId ? (
                          <><CheckCircle2 className="w-4 h-4" /> Provisioned</>
                        ) : (
                          <>Assign Client <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                      */}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
