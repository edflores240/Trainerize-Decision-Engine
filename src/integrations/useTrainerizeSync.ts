/// <reference types="vite/client" />
import { useState } from 'react';
import type { DecisionPacket, SurveyInput, UserIdentity } from '../engine';

export type SyncStatus = 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';

export function useTrainerizeSync() {
  const [status, setStatus] = useState<SyncStatus>('IDLE');

  const sync = async (
    identity: UserIdentity,
    packet: DecisionPacket,
    input: SurveyInput,
    summaryStr: string,
    trainerizeId: string | null
  ) => {
    setStatus('SYNCING');

    const payload = {
      user_identity: {
        name: `${identity.firstName} ${identity.lastName}`,
        email: identity.email,
      },
      program_details: {
        code: packet.program_code,
        trainerize_id: trainerizeId,
      },
      context: {
        survey_summary: summaryStr,
        risk_status: input.risk,
      },
      requires_coach_review: packet.action_status === 'REVIEW_REQUIRED',
    };

    console.log('🚀 [WEBHOOK PAYLOAD OUTBOUND]');
    console.log(JSON.stringify(payload, null, 2));

    try {
      // Simulate webhook network latency for UX
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/pnu8k9hi5i3tusjpa8ir7z7gf4c7j9wr';
      
      const response = await fetch(webhookUrl, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload) 
      });

      if (!response.ok) throw new Error('Failed to reach Make.com');

      setStatus('SUCCESS');
    } catch (e) {
      console.error('Webhook failed:', e);
      setStatus('ERROR');
    }
  };

  return { status, sync };
}
