import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  linkText?: string;
  linkUrl?: string;
  linkAction?: 'browser' | 'popup';
  onLinkClick?: () => void;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      linkText,
      linkUrl,
      linkAction = 'browser',
      onLinkClick,
      error,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const handleLinkClick = (e: React.MouseEvent) => {
      e.preventDefault();

      if (linkAction === 'popup' && onLinkClick) {
        onLinkClick();
      } else if (linkUrl) {
        window.open(linkUrl, '_blank');
      }
    };
    return (
      <div className="form-group">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn('checkbox', className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          {(label || linkText) && (
            <label
              htmlFor={checkboxId}
              className="checkbox-text flex flex-1 cursor-pointer items-center"
            >
              {label && <span>{label}</span>}
              {label && linkText && <span className="mr-1"> </span>}
              {linkText && (
                <a
                  href={linkUrl}
                  onClick={handleLinkClick}
                  className="checkbox-link"
                  aria-label={`Learn more about ${linkText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkText}
                </a>
              )}
            </label>
          )}
        </div>
        {error && (
          <span id={`${checkboxId}-error`} className="error-text" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
