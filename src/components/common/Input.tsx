import React, { forwardRef, useState, useId } from 'react';
import { cn } from '@/utils/cn.ts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className={cn('label', required && 'label-required')}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn('input', error && 'input-error', isPassword && 'pr-14', className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle password-toggle-text"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="error-text" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className="helper-text">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
