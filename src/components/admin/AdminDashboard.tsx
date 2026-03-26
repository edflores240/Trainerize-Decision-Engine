import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useRulesState } from './useRulesState';
import RuleList from './RuleList';
import LiveSandbox from './LiveSandbox';
import RuleEditorModal from './RuleEditorModal';
import { Plus, Save, CloudUpload } from 'lucide-react';
import type { Rule } from '../../engine';

interface AdminDashboardProps {
  onExit: () => void;
}

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { 
    rules, 
    isLoading, 
    isSaving, 
    saveToDisk, 
    reorderRules,
    updateRule,
    deleteRule,
    addRule
  } = useRulesState();

  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleReorder = (s: number, e: number) => { reorderRules(s, e); setHasUnsavedChanges(true); }
  const handleUpdate = (r: Rule) => { updateRule(r); setHasUnsavedChanges(true); setEditingRule(null); }
  const handleDelete = (id: string) => { deleteRule(id); setHasUnsavedChanges(true); }
  const handleAdd = (r: Rule) => { addRule(r); setHasUnsavedChanges(true); setIsCreating(false); }

  const handleSave = async () => {
    await saveToDisk();
    setHasUnsavedChanges(false);
  };

  if (isLoading) {
    return <div className="h-screen bg-zinc-50 text-zinc-500 flex items-center justify-center font-medium animate-pulse">Loading Rules Matrix...</div>;
  }

  return (
    <AdminLayout 
      onExit={onExit}
      sandbox={<LiveSandbox unsavedRules={rules} />}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-2">Triage Rules</h2>
          <p className="text-zinc-500 text-sm">
            Drag and drop to reorder priority. Top rules are evaluated first.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-sm rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
          
          <button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm
              ${hasUnsavedChanges && !isSaving 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10 hover:-translate-y-0.5' 
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
              }
            `}
          >
            {isSaving ? <CloudUpload className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Pushing to Database...' : 'Push to Live Environment'}
          </button>
        </div>
      </div>

      <RuleList 
        rules={rules} 
        onReorder={handleReorder} 
        onEdit={setEditingRule}
        onDelete={handleDelete}
      />

      {(isCreating || editingRule) && (
        <RuleEditorModal 
          rule={editingRule || undefined}
          onClose={() => { setEditingRule(null); setIsCreating(false); }}
          onSave={isCreating ? handleAdd : handleUpdate}
        />
      )}
    </AdminLayout>
  );
}
