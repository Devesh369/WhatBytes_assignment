import React from 'react';
import { Check, User, MapPin, KeyRound, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Personal Info', desc: 'Name & contact', icon: <User className="w-4 h-4" /> },
    { number: 2, title: 'Address Details', desc: 'Location & postal', icon: <MapPin className="w-4 h-4" /> },
    { number: 3, title: 'Credentials', desc: 'Username & password', icon: <KeyRound className="w-4 h-4" /> },
    { number: 4, title: 'Confirmation', desc: 'Review & submit', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Visual Progress Bar */}
      <div className="relative">
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Circles & Titles */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <button
              key={step.number}
              type="button"
              disabled={step.number > currentStep}
              onClick={() => onStepClick?.(step.number)}
              className={cn(
                'flex flex-col items-center group transition-colors focus:outline-hidden cursor-pointer disabled:cursor-not-allowed',
                step.number > currentStep && 'opacity-50'
              )}
            >
              {/* Circle Badge */}
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border-2',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.icon}
              </div>

              {/* Title & Desc */}
              <div className="mt-2 text-left sm:text-center">
                <div
                  className={cn(
                    'text-xs font-semibold tracking-tight transition-colors truncate max-w-[90px] sm:max-w-none',
                    isCurrent
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : isCompleted
                      ? 'text-zinc-700 dark:text-zinc-300'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {step.title}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:block">
                  {step.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
