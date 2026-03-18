import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="page-wrapper">
      <div className="card container-center text-center">
        <h1 className="heading-2 mb-2">Something went wrong</h1>
        <p className="body-text mb-4 text-left">
          <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button onClick={resetErrorBoundary} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
};
