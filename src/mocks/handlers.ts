import { http, HttpResponse, delay } from 'msw';

interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  countryOfResidency: string;
  teammateEmails: string[];
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  details?: string;
  type?: string;
  status?: number;
  userId?: string;
  email?: string;
}

// Global error rate controlled by console commands
const mockErrorRate = 0.1; // Default 10% error rate
let forceErrorType: string | null = null;

// Common server error scenarios
const errorScenarios = [
  {
    type: 'validation',
    status: 400,
    message: 'Validation failed: Please check your input and try again.',
    details: 'Email format is invalid or password does not meet requirements.',
  },
  {
    type: 'server_error',
    status: 500,
    message: 'Server error: Something went wrong on our end.',
    details: 'We are working to fix this issue. Please try again later.',
  },
  {
    type: 'service_unavailable',
    status: 503,
    message: 'Service unavailable: Our servers are temporarily down.',
    details: 'Maintenance in progress. Please try again in a few minutes.',
  },
  {
    type: 'timeout',
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

export const handlers = [
  http.post('/api/register', async ({ request }) => {
    await delay(1500);

    const data = (await request.json()) as RegistrationRequest;

    console.log('MSW: Received registration request:', data);

    // Check if user is already registered (this takes priority over other errors)
    if (data?.email && registeredUsers.includes(data.email.toLowerCase())) {
      console.log(`MSW: User ${data.email} already registered`);
      const response: RegistrationResponse = {
        success: false,
        message: 'Account already exists: This email is already registered.',
        details:
          'Please use a different email address or try logging in. If you forgot your password, you can reset it.',
        type: 'user_exists',
        status: 409,
        email: data.email,
      };

      return HttpResponse.json(response, { status: 409 });
    }

    // Check if we should simulate an error
    if (Math.random() < mockErrorRate || forceErrorType) {
      // Select error scenario
      let errorScenario;
      if (forceErrorType) {
        errorScenario = errorScenarios.find((e) => e.type === forceErrorType) || errorScenarios[3];
        forceErrorType = null; // Reset after use
      } else {
        // Random error scenario
        errorScenario = errorScenarios[Math.floor(Math.random() * errorScenarios.length)];
      }

      console.log(`MSW: Simulating ${errorScenario.type} error (${errorScenario.status})`);

      const response: RegistrationResponse = {
        success: false,
        message: errorScenario.message,
        details: errorScenario.details,
        type: errorScenario.type,
        status: errorScenario.status,
      };

      return HttpResponse.json(response, { status: errorScenario.status });
    }

    const response: RegistrationResponse = {
      success: true,
      userId: crypto.randomUUID(),
      message: 'Registration successful!',
      email: data.email, // Only return non-sensitive data
    };

    return HttpResponse.json(response);
  }),
];
