import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg focus:ring-brand-500',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-md focus:ring-slate-700',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-md focus:ring-accent-500',
    outline: 'border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
