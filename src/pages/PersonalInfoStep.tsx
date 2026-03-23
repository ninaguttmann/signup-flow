import { getStepContent } from '../config/stepsConfig';
import { useOnboardingStore } from '../store/onboardingStore';

const PersonalInfoStep = () => {
  const { accountType } = useOnboardingStore();
  const stepContent = getStepContent(2, accountType || undefined);

  return (
    <div>
      <h2 className="heading-2 mb-2.5">{stepContent.displayTitle}</h2>
      <p className="body-text">{stepContent.subtitle}</p>
    </div>
  );
};

export default PersonalInfoStep;
