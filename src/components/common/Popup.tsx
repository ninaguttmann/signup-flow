import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { XIcon } from './Icons';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Popup = forwardRef<HTMLDivElement, PopupProps>(
  ({ isOpen, onClose, children, className, showCloseButton = true, size = 'md' }, ref) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (!isOpen) return;

      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      // Focus management
      if (showCloseButton && closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (popupRef.current) {
        popupRef.current.focus();
      }

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, onClose, showCloseButton]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Popup Content */}
        <div
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            popupRef.current = node;
          }}
          className={cn(
            'relative m-4 rounded-md bg-white p-6 shadow-lg transition-all',
            sizeClasses[size],
            className
          )}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-text-secondary transition-colors hover:text-text-main focus:text-text-main focus:outline-none"
              aria-label="Close popup"
            >
              <XIcon />
            </button>
          )}

          {/* Content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }
);

Popup.displayName = 'Popup';

export default Popup;
