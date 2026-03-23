import { http, HttpResponse, delay } from 'msw';
import type { RegisterResponse, RegisterPayload } from '../types/onboarding';

const mockErrorRate = 0.1;
let forceErrorType: string | null = null;

const ErrorType = {
  VALIDATION: 'validation',
  SERVER_ERROR: 'server_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',
  USER_EXISTS: 'user_exists',
} as const;

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

if (typeof window !== 'undefined') {
  type MockRegistrationCommands = {
    forceValidationError: () => void;
    forceServerError: () => void;
    forceServiceUnavailable: () => void;
    forceTimeout: () => void;
    forceUserExists: () => void;
    setErrorRate: (rate: number) => void;
    reset: () => void;
  };

  (window as unknown as { mockRegistration: MockRegistrationCommands }).mockRegistration = {
    forceValidationError: () => {
      forceErrorType = ErrorType.VALIDATION;
      console.log('MSW: Next registration will force a validation error');
    },
    forceServerError: () => {
      forceErrorType = ErrorType.SERVER_ERROR;
      console.log('MSW: Next registration will force a server error');
    },
    forceServiceUnavailable: () => {
      forceErrorType = ErrorType.SERVICE_UNAVAILABLE;
      console.log('MSW: Next registration will force a service unavailable error');
    },
    forceTimeout: () => {
      forceErrorType = ErrorType.TIMEOUT;
      console.log('🔧 MSW: Next registration will force a timeout error');
    },
    forceUserExists: () => {
      forceErrorType = ErrorType.USER_EXISTS;
      console.log('🔧 MSW: Next registration will force a user exists error');
    },
    setErrorRate: (rate: number) => {
      if (rate >= 0 && rate <= 1) {
        (mockErrorRate as number) = rate;
        console.log(`🔧 MSW: Error rate set to ${(rate * 100).toFixed(0)}%`);
      } else {
        console.error('Error rate must be between 0 and 1');
      }
    },
    reset: () => {
      forceErrorType = null;
      (mockErrorRate as number) = 0.1;
      console.log('🔧 MSW: Registration mock reset to normal behavior');
    },
  };
}

export const handlers = [
  http.post('/api/register', async ({ request }) => {
    await delay(1500);

    try {
      const rawData = await request.json();
      const data = rawData as RegisterPayload;

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

      if (registeredUsers.includes(data.email.toLowerCase())) {
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

      if (Math.random() < mockErrorRate || forceErrorType) {
        const currentForceErrorType = forceErrorType;
        
        const errorScenario = currentForceErrorType
          ? errorScenarios.find((e) => e.type === currentForceErrorType) ||
            errorScenarios[errorScenarios.length - 1]
          : errorScenarios[Math.floor(Math.random() * errorScenarios.length)];

        if (forceErrorType) {
          forceErrorType = null;
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

      console.log('MSW: Registration successful - no error triggered');

      const response: RegisterResponse = {
        success: true,
        userId: crypto.randomUUID(),
        message: 'Registration successful!',
        email: data.email,
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
