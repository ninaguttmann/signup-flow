# Signup Flow - Project Documentation

## Technology Stack

### Core Technologies
- **React 18.3.1** - UI framework with hooks and modern features
- **TypeScript 5.6.3** - Type-safe JavaScript development
- **Vite 6.0.7** - Fast build tool and development server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### Key Libraries
- **React Router 6.28.1** - Client-side routing and navigation
- **Zod 3.24.1** - Schema validation and type safety
- **TanStack Query 5.62.0** - Server state management and caching
- **MSW 2.6.8** - API mocking for development and testing
- **Vitest 2.1.8** - Unit testing framework (configured but tests not yet written)
- **Zustand** - Lightweight state management

## Project Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd signup-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests (configured, but tests yet to be written)
npm run lint     # Run ESLint
```

## Testing

The project is configured with Vitest for unit testing, but tests are yet to be written. The testing setup includes:

- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **MSW** - API mocking for testing scenarios

To run tests when they're implemented:
```bash
npm run test
```

## API Mocking and Error Testing

The project uses MSW (Mock Service Worker) to simulate API responses during development. This allows you to test various scenarios without a real backend.

### Mock API Endpoints

- **POST /api/register** - User registration endpoint

### Testing Error Scenarios

You can simulate different error scenarios using the browser console:

#### 1. Force Validation Errors
```javascript
// Simulate server-side validation errors
mockRegistration.forceValidationError();
```

#### 2. Force Network Errors
```javascript
// Simulate network connectivity issues
mockRegistration.forceNetworkError();
```

#### 3. Force Service Unavailable
```javascript
// Simulate server downtime
mockRegistration.forceServiceUnavailable();
```

#### 4. Test User Already Exists Scenario
```javascript
// Simulate user already registered error
mockRegistration.forceUserExistsError();
```

#### 5. Control Error Rates
```javascript
// Set 50% chance of random errors
mockRegistration.setErrorRate(0.5);
```

#### 6. Reset All Mocks
```javascript
// Return to normal behavior
mockRegistration.reset();
```

### Example Error Testing Workflow

1. **Open the application** in your browser
2. **Open browser console** (F12)
3. **Fill out the registration form** with valid data
4. **Trigger an error scenario** in console:
   ```javascript
   mockRegistration.forceUserExistsError();
   ```
5. **Submit the form** to see the error handling
6. **Reset the mock** when done:
   ```javascript
   mockRegistration.reset();
   ```

### Available Error Types

- **Validation Errors**: Missing fields, invalid formats
- **User Exists**: Email already registered
- **Network Errors**: Connection issues
- **Server Errors**: Service unavailable, timeouts
- **Random Errors**: Configurable error rate for testing

## Project Structure

```
src/
├── api/           # API layer and registration logic
├── components/    # Reusable UI components
├── pages/         # Page components for each step
├── store/         # Global state management
├── utils/         # Utility functions and validation
├── types/         # TypeScript type definitions
└── mocks/         # MSW mock handlers
```

## Development Notes

- The application uses **MSW** for API mocking, which intercepts network requests at the browser level
- **TypeScript** is used throughout for type safety
- **Tailwind CSS** provides the styling system with custom design tokens
- **Zustand** manages global state for the multi-step form
- **Zod** handles form validation with comprehensive error messages

