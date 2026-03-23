import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const variantClasses = {
    primary: '',
    secondary: 'btn-secondary',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'btn',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="mr-2 inline-block animate-spin">⟳</span>
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
