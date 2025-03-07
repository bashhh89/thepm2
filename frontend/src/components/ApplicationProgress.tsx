import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ApplicationProgressProps {
  steps: Step[];
  currentStep: string;
  completedSteps: Step[];
}

export function ApplicationProgress({
  steps,
  currentStep,
  completedSteps,
}: ApplicationProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.some(s => s.id === step.id);
        const isCurrent = currentStep === step.id;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
                )}
                title={step.description}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div
                className={cn(
                  'hidden sm:block ml-2',
                  isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'h-px w-8',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 