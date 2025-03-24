import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = 'md',
  rounded = 'md',
  hoverEffect = false,
}: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverClass = hoverEffect ? 'transition-shadow hover:shadow-lg' : '';
  
  const cardClasses = `
    bg-white dark:bg-gray-800 
    ${paddingClasses[padding]} 
    ${shadowClasses[shadow]} 
    ${roundedClasses[rounded]} 
    ${borderClass} 
    ${hoverClass} 
    ${className}
  `;

  return <div className={cardClasses}>{children}</div>;
} 