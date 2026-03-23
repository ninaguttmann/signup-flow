import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser } from '../api/register';
import { useOnboardingStore } from '../store/onboardingStore';
import type { RegisterPayload, RegisterResponse } from '@/types/onboarding.ts';

export const useRegisterMutation = (onError?: (error: string, details?: string) => void) => {
  const queryClient = useQueryClient();
  const { accountType, personalInfo, residencyInfo, team, goToStep } = useOnboardingStore();

  return useMutation<RegisterResponse, Error, void>({
    mutationFn: async () => {
      if (!accountType) {
        throw new Error('Account type is required');
      }
      if (!personalInfo.name || !personalInfo.email || !personalInfo.password) {
        throw new Error('Personal information is incomplete');
      }
      if (!personalInfo.termsAccepted) {
        throw new Error('Terms and conditions must be accepted');
      }
      if (!residencyInfo.address || !residencyInfo.country) {
        throw new Error('Residency information is incomplete');
      }

      const countryMap: Record<string, 'US' | 'EN' | 'SI'> = {
        'SL': 'SI',
        'US': 'US',
        'EN': 'EN'
      };

      const payload: RegisterPayload = {
        accountType,
        name: personalInfo.name,
        email: personalInfo.email,
        password: personalInfo.password,
        address: residencyInfo.address,
        country: residencyInfo.country in countryMap 
          ? countryMap[residencyInfo.country] 
          : 'US',
        team: team || []
      };

      const response = await registerUser(payload);
      
      if (!response.success) {
        throw new Error(JSON.stringify({
          message: response.message,
          details: response.details
        }));
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration'] });
      
      goToStep(5);
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message);
        onError?.(errorData.message, errorData.details);
      } catch {
        onError?.(error.message);
      }
    },
  });
};
