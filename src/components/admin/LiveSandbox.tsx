import { useState, useMemo } from 'react';
import type { SurveyInput, Rule } from '../../engine';
import { processInput } from '../../engine/triageEngine';

interface LiveSandboxProps {
  unsavedRules: Rule[];
}

export default function LiveSandbox({ unsavedRules }: LiveSandboxProps) {
  const [testInput, setTestInput] = useState<SurveyInput>({
    risk: 'GREEN',
    modifier: 'STANDARD',
    setting: 'GYM',
    goal: 'STRENGTH',
    frequency: 3
  });

  const compiledRules = useMemo(() => {
    return (unsavedRules || []).map(rule => ({
      id: rule.id,
      priority: rule.priority,
      description: rule.description,
      results: rule.results,
      match: (input: SurveyInput) => {
        const check = (condition: any, val: any) => {
          if (condition === '*') return true;
          if (Array.isArray(condition)) return condition.includes(val);
          return condition === val;
        };
        return (
          check(rule.conditions.risk, input.risk) &&
          check(rule.conditions.modifier, input.modifier) &&
          check(rule.conditions.setting, input.setting) &&
          check(rule.conditions.goal, input.goal)
        );
      }
    })).sort((a, b) => b.priority - a.priority);
  }, [unsavedRules]);

  const result = useMemo(() => {
    if (!compiledRules.length) return null;
    return processInput(testInput, compiledRules);
  }, [testInput, compiledRules]);

  const handleChange = (field: keyof SurveyInput, value: string) => {
    setTestInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {(['risk', 'modifier', 'setting', 'goal', 'frequency'] as const).map(field => (
          <div key={field}>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 capitalize tracking-wide">{field}</label>
            <select
              value={testInput[field]}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none shadow-sm"
            >
              {field === 'risk' && <>
                <option value="GREEN">GREEN</option>
                <option value="AMBER">AMBER</option>
                <option value="RED">RED</option>
                <option value="REFER_OUT">REFER_OUT</option>
              </>}
              {field === 'modifier' && <>
                <option value="STANDARD">STANDARD</option>
                <option value="MACHINE">MACHINE</option>
                <option value="JOINT">JOINT</option>
                <option value="BALANCE">BALANCE</option>
                <option value="LOWCAP">LOWCAP</option>
              </>}
              {field === 'setting' && <>
                <option value="GYM">GYM</option>
                <option value="HOME">HOME</option>
                <option value="CLASS">CLASS</option>
              </>}
              {field === 'goal' && <>
                <option value="FULL">FULL</option>
                <option value="STRENGTH">STRENGTH</option>
                <option value="STR_MOB">STR_MOB</option>
                <option value="MOBILITY">MOBILITY</option>
                <option value="BALANCE">BALANCE</option>
                <option value="CARDIO">CARDIO</option>
              </>}
              {field === 'frequency' && <>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </>}
            </select>
          </div>
        ))}
      </div>

      <div className="pt-8 mt-2 border-t border-zinc-100">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Real-Time Evaluation Result</h3>
        
        {result ? (
          <div className="space-y-3">
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm
              ${result.action_status === 'REFERRAL_REQUIRED' ? 'bg-rose-50 border-rose-100' : 
                result.action_status === 'REVIEW_REQUIRED' ? 'bg-amber-50 border-amber-100' : 
                'bg-zinc-900 border-zinc-900 text-white'}
            `}>
              <span className={`text-lg font-bold tracking-tight mb-1
                ${result.action_status === 'REFERRAL_REQUIRED' ? 'text-rose-700' : 
                  result.action_status === 'REVIEW_REQUIRED' ? 'text-amber-700' : 
                  'text-white'}
              `}>
                {result.action_status}
              </span>
              <span className={`text-xs font-medium font-mono
                ${result.action_status === 'REFERRAL_REQUIRED' ? 'text-rose-500/70' : 
                  result.action_status === 'REVIEW_REQUIRED' ? 'text-amber-600/70' : 
                  'text-zinc-400'}
              `}>
                {result.program_code || 'No Internal Code'}
              </span>
            </div>

            <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex items-center justify-between shadow-sm">
              <span className="text-xs text-zinc-500 font-medium">Matched Rule</span>
              <span className="font-mono text-zinc-900 text-xs font-bold">{result.matched_rule_id}</span>
            </div>
            
            <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 shadow-sm">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Downstream Trigger</span>
              <span className="text-xs font-medium text-zinc-900">{result.next_step}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm font-medium text-zinc-400 italic text-center py-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            No rules currently matched.
          </div>
        )}
      </div>
    </div>
  );
}
