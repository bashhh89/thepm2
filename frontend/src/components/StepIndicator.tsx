import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: Step[];
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = completedSteps.find(s => s.id === step.id);
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                isCompleted && 'bg-primary text-primary-foreground',
                isCurrent && !isCompleted && 'bg-primary/20 text-primary',
                !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <div className="absolute -bottom-6 whitespace-nowrap text-xs font-medium">
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-px w-4',
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