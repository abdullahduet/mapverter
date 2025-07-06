import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon = null,
  rightIcon = null,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  const variantClasses = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed',
    outlineExt: 'border-2 border-current hover:bg-current hover:text-white dark:hover:text-neutral-900 focus:ring-current disabled:opacity-50 disabled:cursor-not-allowed transition-all',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-4 py-2 text-base rounded-md',
    xl: 'px-6 py-3 text-base rounded-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `.trim();

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <LoadingSpinner />}
      {leftIcon && !isLoading && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {isLoading ? loadingText : children}
      {rightIcon && !isLoading && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'outlineExt', 'ghost', 'success', 'error']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node
};

export default Button;