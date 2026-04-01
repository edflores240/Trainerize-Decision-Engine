# Triage Engine V2.1: Technical Specification & Business Rules

This document outlines the exact logic sequence, data structures, and heuristic scoring mechanisms for the Fitness Triage Runtime (V2.1).

---

## 1. Safety Hierarchy & Tiering Logic

The Engine categorizes all users into four primary Risk Tiers. These are processed in strict priority order:

1. **BLACK (Rank 4):** Hard stop. GP referral required. No programming provided.
2. **RED (Rank 3):** High clinical risk. Requires highly customized, low-capacity, or heavily supported programming.
3. **AMBER (Rank 2):** Moderate risk. Requires modifications, machine-based bias, or joint-specific exercise swaps.
4. **GREEN (Rank 1):** Low risk. Cleared for standard foundational and performance programming.

The engine evaluates risk factors and always escalates to the **highest triggered priority**.

---

## 2. Execution Flow (Sequential Logic)

### Phase 1: The "Black Gate" (Absolute Contraindications)
If any of the following `SurveyInputV2` flags are `true`, the user is locked to the **BLACK** tier:
- `doctorSaysSupervision`
- `chestPainRecent`
- `uncontrolledConditions`
- `recentSurgeryNotCleared`
- `repeatedFallsInjury`
- `severePainDaily`
- `neuroConditionUnchecked`

**Action:** Engine terminates evaluation. Returns clinical referral placeholder (`P-REF-RED`) and tags `REFERRAL-GP`.

### Phase 2: Functional Risk Overrides (Physical Capacity)
If the user passes Phase 1, physical capacity flags dynamically escalate the tier.

| Input Condition | Forced Tier Matrix | Assigned Modifier |
| :--- | :--- | :--- |
| `walkingAid` OR `unsteadyGait` OR `fallsHistory === 'TWO_OR_INJURY'` | Elevates to **RED** | `MOD-BALANCE` |
| `dizziness` OR `chairRiseDifficulty` OR `fallsHistory === 'ONE_NO_INJURY'` | Elevates to **AMBER** | `MOD-BALANCE` |
| `breathlessLightActivity` OR `!walking10MinContinuous` | Elevates to **RED** | `MOD-CARDIOLOW` |

### Phase 3: Section 8 Entropy Rules (Complexity Gating)
The system evaluates the "Entropy" (computational complexity) of the user's combined medical profile.

*   **Conflict Set Rule (MSK Entropy):** If the user selects 2 or more distinct joint conditions (`Shoulder Pain`, `Knee Pain`, `Hip Pain`, `Low Back Pain`, `Lumbar Herniation`, `Osteoarthritis`), they are escalated to **AMBER**.
*   **High-Risk Multipliers (Rule 1):** The engine tracks 'High-Risk' modifier generation (`MOD-NEURO`, `MOD-DIZZINESS`, `MOD-BALANCE`, `MOD-DECONDITIONED`, `MOD-CARDIOLOW`). If 2 or more of these are triggered simultaneously, the user is escalated to **AMBER** and explicitly tagged with `MANUAL-REVIEW`.
*   **Environmental Stability (Rule 3):** If user has `dizziness` or `unsteadyGait` AND selects the `GYM` environment, the engine forces the `MOD-MACHINE-ONLY` tag to prevent free-weight instability accidents.

### Phase 4: Initial Library Filtering
The engine filters the `PROGRAM_LIBRARY` based on the calculated `userRisk`:
- If `GREEN`, they access `GREEN` programs.
- If `AMBER`, they access `AMBER` and `RED` programs.
- If `RED`, they access only `RED` programs.

---

## 3. Heuristic Scoring Drivers (Phase 5)

Once the "Safe Pool" is established, each valid program is scored against the user's preferences to find the Best Clinical Match. Programs start at `0` points. 

*If a program's `vetoConditions` array contains any of the user's active conditions, the program is flagged as `banned` (Score `-9999`) and removed from consideration.*

**Scoring Allocation Matrix:**
*   **Goals (`input.goals`):** Programs receive defined `pts` (e.g., `+20`) if their goal profile matches the user's selections.
*   **Environment (`input.environments`):** Programs receive defined `pts` (e.g., `+15`) if they match the user's equipment availability (`GYM`, `HOME`, `CLASS`).
*   **Complexity / Impact / Reps:** Each program has predefined point weightings matching user preferences (`LOW`, `MED`, `HIGH`).
    *   *Example:* A highly technical Olympic lifting program might award `-10` points to a user requesting `LOW` complexity.

**Ranking:** Programs are sorted descending by `finalScore`. The program at index `[0]` is the primary recommendation.

---

## 4. Section 6: Exercise Swap Engine (Phase 6)

The engine appends specific exercise replacements to the chosen program based on the generated `ModifierTags`. The swap hierarchy evaluated per movement pattern is:

*   **SQUAT Pattern:**
    *   `MOD-KNEE` $\rightarrow$ High box squat pain-free ROM
    *   `MOD-HIP` $\rightarrow$ Sit-to-stand from high box
    *   `MOD-BALANCE` $\rightarrow$ Supported sit-to-stand (rail/cable)
    *   `MOD-MACHINE-ONLY` $\rightarrow$ Leg press
*   **LUNGE Pattern:**
    *   `MOD-KNEE` $\rightarrow$ Leg press (split stance not required)
    *   `MOD-BALANCE` $\rightarrow$ Supported split squat hold, or remove
*   **HINGE Pattern:**
    *   `MOD-LOWBACK` / `MOD-HIP` $\rightarrow$ Glute bridge
    *   `MOD-MACHINE-ONLY` $\rightarrow$ Cable pull-through or bridge
*   **PUSH_VERTICAL Pattern:**
    *   `MOD-SHOULDER` / `MOD-LOWBACK` / `MOD-NO-OVERHEAD` $\rightarrow$ Incline chest press
*   **PUSH_HORIZONTAL Pattern:**
    *   `MOD-SHOULDER` $\rightarrow$ Chest press machine (neutral/pain-free range)
*   **ROW Pattern:**
    *   `MOD-LOWBACK` / `MOD-BALANCE` $\rightarrow$ Seated row machine (chest supported)
*   **CORE Pattern:**
    *   `MOD-NO-FLOOR` $\rightarrow$ Seated march + bracing
*   **CARDIO Pattern:**
    *   `MOD-CARDIOLOW` $\rightarrow$ Recumbent bike 5–10 min easy

---

## 5. Final Safety Processing (Section 8, Rule 4)

**The Frequency Cap:** 
Before returning the final sorted array, the engine executes one last safety pass. If the user satisfies **ANY** of the following conditions:
1. `userRisk !== 'GREEN'`
2. Possesses the `MANUAL-REVIEW` tag
3. Triggers MSK Entropy (2+ joint pains)

...then the engine **automatically filters out all 4-Day programs** from the recommended array, limiting the user strictly to 2-3 day volumes to ensure clinical recovery parameters are met.
