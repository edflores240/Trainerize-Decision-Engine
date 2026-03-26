/// <reference types="vite/client" />
import { useState } from 'react';
import type { SurveyInputV2, ProgramScore } from '../engine/v2/types';

export function useTrainerizeSyncV2(winningProgram: ProgramScore | null, input: SurveyInputV2) {
  const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const triggerSync = async () => {
    if (!winningProgram) return;
    setStatus('SYNCING');
    
    // Build context summary
    const summary = `Goals: ${input.goals.join('/') || 'Any'} | Env: ${input.environments.join('/') || 'Any'} | Prefs: ${input.complexity} Cpx, ${input.impact} Imp, ${input.reps} Reps`;

    const payload = {
      user_identity: {
        name: input.identity?.firstName ? `${input.identity.firstName} ${input.identity.lastName}` : 'Guest User',
        email: input.identity?.email || 'guest@example.com'
      },
      program_details: {
        code: winningProgram.code,
        trainerize_id: winningProgram.trainerizeId
      },
      context: {
        survey_summary: summary,
        medical_flags: input.conditions,
      },
      requires_coach_review: input.conditions.length > 0
    };

    console.log('🚀 [V2 WEBHOOK PAYLOAD]', JSON.stringify(payload, null, 2));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/pnu8k9hi5i3tusjpa8ir7z7gf4c7j9wr';
      
      const response = await fetch(webhookUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });

      if (!response.ok) throw new Error('Failed to reach Make.com');

      setStatus('SUCCESS');
    } catch (e) {
      console.error('Webhook failed:', e);
      setStatus('ERROR');
    }
  };

  return { status, setStatus, triggerSync };
}
