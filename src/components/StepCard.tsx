import { Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

interface StepCardProps {
  title: string;
  description: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function StepCard({
  title,
  description,
  options,
  selected,
  onSelect,
}: StepCardProps) {
  return (
    <div className="animate-slide-up w-full max-w-lg mx-auto">
      <div className="mb-8 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`
                w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-200 group relative overflow-hidden bg-white
                ${isSelected 
                  ? 'border-zinc-900 shadow-soft ring-1 ring-zinc-900' 
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon wrapper */}
                <div className={`
                  shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors
                  ${isSelected ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-50 text-zinc-500 group-hover:bg-zinc-100'}
                `}>
                  {opt.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-base transition-colors ${isSelected ? 'text-zinc-900' : 'text-zinc-700'}`}>
                      {opt.label}
                    </h3>
                  </div>
                  {opt.sublabel && (
                    <p className={`text-sm leading-snug transition-colors ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      {opt.sublabel}
                    </p>
                  )}
                </div>

                {/* Selection indicator */}
                <div className={`
                  absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full border transition-all
                  ${isSelected 
                    ? 'border-zinc-900 bg-zinc-900 text-white' 
                    : 'border-zinc-300 text-transparent group-hover:border-zinc-400'
                  }
                `}>
                  <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0 scale-50 transition-all'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
