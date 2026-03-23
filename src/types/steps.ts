import type { AccountType } from './onboarding';

export interface StepContent {
  title: string | ((accountType?: AccountType) => string);
  subtitle: string;
  quote: string;
  stepTitle: string;
}

export interface StepContentWithDisplay extends StepContent {
  displayTitle: string;
}

export interface StepsConfig {
  [key: number]: StepContent;
}
