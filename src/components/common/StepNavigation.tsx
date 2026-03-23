import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from './Icons';

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
    console.log('Navigate to sign in');
  };

  return (
    <div className={cn('flex h-12 w-full items-center justify-between bg-white px-6', className)}>
      <div className="flex items-center gap-2">
        {!isFirstStep && showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary transition-colors duration-200 hover:text-text-main focus:text-text-main focus:outline-none"
            aria-label="Go back to previous step"
          >
            <ChevronDownIcon className="h-5 w-5 rotate-90" />
            <span className="back-text">Back</span>
          </button>
        )}
      </div>

      <div className="flex flex-col items-end gap-1">
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
            <div className="step-counter">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="step-title">{stepTitle}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
