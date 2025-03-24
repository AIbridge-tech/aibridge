import React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function Input({
  id,
  label,
  helperText,
  error,
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}: InputProps) {
  // Generate a random ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseClasses = 'bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };
  
  // Padding based on icons
  let paddingLeft = 'pl-3';
  let paddingRight = 'pr-3';
  
  if (leftIcon) paddingLeft = 'pl-10';
  if (rightIcon) paddingRight = 'pr-10';
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Status classes (error, disabled)
  let statusClasses = 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500';
  
  if (error) {
    statusClasses = 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300';
  } else if (disabled) {
    statusClasses = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed';
  }
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${paddingLeft} ${paddingRight} ${statusClasses} ${widthClass} ${className}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p
          id={error ? `${inputId}-error` : `${inputId}-helper`}
          className={`mt-1 text-sm ${
            error ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
} 