/**
 * @file makeWebhook.ts
 * @description Integration utility for triggering Make.com (formerly Integromat) workflows
 * from the Fitness Triage Engine Decision Packet.
 *
 * ─── DOWNSTREAM WORKFLOW MAPPING ─────────────────────────────────────────────
 *
 *  action_status          → Downstream Trigger
 *  ─────────────────────────────────────────────────────────────────
 *  AUTO_OK                → Trainerize: Auto-assign program_code to client
 *  REVIEW_REQUIRED        → CRM/Slack: Notify Coach for manual review
 *  REFERRAL_REQUIRED      → Doctor Portal: Generate Medical Clearance PDF
 *                           + Email referral to doctor on file
 *
 * ─── HOW TO SET UP IN MAKE.COM ───────────────────────────────────────────────
 * 1. Create a new Scenario in Make.com
 * 2. Add a "Webhooks > Custom Webhook" trigger module
 * 3. Copy the generated webhook URL into MAKE_WEBHOOK_URL below (or env var)
 * 4. Add downstream modules based on action_status:
 *    - Filter: action_status = "AUTO_OK"     → Trainerize HTTP module
 *    - Filter: action_status = "REVIEW_REQUIRED" → Slack / Email module
 *    - Filter: action_status = "REFERRAL_REQUIRED" → PDF Generator + Email
 *
 * ─── SUPABASE ALTERNATIVE ─────────────────────────────────────────────────────
 * Instead of a direct webhook, you can insert the DecisionPacket into a
 * Supabase table and use a Postgres trigger or Realtime subscription to
 * fan out to Make.com. This decouples the UI call from the webhook latency.
 */

import type { DecisionPacket } from '../engine/types';

/**
 * Replace this with your Make.com Custom Webhook URL.
 * In production, load this from an environment variable:
 *   const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;
 */
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL ?? '';

export interface WebhookPayload {
  /** ISO timestamp of when the triage was completed */
  timestamp: string;
  /** The full Decision Packet from the engine */
  decision: DecisionPacket;
  /** Optional: client identifier for CRM linking */
  client_id?: string;
}

/**
 * Sends the Decision Packet to a Make.com webhook.
 *
 * Make.com will route the payload to the correct downstream workflow
 * based on the action_status value:
 *   - AUTO_OK            → Trainerize program assignment
 *   - REVIEW_REQUIRED    → Coach notification
 *   - REFERRAL_REQUIRED  → Medical referral PDF + Doctor email
 *
 * @param packet    - DecisionPacket from the triage() engine call
 * @param clientId  - Optional client identifier for CRM tracking
 * @returns         - Promise that resolves when the webhook is delivered
 *
 * @example
 * // In your form submission handler:
 * const result = triage(surveyInput);
 * await triggerMakeWebhook(result, 'client_abc123');
 */
export async function triggerMakeWebhook(
  packet: DecisionPacket,
  clientId?: string
): Promise<void> {
  if (!MAKE_WEBHOOK_URL) {
    console.warn('[FitnessEngine] VITE_MAKE_WEBHOOK_URL is not set. Skipping webhook.');
    return;
  }

  const payload: WebhookPayload = {
    timestamp: new Date().toISOString(),
    decision: packet,
    ...(clientId ? { client_id: clientId } : {}),
  };

  const response = await fetch(MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Make.com webhook failed: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Example: Calling the engine + webhook from any frontend or backend
 *
 * @example
 * import { triage } from '../engine';
 * import { triggerMakeWebhook } from '../integrations/makeWebhook';
 *
 * async function handleSurveySubmit(surveyData: SurveyInput) {
 *   const decision = triage(surveyData);
 *
 *   if (decision.action_status === 'REFERRAL_REQUIRED') {
 *     // Block program assignment, trigger doctor referral
 *     await triggerMakeWebhook(decision);
 *     showMedicalHaltScreen(decision);
 *     return;
 *   }
 *
 *   await triggerMakeWebhook(decision, currentUser.id);
 *   showResultScreen(decision);
 * }
 */
