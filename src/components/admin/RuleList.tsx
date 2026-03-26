import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import type { Rule } from '../../engine';

interface RuleListProps {
  rules: Rule[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onEdit: (rule: Rule) => void;
  onDelete: (ruleId: string) => void;
}

export default function RuleList({ rules, onReorder, onEdit, onDelete }: RuleListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-soft">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <h3 className="font-semibold tracking-tight text-zinc-900">Active Logic Rules</h3>
        <span className="text-xs text-zinc-600 bg-white border border-zinc-200 shadow-sm px-2.5 py-1 rounded-md font-medium">
          {rules.length} Rules Loaded
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="rules-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[200px]"
            >
              {rules.map((rule, index) => (
                <Draggable key={rule.id} draggableId={rule.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        group border-b border-zinc-100 relative bg-white transition-colors last:border-b-0
                        ${snapshot.isDragging ? 'shadow-float ring-1 ring-zinc-200 z-50 rounded-xl' : 'hover:bg-zinc-50/50'}
                      `}
                    >
                      <div className="flex items-stretch">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="px-4 flex items-center justify-center text-zinc-300 hover:text-zinc-600 transition-colors cursor-grab active:cursor-grabbing border-r border-zinc-100 bg-zinc-50/20 group-hover:bg-zinc-50/80"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Rule Content */}
                        <div className="flex-1 p-5 pr-20">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded shadow-sm">
                              {rule.id}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
                              Priority: {rule.priority}
                            </span>
                            <span className="text-sm font-semibold text-zinc-900 ml-1">
                              {rule.description}
                            </span>
                          </div>

                          {/* Minimal IF/THEN */}
                          <div className="mt-3 p-3.5 rounded-xl bg-zinc-50/50 border border-zinc-100">
                            <div className="text-xs text-zinc-500 flex items-center gap-2 mb-2">
                              <span className="font-bold text-zinc-400 shrink-0">IF (Input is)</span>
                              <div className="flex flex-wrap gap-x-1.5 gap-y-1">
                                {Object.entries(rule.conditions).map(([key, value], i, arr) => {
                                  if (value === '*') return null;
                                  return (
                                    <span key={key} className="inline-flex items-center">
                                      {key} ={' '}
                                      <span className="text-zinc-700 font-semibold bg-white shadow-sm border border-zinc-200 px-1.5 py-0.5 rounded mx-1">
                                        {Array.isArray(value) ? value.join(' OR ') : value}
                                      </span>
                                      {i < arr.length - 1 && arr.slice(i + 1).some(x => x[1] !== '*') && (
                                        <span className="text-zinc-400 ml-1">AND</span>
                                      )}
                                    </span>
                                  );
                                }).filter(Boolean)}
                                {Object.values(rule.conditions).every(v => v === '*') && (
                                  <span className="text-zinc-400 italic">Anything (Wildcard)</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-zinc-500 flex items-center gap-2 pt-2 border-t border-zinc-200/50">
                              <span className="font-bold text-zinc-900 shrink-0">THEN (Return)</span>
                              <span className="text-zinc-700 font-medium">
                                {rule.results.action_status} 
                                {rule.results.program_code && (
                                  <> → <span className="font-mono text-zinc-900 bg-zinc-200/50 px-1.5 py-0.5 rounded">{rule.results.program_code}</span></>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onEdit(rule)}
                            className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors bg-white shadow-sm border border-zinc-200"
                            title="Edit Rule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this rule?')) {
                                onDelete(rule.id);
                              }
                            }}
                            className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors bg-white shadow-sm border border-zinc-200"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
