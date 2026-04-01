# Triage Engine: Complete Data Dictionary & Variable Tables

This document contains exactly how the Triage Engine evaluates variables, scores preferences, and routes clients. It lists every hard stop, safety filter, scoring weight, and program available in the system.

---

## 1. Hard Stops (The BLACK Tier)

If a user answers `TRUE` to *any* of the following medical flags, the engine instantly stops evaluation. They are placed in the **BLACK** tier, tagged with `REFERRAL-GP`, and given the `P-REF-RED` (Clinical Referral Required) outcome.

| Flag / Variable | Description in plain English | Action Taken |
| :--- | :--- | :--- |
| `doctorSaysSupervision` | Doctor requires them to exercise under medical supervision. | Hard Stop |
| `chestPainRecent` | Experienced chest pain in the last 30 days. | Hard Stop |
| `uncontrolledConditions` | Has an uncontrolled medical condition (e.g. blood pressure). | Hard Stop |
| `recentSurgeryNotCleared` | Had recent surgery and NOT cleared for exercise. | Hard Stop |
| `repeatedFallsInjury` | Has had multiple falls or a fall causing injury recently. | Hard Stop |
| `severePainDaily` | Experiences severe pain during daily tasks. | Hard Stop |
| `neuroConditionUnchecked` | Neurological condition that hasn't been checked by a GP. | Hard Stop |
| **Condition:** `Undiagnosed Severe Pain` | Selected from the condition list. | Hard Stop |

---

## 2. Functional Safety Filters (Performance Gating)

These filters override whatever tier the client *would* have been in based on their conditions, forcing them into a safer room. They also generate **Modifiers**.

| Variable Triggered | The Reason | Forced Tier | Tags Generated |
| :--- | :--- | :--- | :--- |
| `walkingAid` = **True** | User requires a cane or walker. | **RED** | `MOD-BALANCE` |
| `unsteadyGait` = **True** | User feels unsteady on their feet. | **RED** | `MOD-BALANCE` |
| `fallsHistory` = **Two or Injury** | Fall history indicates high risk. | **RED** | `MOD-BALANCE` |
| `breathlessLightActivity` = **True**| Extremely low cardio capacity. | **RED** | `MOD-CARDIOLOW` |
| `walking10MinContinuous` = **False**| Cannot maintain mild continuous effort. | **RED** | `MOD-CARDIOLOW` |
| `dizziness` = **True** | Positional or chronic dizziness. | **AMBER** | `MOD-BALANCE` |
| `chairRiseDifficulty` = **True** | Cannot get up without hands. | **AMBER** | `MOD-BALANCE` |
| `fallsHistory` = **One (No injury)** | Minor fall history. | **AMBER** | `MOD-BALANCE` |

> **Note on Dizziness in Gym:** If user has `dizziness` AND wants to train in a `GYM`, the engine automatically adds `MOD-MACHINE-ONLY` to prevent free-weight falls.

---

## 3. Clinical Conditions Matrix

When a user selects one of these health conditions, it sets a baseline tier, and generates "Tags" that tell the engine which exercises to swap.

| Condition | Base Risk Tier | Generated Tags | Note |
| :--- | :--- | :--- | :--- |
| Hypertension | **RED** | - | - |
| Heart Condition | **RED** | - | - |
| POTS / COPD / Glaucoma | **RED** | - | - |
| Osteoporosis | **RED** | `MOD-OSTEOPOROSIS` | - |
| Osteoarthritis | **AMBER** | `MOD-OSTEOARTHRITIS` | - |
| Neuropathy | **AMBER** | `MOD-NEURO` | - |
| Lumbar Herniation | **AMBER** | `MOD-LOWBACK` | - |
| Pregnancy | **AMBER** | - | - |
| Balance Issues | **AMBER** | `MOD-BALANCE` | - |
| Shoulder Pain | **GREEN** | `MOD-SHOULDER`, `MOD-NO-OVERHEAD` | *Escalates to AMBER if 2+ joint complaints* |
| Knee / Hip / Low Back Pain | **GREEN** | `MOD-KNEE` / `MOD-HIP` / `MOD-LOWBACK` | *Escalates to AMBER if 2+ joint complaints* |

---

## 4. Exercise Swap Rules (Section 6)

When the engine generates a tag (like `MOD-KNEE`), it looks at the assigned program and automatically swaps out dangerous exercise patterns for safer ones.

| Movement Pattern | Trigger Tag | Automated Swap Assigned |
| :--- | :--- | :--- |
| **SQUAT** | `MOD-KNEE` | High box squat pain-free ROM |
| **SQUAT** | `MOD-HIP` | Sit-to-stand from high box |
| **SQUAT** | `MOD-BALANCE` | Supported sit-to-stand holding rail/TRX/cable |
| **SQUAT** | `MOD-MACHINE-ONLY`| Leg press |
| **LUNGE** | `MOD-KNEE` | Leg press split stance not required |
| **LUNGE** | `MOD-BALANCE` | Supported split squat hold or remove |
| **HINGE** | `MOD-LOWBACK` / `MOD-HIP`| Glute bridge |
| **PUSH_VERTICAL** | `MOD-SHOULDER` | Incline chest press pain-free ROM |
| **PUSH_VERTICAL** | `MOD-LOWBACK` / `MOD-OSTEOPOROSIS`| Incline chest press (no seated overhead) |
| **PUSH_HORIZONTAL**| `MOD-SHOULDER` | Chest press machine neutral/pain-free range |
| **ROW** | `MOD-LOWBACK` / `MOD-BALANCE` | Seated row machine (chest supported) |
| **CORE** | `MOD-NO-FLOOR` | Seated march + bracing |
| **CARDIO** | `MOD-CARDIOLOW` | Recumbent bike 5–10 min easy |

---

## 5. Under the Hood: Heuristic Point System Explained

How do the numbers in the "Boosts" column of the Program Library work?
- When the engine looks at all safe programs, they start at `0 points`.
- If the user wants `HYPERTROPHY`, the engine looks at a program's **Goal Boost**. If the program has `HYPERTROPHY: 25`, it gets `+25 points`.
- It repeats this for **Environment** (e.g. `HOME: 20`).
- It repeats this for **Vibe (Complexity/Impact)**. For example, if user wants `LOW Complexity`, but the program is advanced, it might get `-30 points` (punishment), pushing it down the list.
- The highest total score wins.

---

## 6. The Master Program Library

This defines the exact "DNA" and points map of the 21 unique programs in the engine.

| Program Code | Tier | Vetoes (Cannot take if user has:) | Goal Points (Boosts) | Env Points | Vibe Points (Complexity L/M/H) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GRN_2D_FULL** | GREEN | Osteoarthritis, Herniation | Hypertrophy: 10, WeightLoss: 10 | Gym: 10, Home: 5 | Low: +5 / Med: +10 / High: +5 |
| **GRN_3D_FULL** | GREEN | Osteoarthritis, Herniation | Hypertrophy: 20 | Gym: 15, Home: 5 | Low: 0 / Med: +10 / High: +10 |
| **GRN_4D_STRENGTH** | GREEN | Osteo, Herniation, Neuro, HTN | Hypertrophy: 25 | Gym: 20 | Low: -10 / Med: +5 / High: +20 |
| **GRN_2D_STR_MOB** | GREEN | - | Hypertrophy: 10, Mobility: 20 | Gym: 10, Home: 10 | Low: +10 / Med: +10 / High: +5 |
| **GRN_3D_STR_MOB** | GREEN | - | Hypertrophy: 15, Mobility: 20 | Gym: 15, Home: 10 | Low: +5 / Med: +10 / High: +10 |
| **GRN_2D_MOBILITY** | GREEN | - | Mobility: 30, Balance: 10 | Home: 20, Class: 10 | Low: +20 / Med: +10 / High: -10 |
| **GRN_3D_ATHLETIC** | GREEN | Osteo, Heart, Balance | Athletic: 40, Hypertrophy: 15 | Gym: 20 | Low: -20 / Med: 0 / High: +30 |
| **AMB_2D_MACHINE_FULL**| AMBER | Neuropathy | Hypertrophy: 15, WeightLoss:10 | Gym: 30, Home: -50 | Low: +30 / Med: +5 / High: -30 |
| **AMB_3D_MACHINE_FULL**| AMBER | Neuropathy | Hypertrophy: 20, WeightLoss:15 | Gym: 30, Home: -50 | Low: +30 / Med: +5 / High: -30 |
| **AMB_2D_JOINT_STR_MOB**| AMBER| - | Mobility: 25, Hypertrophy: 10 | Home: 15, Gym: 15 | Low: +15 / Med: +15 / High: -10 |
| **AMB_3D_JOINT_STR_MOB**| AMBER| - | Mobility: 25, Hypertrophy: 15 | Home: 15, Gym: 15 | Low: +15 / Med: +15 / High: -10 |
| **AMB_2D_BALANCE** | AMBER | - | Balance: 40, Mobility: 10 | Home: 15 | Low: +30 / Med: -10 / High: -30 |
| **BALANCE_PROGRESSIVE**| AMBER | Neuropathy | Balance: 30 | Gym/Home: 10| Low: -10 / Med: +15 / High: +15 |
| **MOBILITY_ONLY** | AMBER | - | Mobility: 50 | Home: 20, Gym: 10 | Low: +30 / Med: 0 / High: -30 |
| **AMB_PREGNANCY_HOME** | AMBER | Hypertension, Heart Cond. | Mobility: 15, Balance: 10 | Home: 30 | Low: +10 / Med: +10 / High: -20 |
| **AMB_POST_SURGICAL** | AMBER | Heart Condition | Hypertrophy: 10, Mobility: 10 | Gym: 40 | Low: +40 / Med: -20 / High: -50 |
| **AMB_2D_CHAIR_BASE** | AMBER | - | Mobility: 10, Balance: 20 | Home: 20, Gym: 5 | Low: +40 / Med: -10 / High: -40 |
| **RETURN_TO_EXERCISE** | AMBER | Osteoarthritis, Hypertension | WeightLoss: 20, Cardio: 10 | Gym/Home: 15| Low: +20 / Med: 0 / High: -20 |
| **AMB_2D_LOWCAP** | **RED** | - | Cardio: 15, WeightLoss: 10 | Home: 20, Gym: 5 | Low: +20 / Med: 0 / High: -20 |
| **AMB_3D_LOWCAP** | **RED** | - | Cardio: 20, WeightLoss: 15 | Home: 20, Gym: 5 | Low: +20 / Med: 0 / High: -20 |
| **HOME_LOW_CAPACITY** | **RED** | - | Mobility: 10, Balance: 10 | Home: 50, Gym: -50 | Low: +40 / Med: -20 / High: -50 |

> **Note on "Vetoes":** If the user has *any* condition listed in a program's Veto list, that program is instantly given `-9999` points and hidden from results.
