import { getStepContent } from '../config/stepsConfig';
import {
  UserIcon,
  UserIconFilled,
  BuildingIcon,
  BuildingIconFilled,
} from '../components/common/Icons';
import Card from '../components/common/Card';
import { useOnboardingStore } from '../store/onboardingStore';
import type { AccountType } from '../types/onboarding';

const AccountTypeStep = () => {
  const stepContent = getStepContent(1);
  const { setAccountType, goToStep } = useOnboardingStore();

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    goToStep(2);
  };

  return (
    <div>
      <div className="mb-9">
        <h2 className="heading-2 mb-2.5">{stepContent.displayTitle}</h2>
        <p className="body-text">{stepContent.subtitle}</p>
      </div>
      <div>
        <Card
          type="button"
          icon={UserIcon}
          iconHover={UserIconFilled}
          title="Individual"
          subtitle="Personal account to manage all your activities."
          arrowIcon={true}
          onClick={() => handleAccountTypeSelect('individual')}
        />
        <Card
          type="button"
          icon={BuildingIcon}
          iconHover={BuildingIconFilled}
          title="Business"
          subtitle="Own or belong to a company, this is for you."
          arrowIcon={true}
          className="mt-4"
          onClick={() => handleAccountTypeSelect('business')}
        />
      </div>
    </div>
  );
};

export default AccountTypeStep;
