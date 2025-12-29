import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3.5 rounded-[5px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#2d8659] to-[#1a5f3f] text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#2d8659]',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}

