import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'primary';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  className 
}) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    neutral: 'bg-slate-50 text-slate-700 border-slate-100',
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md", className)} {...props}>
      {children}
    </div>
  );
};
