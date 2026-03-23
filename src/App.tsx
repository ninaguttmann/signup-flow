import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Layout Components
import { ErrorFallback } from '@/components/layout/ErrorFallback';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// UI Components
import StepNavigation from '@/components/common/StepNavigation.tsx';
import { DotsPatternIcon, QuoteIcon, CornerIcon } from '@/components/common/Icons.tsx';

// Pages
import AccountTypeStep from '@/pages/AccountTypeStep';
import PersonalInfoStep from '@/pages/PersonalInfoStep';
import AddressStep from '@/pages/AddressStep';
import TeamStep from '@/pages/TeamStep';
import SuccessStep from '@/pages/SuccessStep';

// Config
import { getStepContent, getTotalSteps } from '@/config/stepsConfig.ts';

// Store
import { useOnboardingStore } from '@/store/onboardingStore';

function App() {
  const { currentStep, accountType, prevStep, canGoBack } = useOnboardingStore();

  const totalSteps = getTotalSteps();
  const stepContent = getStepContent(currentStep, accountType || undefined);

  const handleBack = () => {
    if (canGoBack()) {
      prevStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AccountTypeStep />;
      case 2:
        return <PersonalInfoStep />;
      case 3:
        return <AddressStep />;
      case 4:
        return <TeamStep />;
      case 5:
        return <SuccessStep />;
      default:
        return <AccountTypeStep />;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-wrapper">
                  {/* First column - left side */}
                  <div className="flex flex-col justify-center p-8">
                    <div className="mx-auto w-full max-w-[475px]">
                      <DotsPatternIcon className="ml-auto mr-[80px]" />
                      <QuoteIcon className="mt-16" />

                      <div>
                        <div className="mt-4 text-left">
                          {stepContent.quote && (
                            <div className="align-middle font-sans text-body-large font-normal leading-[38px] tracking-normal text-text-inverse">
                              "{stepContent.quote}"
                            </div>
                          )}
                        </div>
                      </div>

                      <CornerIcon className="ml-auto mr-[40px] mt-[80px]" />
                    </div>
                  </div>

                  {/* Second column - right side with StepNavigation */}
                  <div className="flex h-full flex-col bg-white pb-[75px] pr-[90px]">
                    <div className="pt-[75px]">
                      <StepNavigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        stepTitle={stepContent.stepTitle}
                        onBack={handleBack}
                      />
                    </div>

                    <div className="mx-auto mt-content-margin-top flex max-w-content-max-width flex-1 items-center justify-center">
                      {renderStepContent()}
                    </div>
                  </div>
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
