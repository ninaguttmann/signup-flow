import React, { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from './Icons';

const STEP_MAPPING = {
  1: null,
  2: 'Step 1 of 3', // Personal Info
  3: 'Step 2 of 3', // Address
  4: 'Step 3 of 3', // Team
  5: null,
} as const;

const CHEVRON_ROTATION = 'rotate-90';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  onBack,
  showBackButton = true,
  className = '',
}) => {
  const isFirstStep = currentStep === 1;

  const handleSignIn = () => {
    // TODO: Implement navigation to sign-in page when available
    console.log('Navigate to sign in');
  };

  const getStepDisplay = useCallback((step: number, total: number) => {
    const mappedStep = STEP_MAPPING[step as keyof typeof STEP_MAPPING];
    return mappedStep || `Step ${step} of ${total}`;
  }, []);

  return (
    <div className={cn('flex h-12 w-full items-center justify-between bg-white', className)}>
      <div className="flex items-center gap-2 pr-[90px]">
        {!isFirstStep && showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary transition-colors duration-200 hover:text-text-main focus:text-text-main focus:outline-none"
            aria-label="Go back to previous step"
          >
            <ChevronDownIcon className={`h-5 w-5 ${CHEVRON_ROTATION}`} />
            <span className="back-text">Back</span>
          </button>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 pr-[90px]">
        {isFirstStep ? (
          <div className="sign-in-text">
            Already have an account?{' '}
            <button
              onClick={handleSignIn}
              className="sign-in-link"
              aria-label="Sign in to existing account"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            <div className="step-counter">{getStepDisplay(currentStep, totalSteps)}</div>
            <div className="step-title">{stepTitle}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
