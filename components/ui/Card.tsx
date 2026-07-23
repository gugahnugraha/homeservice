import React, { HTMLAttributes } from 'react';
import { cn } from './Button';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5 border-b border-slate-100 dark:border-slate-800/80', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
