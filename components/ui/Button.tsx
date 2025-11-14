
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500',
    secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`;

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};
