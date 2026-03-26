# Fitness Triage Engine: Integration Guide

This guide explains how to extract, integrate, and use the **Fitness Triage Engine** in any other project (e.g., a React Native mobile app, a Node.js backend, or a separate web application). 

Because the engine was built as a **standalone, stateless, and pure TypeScript** module, it has **zero dependencies** on React, Vite, or the browser. It runs seamlessly in both Node.js and browser environments.

---

## 📂 1. What to Copy

To use the engine in another project, simply copy the `src/engine` directory and the `logic-matrix.json` file.

You need the following 5 files:
```text
engine/
├── index.ts              # Exports the public API
├── logic-matrix.json     # The single source of truth for logic rules
├── rulesParser.ts        # Parses and validates the JSON matrix
├── triageEngine.ts       # Evaluates user input against the parsed rules
└── types.ts              # Core TypeScript interfaces/enums
```

---

## 🚀 2. How to Use (Quick Start)

Using the engine requires exactly two steps:
1. Parse the `logic-matrix.json` into executable rules.
2. Pass a user's survey answers into `processInput()`.

### Example (TypeScript / JavaScript):

```typescript
// 1. Import the engine core and the logic matrix
import { processInput, parseRules, SurveyInput } from './engine';
import logicMatrix from './engine/logic-matrix.json';

// 2. Parse the rules into memory (do this once on app startup or module load)
const compiledRules = parseRules(logicMatrix);

// ... Later, when a user finishes the survey:

// 3. Construct the input object from the user's answers
const userAnswers: SurveyInput = {
  risk: 'GREEN',
  modifier: 'STANDARD',
  setting: 'GYM',
  goal: 'STRENGTH',
  frequency: 3
};

// 4. Process the input through the engine
const decision = processInput(userAnswers, compiledRules);

console.log(decision);
```

### Example Decision Output:
```json
{
  "program_name": "Gym Hypertrophy Program",
  "program_code": "GRN-GYM-HYPERTROPHY-V1",
  "action_status": "AUTO_OK",
  "next_step": "ASSIGN_TRAINERIZE_PROGRAM",
  "matched_rule_id": "R030"
}
```

---

## 📦 3. Data Structures

The engine relies on strictly typed Enums. Ensure your survey UI maps correctly to these string literals.

### `SurveyInput` (What you pass to the engine)
```typescript
interface SurveyInput {
  risk: 'GREEN' | 'AMBER' | 'RED' | 'REFER_OUT';
  modifier: 'STANDARD' | 'MACHINE' | 'JOINT' | 'BALANCE' | 'LOWCAP';
  setting: 'GYM' | 'HOME' | 'CLASS';
  goal: 'FULL' | 'STRENGTH' | 'STR_MOB' | 'MOBILITY' | 'BALANCE' | 'CARDIO';
  frequency: 2 | 3 | 4;
}
```

### `DecisionPacket` (What the engine returns)
```typescript
interface DecisionPacket {
  program_name: string | null;  // Human-readable program title
  program_code: string | null;  // Internal Trainerize ID
  action_status: 'AUTO_OK' | 'REVIEW_REQUIRED' | 'REFERRAL_REQUIRED';
  next_step: string;            // The automation trigger name (e.g. "NOTIFY_COACH")
  matched_rule_id: string;      // The exact Rule ID that triggered this result
  error?: string;               // Exists only if validation failed
}
```

---

## 🛠 4. Updating Logic (No Code Required)

To change how the engine routes users, **do not touch the TypeScript code**. 

All business logic flows through `logic-matrix.json`. 

### The Logic Matrix Schema
A Rule in the JSON array looks like this:
```json
{
  "id": "R030",
  "priority": 60,
  "description": "Gym Setup - Pure Strength",
  "conditions": {
      "risk": "GREEN",
      "modifier": "STANDARD",
      "setting": "GYM",
      "goal": "STRENGTH"
  },
  "results": {
      "program_name": "Gym Hypertrophy Program",
      "program_code": "GRN-GYM-HYPERTROPHY-V1",
      "action_status": "AUTO_OK",
      "next_step": "ASSIGN_TRAINERIZE_PROGRAM"
  }
}
```

### Mechanics:
- **Priority:** The engine evaluates the JSON array in descending order based on `priority` (Highest priority wins). Rule `100` is checked before Rule `50`.
- **Wildcards (`*`)**: Placing a `"*"` in any condition field means the engine will strictly ignore that field. (e.g., If `modifier: "*"`, the rule matches regardless of what modifier the user picked).
- **Arrays**: You can allow multiple matches by providing an array (e.g., `"goal": ["STRENGTH", "FULL"]`). 

### Adding a New Rule
Just add a new object to the `logic-matrix.json` array! As long as the priority is set correctly, `parseRules()` will automatically sort and evaluate the new logic immediately on the next run.
