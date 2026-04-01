# How the Triage Engine Works: A Guide for Everyone

Think of the **Fitness Triage & Routing Engine** as a digital "Chief Medical Officer" combined with a "Master Programmer." Its job is to look at every single client as soon as they sign up, assess their safety, and figure out the absolute best workout program for their specific needs and life situation.

It does this by following a strict, 4-step process. Here is how it works without the confusing tech jargon.

---

## Step 1: The "Hard Stop" (The Emergency Brake)
Before the engine even thinks about assigning a workout, it looks for serious **Red Flags**. These are major medical or safety warnings.

**Examples of Red Flags:**
- The client recently had chest pain.
- They have a recent surgery they haven't been cleared for by a doctor.
- Their doctor specifically said they require "supervised exercise."

**What the Engine Does:** 
If any of these are checked, the engine pulls the emergency brake. It stops the entire process and alerts the coach.
**The Message:** *"Do not assign a workout program. Refer this client to a medical professional first."*

---

## Step 2: Functional Safety Filters (The Triage Nurse)
If the client passes the Hard Stop check, the engine then assesses **how they actually move** in everyday life. This is all about physical reality.

**The Questions It Asks:**
- Do you use a cane or walker?
- Can you get up from a chair easily, or do you need to use your hands?
- Do you get dizzy when changing positions?

**What the Engine Does:** 
Based on these answers, it assigns a **Risk Tier (Color Code)**. It is essentially sorting the clients into the correct "room":
- **RED / AMBER Room:** Assigned to clients who need extra support, machine-based exercises, or have balance issues. The workouts here are heavily modified for safety.
- **GREEN Room:** Assigned to clients who move well, have no major restrictions, and can handle standard foundation or performance programs.

*Why this matters: Even if a client wants an advanced bodybuilding program, if they check "I use a walking aid," the engine will lock them out of the Green Room and force them into a safe Amber/Red program.*

---

## Step 3: Heuristic Scoring (The Matchmaker)
Now that the client is in an approved "Safe Room" (like the Green Tier), they might still have 10 or 15 different safe programs to choose from. How do we pick the right one? 

The engine uses a "Scoring System" (also known as a Heuristic Engine) to play matchmaker. It compares the client's preferences against the unique "DNA" of every available program in that room.

**Why do we do this?**
If a coach has to manually sift through 21+ programs to find the one that fits a client's exact mix of goals, environment, and preferred difficulty, it takes too much time and introduces human bias (e.g., a coach might just assign their "favorite" program by default). The scoring system does the complex, multi-variable math in a split second, presenting an objective, data-driven recommendation.

**How do the points work?**
Each program in the library is pre-programmed with a specific "Point Profile" based on what it is best at.

- **Goals (+10 to +25 points):** The biggest driver of the score. If a client wants "Muscle Growth" and a program is specifically a Hypertrophy program, it earns a massive +25 points. But an endurance program might earn 0 points for that same goal.
- **Environment (+10 to +20 points):** A critical practical filter. If a client selects "Home," the engine awards major points (+20) to programs designed with minimal equipment. If a heavy barbell program was evaluated for that same "Home" client, it wouldn't earn these points, effectively pushing it down the list.
- **The "Vibe Check" (Complexity, Impact, & Reps):** This fine-tunes the match based on the client's preferred training style.
  - If a client wants a **Simple (Low Complexity)** workout, a straightforward machine circuit gets +10 points. However, a highly complex Olympic lifting program might actually receive **negative points (-10)** for that same client to actively discourage a bad match.

**The Result:** The engine tallies up all the points—adding boosts for perfect alignments and subtracting points for mismatches. It ranks the programs from highest to lowest score. The program with the highest score is presented to the coach as the clear, objective "Best Fit." There is no guessing.

---

## Step 4: Clinical Conditions & Swaps (The Tailor)
Finally, the engine looks at specific, isolated pains (like "Knee Pain" or "Shoulder Pain") to **tailor** the chosen program before the client uses it. 

Just because a client has shoulder pain doesn't mean they need to be in the "Red Room" (they might otherwise be perfectly healthy), but they *do* need their exercises adjusted.

**What the Engine Does:**
It generates **Modifier Tags** and **Automated Exercise Swaps**.
- **Example:** If the client has "Knee Pain," the engine attaches a rule to their profile. It tells the coach and the system: *"Whenever this program asks for a Barbell Squat, swap it out for a High Box Squat or a Leg Press."*

**The Result:** The client gets a top-tier, highly-rated program, but with a custom "instruction manual" that tells them exactly how to train around their specific joint issues without getting hurt.

---

## Putting It All Together: A Quick Example

Let's look at a new client named Sarah.
1. **Hard Stop Check:** Sarah has no major medical alerts (like recent chest pain or un-cleared surgery). She passes.
2. **Functional Safety:** Sarah reports she experiences occasional **"Positional Dizziness."** The engine immediately intervenes, placing her in the **AMBER Tier** (Supported/Modified pool) for safety and attaching a `MOD-BALANCE` tag to her profile.
3. **Scoring:** In the Amber Tier, the engine evaluates Sarah's goal (General Strength) and environment (Full Gym). It crunches the numbers and awards the highest heuristic score to the **"AMB_2D_MACHINE_FULL"** (Amber 2-Day Machine Full Body) program, earning points for perfectly matching her goals and environment.
4. **The Swaps:** Sarah also noted she has **"Knee Pain."** The engine identifies this, attaches the `MOD-KNEE` clinical tag, and checks the Section 6 swap rules to generate automated exercise replacements for her coach: 
   - *Squat Pattern -> "High box squat pain-free ROM"*
   - *Lunge Pattern -> "Leg press split stance not required"*
   - *Cardio -> "Recumbent bike"*

**Final Outcome:** Sarah receives a customized, highly effective plan (`AMB_2D_MACHINE_FULL`) tailored specifically to her gym. It has built-in safety rails for her dizziness (`MOD-BALANCE`) and exact, pre-calculated exercise modifications for her bad knees (`MOD-KNEE`). It is safe, effective, and entirely automatic.
