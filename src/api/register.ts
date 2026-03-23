import { type RegisterPayload, type RegisterResponse } from '../types/onboarding';

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};
