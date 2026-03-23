import React from 'react';
import type { IconProps } from './Icons';
import { ArrowRightIcon } from './Icons';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'div';
  icon?: React.ComponentType<IconProps>;
  iconHover?: React.ComponentType<IconProps>;
  title?: string;
  subtitle?: string;
  arrowIcon?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  type = 'div',
  icon: Icon,
  iconHover: IconHover,
  title,
  subtitle,
  arrowIcon = false,
}) => {
  const baseClasses =
    'card hover:card-hover group flex items-center justify-between transition-all duration-200';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const content = (
    <>
      {Icon && (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Icon className="opacity-100 transition-opacity duration-200 group-hover:opacity-0" />
            {IconHover && (
              <IconHover className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            )}
          </div>
          {(title || subtitle) && (
            <div className="flex flex-col text-left">
              {title && <div className="heading-3 mb-1">{title}</div>}
              {subtitle && (
                <div className="max-w-[239px] text-caption text-text-secondary">{subtitle}</div>
              )}
            </div>
          )}
        </div>
      )}
      {children && !Icon && children}
      {arrowIcon && (
        <ArrowRightIcon className="opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}
    </>
  );

  if (type === 'button') {
    return (
      <button className={combinedClasses} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <div className={combinedClasses} onClick={onClick}>
      {content}
    </div>
  );
};

export default Card;
