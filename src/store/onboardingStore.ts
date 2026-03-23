import { create } from 'zustand';
import type { OnboardingData, AccountType } from '@/types/onboarding';

interface OnboardingState extends OnboardingData {
  currentStep: number;
  setAccountType: (type: AccountType) => void;
  setPersonalInfo: (info: Partial<OnboardingData['personalInfo']>) => void;
  setResidencyInfo: (info: Partial<OnboardingData['residencyInfo']>) => void;
  setTeam: (team: string[]) => void;
  addTeamMember: (email: string) => void;
  removeTeamMember: (index: number) => void;
  prevStep: () => void;
  canGoBack: () => boolean;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initialState: OnboardingData & { currentStep: number } = {
  currentStep: 1,
  accountType: null,
  personalInfo: {
    name: '',
    email: '',
    password: '',
    termsAccepted: false,
  },
  residencyInfo: {
    address: '',
    country: null,
  },
  team: [],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setAccountType: (type) => set({ accountType: type }),

  setPersonalInfo: (info) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, ...info },
    })),

  setResidencyInfo: (info) =>
    set((state) => ({
      residencyInfo: { ...state.residencyInfo, ...info },
    })),

  setTeam: (team) => set({ team }),

  addTeamMember: (email) =>
    set((state) => ({
      team: [...state.team, email],
    })),

  removeTeamMember: (index) =>
    set((state) => ({
      team: state.team.filter((_, i) => i !== index),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  goToStep: (step) => set({ currentStep: step }),

  reset: () => set(initialState),

  canGoBack: () => {
    return get().currentStep > 1;
  },
}));
