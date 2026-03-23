import { XIcon, ErrorIcon } from './Icons';

interface ErrorMessageProps {
  message: string;
  details?: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage = ({ message, details, onDismiss, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0">
        <ErrorIcon className="w-6 h-6 text-error" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="heading font-medium text-error">
          Registration Failed
        </p>
        <p className="text-sm text-error mt-1">
          {message}
        </p>
        {details && (
          <p className="text-sm text-error mt-2 italic">
            {details}
          </p>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss error"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
