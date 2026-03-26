import { useState, useEffect } from 'react';
import type { Rule } from '../../engine';

export function useRulesState() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch rules from local Express API
  const fetchRules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('http://localhost:3001/api/rules');
      if (!res.ok) throw new Error('Failed to fetch rules');
      const data = await res.json();
      // Ensure priority ordering on load
      const sorted = data.rules.sort((a: Rule, b: Rule) => b.priority - a.priority);
      setRules(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error fetching rules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Save rules back to disk
  const saveToDisk = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const res = await fetch('http://localhost:3001/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });
      if (!res.ok) throw new Error('Failed to save rules to disk');
      // Toast / flash success could go here if we want
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error saving rules');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and Drop reorder
  const reorderRules = (startIndex: number, endIndex: number) => {
    const result = Array.from(rules);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Recalculate priorities strictly based on visual order
    // We arbitrarily start at 100 and count down. 
    // If the list gets huge, we can adjust, but for <50 rules this is fine.
    const reordered = result.map((rule, idx) => ({
      ...rule,
      priority: 100 - idx,
    }));

    setRules(reordered);
  };

  const updateRule = (updatedRule: Rule) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const addRule = (newRule: Rule) => {
    // Add to top, recalculate everything
    const newArr = [newRule, ...rules].map((r, idx) => ({
        ...r,
        priority: 100 - idx
    }));
    setRules(newArr);
  };

  return {
    rules,
    isLoading,
    isSaving,
    error,
    saveToDisk,
    reorderRules,
    updateRule,
    deleteRule,
    addRule,
    refreshFallback: fetchRules
  };
}
