import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, XIcon } from './Icons';

interface SelectOption {
  value: string;
  label: string;
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
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      options.find((option) => option.value === value) || null
    );
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLButtonElement[]>([]);

    const handleSelect = useCallback(
      (option: SelectOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange?.(option.value);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      setSelectedOption(null);
      onChange?.('');
    }, [onChange]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen || disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
            break;
          case 'ArrowUp':
            event.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (highlightedIndex >= 0 && options[highlightedIndex]) {
              handleSelect(options[highlightedIndex]);
            }
            break;
          case 'Escape':
            event.preventDefault();
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, disabled, options, highlightedIndex, handleSelect]);

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
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={cn(
              'input flex cursor-pointer appearance-none items-center justify-between',
              error && 'input-error',
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className={cn('flex-1 text-left', !selectedOption && 'text-text-secondary')}>
              {displayText}
            </span>
            <div className="flex items-center gap-2">
              {selectedOption && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="text-text-secondary hover:text-text-main focus:outline-none"
                  aria-label="Clear selection"
                >
                  <XIcon />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="text-text-secondary hover:text-text-main focus:outline-none"
                aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
              >
                <ChevronDownIcon
                  className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>
            </div>
          </button>

          {isOpen && !disabled && (
            <div
              className="absolute z-20 mt-1 max-h-60 w-full max-w-[426px] overflow-auto rounded-md border border-text-secondary bg-white shadow-lg"
              role="listbox"
            >
              {options.map((option, index) => (
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
                  className={cn(
                    'w-full px-4 py-3 text-left text-caption-medium text-text-input transition-colors duration-150 hover:bg-card-hover focus:bg-card-hover focus:outline-none',
                    selectedOption?.value === option.value && 'bg-card-hover text-primary-main',
                    highlightedIndex === index && 'bg-card-hover text-primary-main'
                  )}
                >
                  {option.label}
                </button>
              ))}
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
