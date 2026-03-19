import { http, HttpResponse, delay } from 'msw';
import type { RegisterResponse, RegisterPayload } from '../types/onboarding';

// Global error rate controlled by console commands
const mockErrorRate = 0.1; // Default 10% error rate
let forceErrorType: string | null = null;

// Error type constants for better type safety
const ErrorType = {
  VALIDATION: 'validation',
  SERVER_ERROR: 'server_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',
  USER_EXISTS: 'user_exists',
} as const;

// Common server error scenarios
const errorScenarios = [
  {
    type: ErrorType.VALIDATION,
    status: 400,
    message: 'Validation failed: Please check your input and try again.',
    details: 'Email format is invalid or password does not meet requirements.',
  },
  {
    type: ErrorType.SERVER_ERROR,
    status: 500,
    message: 'Server error: Something went wrong on our end.',
    details: 'We are working to fix this issue. Please try again later.',
  },
  {
    type: ErrorType.SERVICE_UNAVAILABLE,
    status: 503,
    message: 'Service unavailable: Our servers are temporarily down.',
    details: 'Maintenance in progress. Please try again in a few minutes.',
  },
  {
    type: ErrorType.TIMEOUT,
    status: 408,
    message: 'Request timeout: The server took too long to respond.',
    details: 'Please check your connection and try again.',
  },
];

// Mock database of already registered users
const registeredUsers = [
  'john@example.com',
  'jane.doe@test.com',
  'admin@demo.com',
  'user@test.org',
  'existing@user.com',
];

/**
 * Validates the registration payload
 * @param data - The registration data to validate
 * @returns true if valid, false otherwise
 */
function validateRegistrationData(data: RegisterPayload): boolean {
  return !!(
    data.name?.trim() &&
    data.email?.trim() &&
    data.password?.trim() &&
    data.address?.trim() &&
    data.country &&
    ['individual', 'business'].includes(data.accountType)
  );
}

export const handlers = [
  http.post('/api/register', async ({ request }) => {
    await delay(1500);

    try {
      const rawData = await request.json();
      const data = rawData as RegisterPayload;

      console.log('MSW: Received registration request:', data);

      // Validate input data
      if (!validateRegistrationData(data)) {
        const response: RegisterResponse = {
          success: false,
          message: 'Validation failed: Please check your input and try again.',
          details: 'Required fields are missing or invalid.',
          type: ErrorType.VALIDATION,
          status: 400,
        };
        return HttpResponse.json(response, { status: 400 });
      }

      // Check if user is already registered (this takes priority over other errors)
      if (registeredUsers.includes(data.email.toLowerCase())) {
        console.log(`MSW: User ${data.email} already registered`);
        const response: RegisterResponse = {
          success: false,
          message: 'Account already exists: This email is already registered.',
          details:
            'Please use a different email address or try logging in. If you forgot your password, you can reset it.',
          type: ErrorType.USER_EXISTS,
          status: 409,
          email: data.email,
        };

        return HttpResponse.json(response, { status: 409 });
      }

      // Check if we should simulate an error
      if (Math.random() < mockErrorRate || forceErrorType) {
        // Select error scenario
        const errorScenario = forceErrorType
          ? errorScenarios.find((e) => e.type === forceErrorType) ||
            errorScenarios[errorScenarios.length - 1]
          : errorScenarios[Math.floor(Math.random() * errorScenarios.length)];

        if (forceErrorType) {
          forceErrorType = null; // Reset after use
        }

        console.log(`MSW: Simulating ${errorScenario.type} error (${errorScenario.status})`);

        const response: RegisterResponse = {
          success: false,
          message: errorScenario.message,
          details: errorScenario.details,
          type: errorScenario.type,
          status: errorScenario.status,
        };

        return HttpResponse.json(response, { status: errorScenario.status });
      }

      const response: RegisterResponse = {
        success: true,
        userId: crypto.randomUUID(),
        message: 'Registration successful!',
        email: data.email, // Only return non-sensitive data
      };

      return HttpResponse.json(response);
    } catch (error) {
      console.error('MSW: Error processing registration:', error);
      const response: RegisterResponse = {
        success: false,
        message: 'Server error: Something went wrong on our end.',
        details: 'We are working to fix this issue. Please try again later.',
        type: ErrorType.SERVER_ERROR,
        status: 500,
      };
      return HttpResponse.json(response, { status: 500 });
    }
  }),
];
