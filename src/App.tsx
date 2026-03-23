import { Suspense, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/layout/ErrorFallback';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import StepNavigation from '@/components/common/StepNavigation.tsx';
import { DotsPatternIcon, QuoteIcon, CornerIcon } from '@/components/common/Icons.tsx';
import AccountTypeStep from '@/pages/AccountTypeStep';
import PersonalInfoStep from '@/pages/PersonalInfoStep';
import AddressStep from '@/pages/AddressStep';
import TeamStep from '@/pages/TeamStep';
import SuccessStep from '@/pages/SuccessStep';
import { getStepContent, getTotalSteps } from '@/config/stepsConfig.ts';
import { useOnboardingStore } from '@/store/onboardingStore';

const STEP_MAPPING = {
  1: AccountTypeStep,
  2: PersonalInfoStep,
  3: AddressStep,
  4: TeamStep,
  5: SuccessStep,
} as const;

const DEFAULT_STEP = 1;
const HIDE_NAVIGATION_STEP = 5;

function App() {
  const { currentStep, accountType, prevStep, canGoBack } = useOnboardingStore();

  const totalSteps = getTotalSteps();
  const stepContent = getStepContent(currentStep, accountType || undefined);

  const handleBack = useCallback(() => {
    if (canGoBack()) {
      prevStep();
    }
  }, [canGoBack, prevStep]);

  const renderStepContent = useCallback(() => {
    const StepComponent =
      STEP_MAPPING[currentStep as keyof typeof STEP_MAPPING] || STEP_MAPPING[DEFAULT_STEP];
    return <StepComponent />;
  }, [currentStep]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-wrapper" role="application">
                  {/* First column - left side */}
                  <aside
                    className="flex flex-col justify-center p-8"
                    aria-label="Branding and quote"
                  >
                    <div className="mx-auto w-full max-w-[475px]">
                      <DotsPatternIcon className="ml-auto mr-[80px]" />
                      <QuoteIcon className="mt-16" />

                      <div>
                        <div className="mt-4 text-left">
                          {stepContent.quote && (
                            <blockquote className="align-middle font-sans text-body-large font-normal leading-[38px] tracking-normal text-text-inverse">
                              "{stepContent.quote}"
                            </blockquote>
                          )}
                        </div>
                      </div>

                      <CornerIcon className="ml-auto mr-[40px] mt-[80px]" />
                    </div>
                  </aside>

                  {/* Second column - right side with StepNavigation */}
                  <main className="flex h-full flex-col bg-white" aria-label="Onboarding form">
                    <header className="pt-[75px]">
                      {currentStep !== HIDE_NAVIGATION_STEP && (
                        <StepNavigation
                          currentStep={currentStep}
                          totalSteps={totalSteps}
                          stepTitle={stepContent.stepTitle}
                          onBack={handleBack}
                        />
                      )}
                    </header>

                    <div className="mx-auto mt-content-margin-top flex max-w-content-max-width flex-1 justify-center">
                      {renderStepContent()}
                    </div>
                  </main>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
