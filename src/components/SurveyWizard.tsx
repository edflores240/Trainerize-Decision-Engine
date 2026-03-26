import { useState } from 'react';
import StepCard from './StepCard';
import IdentityCard from './IdentityCard';
import type { SurveyInput, RiskLevel, PhysicalModifier, TrainingSetting, FitnessGoal, TrainingFrequency, UserIdentity } from '../engine';

interface SurveyWizardProps {
  onComplete: (input: SurveyInput) => void;
}

const STEPS = [
  {
    id: 'risk',
    title: 'Medical & Safety Clearance',
    description: 'Please indicate your current medical status. Your safety is our absolute priority.',
    options: [
      { value: 'GREEN',     label: 'Cleared for Exercise',        sublabel: 'No known medical contraindications or recent surgeries.', icon: '🩺' },
      { value: 'AMBER',     label: 'Cleared with Limitations',    sublabel: 'Minor conditions/past injuries. Cleared by a physician to exercise.', icon: '📋' },
      { value: 'RED',       label: 'Active Medical Condition',    sublabel: 'Currently undergoing medical treatment. Cannot perform standard exercise.', icon: '⚠️' },
      { value: 'REFER_OUT', label: 'Undiagnosed Severe Pain',     sublabel: 'Require immediate physician clearance before proceeding.', icon: '🚑' },
    ],
    danger: ['RED', 'REFER_OUT'],
    warning: ['AMBER'],
  },
  {
    id: 'modifier',
    title: 'Physical Limitations',
    description: 'Do you have any specific physical constraints we must program around?',
    options: [
      { value: 'STANDARD', label: 'No Limitations',          sublabel: 'Full, pain-free mobility across all major joints.', icon: '✨' },
      { value: 'MACHINE',  label: 'Machine-Based Only',      sublabel: 'Require fixed-plane movements for safety and stability.', icon: '⚙️' },
      { value: 'JOINT',    label: 'Low-Impact Required',     sublabel: 'Joint pain or instability (knees, shoulders, spine).', icon: '🦴' },
      { value: 'BALANCE',  label: 'Balance Deficit',         sublabel: 'Struggle with stability; require a fall-prevention focus.', icon: '⚖️' },
      { value: 'LOWCAP',   label: 'Severely Deconditioned',  sublabel: 'Very low cardiovascular capacity or recovering from illness.', icon: '🫀' },
    ],
    warning: ['JOINT', 'BALANCE', 'LOWCAP'],
  },
  {
    id: 'setting',
    title: 'Training Environment',
    description: 'Where will you be completing the majority of your workouts?',
    options: [
      { value: 'GYM',   label: 'Commercial Gym',      sublabel: 'Access to barbells, squat racks, cables, and machines.', icon: '🏢' },
      { value: 'HOME',  label: 'Home Setup',          sublabel: 'Limited equipment: dumbbells, resistance bands, or bodyweight.', icon: '🏠' },
      { value: 'CLASS', label: 'Group Fitness',       sublabel: 'Participating in guided studio classes.', icon: '👥' },
    ],
  },
  {
    id: 'goal',
    title: 'Performance Objective',
    description: 'What is the main focus for your upcoming training macrocycle?',
    options: [
      { value: 'FULL',     label: 'Body Recomposition',        sublabel: 'Balanced fat loss and lean muscle retention.', icon: '🎯' },
      { value: 'STRENGTH', label: 'Hypertrophy & Strength',    sublabel: 'Maximize muscle growth and raw power.', icon: '💪' },
      { value: 'STR_MOB',  label: 'Functional Athletics',      sublabel: 'Blend of strength, agility, and joint mobility.', icon: '🤸' },
      { value: 'MOBILITY', label: 'Mobility & Restoration',    sublabel: 'Dedicated focus on joint health and range of motion.', icon: '🧘‍♀️' },
      { value: 'BALANCE',  label: 'Core & Stability',          sublabel: 'Develop foundational core strength and balance.', icon: '⚖️' },
      { value: 'CARDIO',   label: 'Cardiovascular Endurance',  sublabel: 'Improve stamina, VO2 max, and heart health.', icon: '🏃‍♂️' },
    ],
  },
  {
    id: 'frequency',
    title: 'Training Frequency',
    description: 'How many dedicated sessions can you realistically commit to weekly?',
    options: [
      { value: '2', label: '2 Sessions Weekly', sublabel: 'Ideal for maintenance, busy schedules, or absolute beginners.', icon: '2️⃣' },
      { value: '3', label: '3 Sessions Weekly', sublabel: 'The gold standard for steady, sustainable progress.', icon: '3️⃣' },
      { value: '4', label: '4+ Sessions Weekly', sublabel: 'For accelerated athletic development (requires strict recovery).', icon: '4️⃣' },
    ],
  },
] as const;

type FormData = {
  risk: RiskLevel | null;
  modifier: PhysicalModifier | null;
  setting: TrainingSetting | null;
  goal: FitnessGoal | null;
  frequency: string | null;
  identity: Partial<UserIdentity>;
};

export default function SurveyWizard({ onComplete }: SurveyWizardProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    risk: null,
    modifier: null,
    setting: null,
    goal: null,
    frequency: null,
    identity: { firstName: '', lastName: '', email: '' }
  });

  const totalSteps = STEPS.length + 1; // +1 for Identity step at the end
  const progress = ((step + 1) / totalSteps) * 100;
  
  const isIdentityStep = step === STEPS.length;
  const currentStepDef = !isIdentityStep ? STEPS[step] : null;

  const handleSelect = (value: string) => {
    if (!currentStepDef) return;
    setFormData((prev) => ({ ...prev, [currentStepDef.id]: value }));
    
    // Auto-advance
    setTimeout(() => {
      setStep((s) => s + 1);
    }, 300);
  };

  const handleNext = () => {
    if (isIdentityStep) {
      if (!formData.identity.firstName || !formData.identity.lastName || !formData.identity.email) return;
      onComplete({
        risk: formData.risk!,
        modifier: formData.modifier!,
        setting: formData.setting!,
        goal: formData.goal!,
        frequency: parseInt(formData.frequency!) as TrainingFrequency,
        identity: formData.identity as UserIdentity,
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const currentValue = isIdentityStep 
    ? (formData.identity.firstName && formData.identity.lastName && formData.identity.email) 
    : formData[currentStepDef!.id as keyof FormData];

  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-[100dvh] md:min-h-0 md:rounded-3xl md:shadow-float md:border border-zinc-100 overflow-hidden flex flex-col relative animate-fade-in">
      
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-100">
        <div 
          className="h-full bg-zinc-900 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col p-6 md:p-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`text-sm font-medium transition-colors ${step === 0 ? 'text-transparent cursor-default' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            ← Back
          </button>
          <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1">
          {isIdentityStep ? (
            <IdentityCard 
              identity={formData.identity}
              onChange={(updates) => setFormData(p => ({ ...p, identity: { ...p.identity, ...updates } }))}
            />
          ) : (
            <StepCard
              key={step} 
              title={currentStepDef!.title}
              description={currentStepDef!.description}
              options={[...currentStepDef!.options]}
              selected={currentValue as string | null}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6">
          <button
            onClick={handleNext}
            disabled={!currentValue}
            className={`
              w-full py-4 rounded-xl text-base font-semibold transition-all duration-300
              ${currentValue
                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 hover:-translate-y-0.5'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }
            `}
          >
            {isIdentityStep ? 'Complete Triage Assessment' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
