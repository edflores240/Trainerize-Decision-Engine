# Project Brief: Fitness Triage & Routing Engine (The "Brain")

## 1. Overview
The goal is to build a standalone, reusable logic module that triages fitness clients based on medical risk, physical constraints, and environment. The engine acts as a "Black Box" that receives survey data and outputs a standardized **Program Code** and **Action Status**.

## 2. Core Objectives
- **Clinical Triage:** Prioritize safety by identifying high-risk users who require medical clearance.
- **Modular Portability:** The engine must be independent of the UI so it can be used in web apps, mobile apps, or backend services.
- **Dynamic Rules:** Logic must be driven by a configuration file (JSON) to allow rule updates without code redeployment.

## 3. The Logic Hierarchy (Priority Order)
The engine must process inputs in this strict order:
1. **Safety (Risk Gate):** If `risk == RED` or `REFER`, trigger `REFERRAL_REQUIRED`.
2. **Physical Modifiers:** If `modifier` is `BALANCE` or `JOINT`, override standard goals.
3. **Environment:** Map `setting` (GYM/HOME) to available equipment lists.
4. **Performance:** Assign `goal` and `frequency`.

## 4. Input Variables
- `risk`: GREEN | AMBER | RED | REFER_OUT
- `modifier`: STANDARD | MACHINE | JOINT | BALANCE | LOWCAP
- `setting`: GYM | HOME | CLASS
- `goal`: FULL | STRENGTH | STR_MOB | MOBILITY | BALANCE | CARDIO
- `frequency`: 2 | 3 | 4

## 5. Output: The Decision Packet
Every calculation must return:
- `program_code`: (e.g., "AMB-GYM-2D-STRMOB-JOINT-V1")
- `action_status`: 
    - `AUTO_OK`: Proceed to Trainerize.
    - `REVIEW_REQUIRED`: Notify Coach for manual check.
    - `REFERRAL_REQUIRED`: Halt and trigger Medical Referral workflow (Doctor Portal/PDF).

## 6. Integration Workflow
1. **Survey (Frontend)** -> Sends JSON payload to Logic Module.
2. **Logic Module** -> Iterates through Rules Matrix.
3. **Result** -> Triggers Webhooks (Trainerize for programs or CRM for Doctor Referral forms).