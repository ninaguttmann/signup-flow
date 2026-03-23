import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, XIcon } from './Icons';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      options,
      placeholder,
      value,
      onChange,
      className,
      disabled = false,
      loading = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLButtonElement[]>([]);

    const filteredOptions = useMemo(() => options, [options]);

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value) || null,
      [options, value]
    );

    const handleSelect = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return;

        setIsOpen(false);
        onChange?.(option.value);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      onChange?.('');
    }, [onChange]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen || disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndex((prev) => {
              const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
              // Skip disabled options
              if (filteredOptions[nextIndex]?.disabled) {
                return prev < filteredOptions.length - 2 ? prev + 2 : 0;
              }
              return nextIndex;
            });
            break;
          case 'ArrowUp':
            event.preventDefault();
            setHighlightedIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
              // Skip disabled options
              if (filteredOptions[nextIndex]?.disabled) {
                return prev > 1 ? prev - 2 : filteredOptions.length - 1;
              }
              return nextIndex;
            });
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
            break;
          case 'Escape':
            event.preventDefault();
            setIsOpen(false);
            break;
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, disabled, filteredOptions, highlightedIndex, handleSelect]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(!isOpen);
        setHighlightedIndex(0);
      }
    };

    const displayText = selectedOption?.label || placeholder;

    return (
      <div className="form-group" ref={dropdownRef}>
        {label && <label className={cn('label', required && 'label-required')}>{label}</label>}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={cn(
              'input flex cursor-pointer appearance-none items-center justify-between',
              error && 'input-error',
              disabled && 'cursor-not-allowed opacity-50',
              loading && 'opacity-75',
              className
            )}
            disabled={disabled || loading}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-busy={loading}
          >
            <span className={cn('flex-1 text-left', !selectedOption && 'text-text-secondary')}>
              {displayText}
            </span>
            <div className="flex items-center gap-2">
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-main border-t-transparent" />
              )}
              {selectedOption && !loading && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="cursor-pointer text-text-secondary hover:text-text-main focus:outline-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClear();
                    }
                  }}
                  aria-label="Clear selection"
                >
                  <XIcon />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="text-text-secondary hover:text-text-main focus:outline-none"
                aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
                disabled={disabled || loading}
              >
                <ChevronDownIcon
                  className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>
            </div>
          </button>

          {isOpen && !disabled && !loading && (
            <div
              className="absolute z-20 mt-1 max-h-60 w-full max-w-[426px] overflow-auto rounded-md border border-text-secondary bg-white shadow-lg"
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-caption-medium text-text-secondary">
                  No options available
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    ref={(el) => {
                      if (el) {
                        optionsRef.current[index] = el;
                      }
                    }}
                    type="button"
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={selectedOption?.value === option.value}
                    aria-disabled={option.disabled}
                    disabled={option.disabled}
                    className={cn(
                      'w-full px-4 py-3 text-left text-caption-medium text-text-input transition-colors duration-150 hover:bg-card-hover focus:bg-card-hover focus:outline-none',
                      selectedOption?.value === option.value && 'bg-card-hover text-primary-main',
                      highlightedIndex === index && 'bg-card-hover text-primary-main',
                      option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                    )}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {error && <span className="error-text">{error}</span>}
        {helperText && !error && <span className="helper-text">{helperText}</span>}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
