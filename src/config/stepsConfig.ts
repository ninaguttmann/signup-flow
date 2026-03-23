import type { AccountType } from '@/types/onboarding';
import type { StepContentWithDisplay, StepsConfig } from '@/types/steps';

export const stepsConfig: StepsConfig = {
  1: {
    title: 'Join Us!',
    subtitle: 'To begin this journey, tell us what type of account you’d be opening.',
    quote:
      'The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software.',
    stepTitle: '',
  },
  2: {
    title: (accountType: AccountType | undefined) =>
      accountType === 'business' ? 'Register Business Account!' : 'Register Individual Account!',
    subtitle: 'For the purpose of industry regulation, your details are required.',
    quote:
      'In the late 1970s, this excerpt found new life through its use in the burgeoning field of photocopy art, capturing the imagination of creatives. It gained another round of acclaim in the early 2000s, as web developers began using it as a placeholder in website templates.',
    stepTitle: 'Personal Info.',
  },
  3: {
    title: 'Complete Your Profile!',
    subtitle: 'For the purpose of industry regulation, your details are required.',
    quote:
      'During the early 1980s, the text became a favorite among graphic designers for typesetting in analog layout demonstrations. Its appeal was rekindled in the late 2000s when it became a go-to sample for testing digital fonts and layout software',
    stepTitle: 'Residency Info.',
  },
  4: {
    title: 'Invite your team',
    subtitle: 'For the purpose of industry regulation, your details are required.',
    quote:
      'The passage experienced a revival in the mid-1980s, as it was prominently featured in academic textbooks on design and typography. This resurgence was mirrored in the mid-2010s, with the advent of mobile app development platforms utilizing it for demo content',
    stepTitle: 'Team.',
  },
  5: {
    title: 'Success',
    subtitle:
      'You have received an email where you can read more about your account and setup your password.',
    quote:
      'In the 1990s, the excerpt was rediscovered by the nascent zine culture, serving as a quirky placeholder in DIY publications. It found relevance again in the early 2020s, as content management systems offered it as default filler text for new users.',
    stepTitle: '',
  },
};

export const getStepContent = (step: number, accountType?: AccountType): StepContentWithDisplay => {
  const content = stepsConfig[step] || {
    title: 'unknown step',
    subtitle: 'Step information not available',
    description: 'Please check your step configuration',
    quote: 'Every step forward is progress',
  };

  const displayTitle =
    typeof content.title === 'function' ? content.title(accountType) : content.title;

  return {
    ...content,
    displayTitle,
  };
};

export const getTotalSteps = (): number => {
  return Object.keys(stepsConfig).length;
};
