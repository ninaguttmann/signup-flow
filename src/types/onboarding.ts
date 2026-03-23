export type AccountType = 'individual' | 'business';

export type CountryCode = 'US' | 'EN' | 'SI' | null;

export interface PersonalInfo {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

export interface ResidencyInfo {
  address: string;
  country: CountryCode;
}

export interface OnboardingData {
  accountType: AccountType | null;
  personalInfo: PersonalInfo;
  residencyInfo: ResidencyInfo;
  team: string[];
}

export interface RegisterPayload {
  accountType: 'individual' | 'business';
  name: string;
  email: string;
  password: string;
  address: string;
  country: Exclude<CountryCode, null>;
  team?: string[];
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  details?: string;
  type?: string;
  status?: number;
  userId?: string;
  email?: string;
}
