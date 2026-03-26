import { useState } from 'react';
import type { Rule } from '../../engine';
import { X } from 'lucide-react';

interface RuleEditorModalProps {
  rule?: Rule;
  onSave: (rule: Rule) => void;
  onClose: () => void;
}

const CONDITION_FIELDS = ['risk', 'modifier', 'setting', 'goal'] as const;

export default function RuleEditorModal({ rule, onSave, onClose }: RuleEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Rule>>(
    rule || {
      id: `R${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      priority: 0,
      description: '',
      conditions: { risk: '*', modifier: '*', setting: '*', goal: '*' },
      results: { program_name: '', program_code: null, action_status: 'AUTO_OK', next_step: 'ASSIGN_TRAINERIZE_PROGRAM' }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Rule);
  };

  const setCondition = (field: keyof Rule['conditions'], value: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions!, [field]: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-zinc-200 shadow-float rounded-3xl w-full max-w-2xl overflow-hidden animate-slide-up">
        
        <header className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            {rule ? 'Edit Rule Matrix Node' : 'Create New Logic Rule'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-200/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="space-y-8">
            
            {/* Meta */}
            <div className="flex gap-4">
              <div className="w-32">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Rule ID</label>
                <input 
                  required
                  type="text" 
                  value={formData.id} 
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 font-mono transition-shadow outline-none"
                  placeholder="R00X"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Description</label>
                <input 
                  required
                  type="text" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-shadow outline-none"
                  placeholder="e.g. Amber High Risk Routing"
                />
              </div>
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 pb-2">IF (Input Conditions)</label>
              <div className="grid grid-cols-2 gap-4">
                {CONDITION_FIELDS.map(field => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5 capitalize">{field}</label>
                    <input 
                      type="text" 
                      value={Array.isArray(formData.conditions?.[field]) ? (formData.conditions?.[field] as string[]).join(',') : formData.conditions?.[field] as string}
                      onChange={e => setCondition(field, e.target.value)}
                      className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all outline-none"
                      placeholder="Use * for Wildcard"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-900 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">THEN (Return Output)</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Action Status</label>
                  <select
                    value={formData.results?.action_status}
                    onChange={e => setFormData({ ...formData, results: { ...formData.results!, action_status: e.target.value as any } })}
                    className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none appearance-none"
                  >
                    <option value="AUTO_OK">AUTO_OK</option>
                    <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
                    <option value="REFERRAL_REQUIRED">REFERRAL_REQUIRED</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Program Code (Internal)</label>
                    <input 
                      type="text" 
                      value={formData.results?.program_code || ''}
                      onChange={e => setFormData({ ...formData, results: { ...formData.results!, program_code: e.target.value || null } })}
                      className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none font-mono"
                      placeholder="Leave blank for null"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Program Name (Client Facing)</label>
                    <input 
                      type="text" 
                      value={formData.results?.program_name || ''}
                      onChange={e => setFormData({ ...formData, results: { ...formData.results!, program_name: e.target.value || null } })}
                      className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                      placeholder="e.g. Gym Hypertrophy"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Next Step Webhook Trigger</label>
                  <input 
                    type="text" 
                    required
                    value={formData.results?.next_step || ''}
                    onChange={e => setFormData({ ...formData, results: { ...formData.results!, next_step: e.target.value as any } })}
                    className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5"
            >
              {rule ? 'Update Rule' : 'Save New Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
