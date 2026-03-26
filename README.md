# Fitness Triage & Routing Engine

A standalone, stateless triage engine ("The Brain") that processes fitness client survey data against a JSON rules matrix and returns a **Decision Packet** — the single source of truth for all downstream actions.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## Architecture

```
src/
├── engine/               ← The Brain (stateless, UI-independent)
│   ├── types.ts          ← TypeScript interfaces
│   ├── rulesParser.ts    ← Parses logic-matrix.json → compiled match functions
│   ├── triageEngine.ts   ← Core stateless processor
│   ├── index.ts          ← Public API: triage(input) → DecisionPacket
│   └── logic-matrix.json ← Rules config (update this, not the code)
├── components/
│   ├── SurveyWizard.tsx  ← 5-step animated survey UI
│   ├── StepCard.tsx      ← Reusable option selector
│   └── ResultPanel.tsx   ← Decision Packet display
├── integrations/
│   └── makeWebhook.ts    ← Make.com webhook utility
└── App.tsx               ← Root component
```

---

## Using the Logic Module (Standalone)

```typescript
import { triage } from './src/engine';
import type { SurveyInput } from './src/engine';

const input: SurveyInput = {
  risk: 'GREEN',
  modifier: 'STANDARD',
  setting: 'GYM',
  goal: 'STRENGTH',
  frequency: 4,
};

const result = triage(input);
// {
//   program_code: 'GRN-GYM-4D-STRENGTH-V1',
//   action_status: 'AUTO_OK',
//   next_step: 'ASSIGN_TRAINERIZE_PROGRAM',
//   matched_rule_id: 'R003'
// }
```

### From a `fetch` call (any platform)

```typescript
// Send survey input to a backend that wraps the engine:
const response = await fetch('/api/triage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(surveyInput),
});
const packet = await response.json(); // DecisionPacket
```

---

## Make.com Integration

```typescript
import { triage } from './src/engine';
import { triggerMakeWebhook } from './src/integrations/makeWebhook';

const decision = triage(surveyInput);

if (decision.action_status === 'REFERRAL_REQUIRED') {
  await triggerMakeWebhook(decision); // → Doctor PDF + Email
  return;
}

await triggerMakeWebhook(decision, clientId); // → Trainerize or Coach notify
```

Set your webhook URL in `.env`:
```
VITE_MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
```

---

## Updating Rules (No Code Required)

Edit `src/engine/logic-matrix.json`. Each rule has:

| Field | Description |
|-------|-------------|
| `id` | Unique rule identifier (e.g. `R001`) |
| `priority` | Higher = evaluated first. Safety rules must be `>= 100`. |
| `conditions` | Field values to match. Use `"*"` for wildcard or `["A","B"]` for multiple values. |
| `results.program_code` | Program identifier or `null` for referral cases |
| `results.action_status` | `AUTO_OK` / `REVIEW_REQUIRED` / `REFERRAL_REQUIRED` |
| `results.next_step` | Downstream action trigger label |

### Priority Hierarchy

| Priority Range | Layer | Example |
|---|---|---|
| 100+ | Safety / Risk Gate | R001: RED → REFERRAL_REQUIRED |
| 50–99 | Physical Modifiers | R002: BALANCE+AMBER |
| 10–49 | Environment / Setting | GYM vs HOME routing |
| 1–9 | Performance / Goals | Standard program assignment |
| 0 | Global Fallback | Catch-all REVIEW_REQUIRED |

---

## Decision Packet Output

```typescript
interface DecisionPacket {
  program_code: string | null;    // e.g. "GRN-GYM-4D-STRENGTH-V1"
  action_status: ActionStatus;    // AUTO_OK | REVIEW_REQUIRED | REFERRAL_REQUIRED
  next_step: NextStep;            // Downstream action label
  matched_rule_id: string;        // Rule that fired (for audit)
  error?: string;                 // Only present on engine error
}
```

---

## Input Variables

| Field | Values |
|-------|--------|
| `risk` | `GREEN` \| `AMBER` \| `RED` \| `REFER_OUT` |
| `modifier` | `STANDARD` \| `MACHINE` \| `JOINT` \| `BALANCE` \| `LOWCAP` |
| `setting` | `GYM` \| `HOME` \| `CLASS` |
| `goal` | `FULL` \| `STRENGTH` \| `STR_MOB` \| `MOBILITY` \| `BALANCE` \| `CARDIO` |
| `frequency` | `2` \| `3` \| `4` |

---

## Environment Variables

```env
VITE_MAKE_WEBHOOK_URL=   # Your Make.com Custom Webhook URL
```
# Trainerize-Decision-Engine
