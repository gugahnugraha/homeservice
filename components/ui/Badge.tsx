import React, { HTMLAttributes } from 'react';
import { cn } from './Button';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
    // Booking Statuses
    PENDING: { label: 'Pending', variant: 'warning' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    PROVIDER_ASSIGNED: { label: 'Provider Assigned', variant: 'info' },
    PROVIDER_ACCEPTED: { label: 'Accepted', variant: 'info' },
    ON_THE_WAY: { label: 'On The Way', variant: 'primary' },
    ARRIVED: { label: 'Arrived', variant: 'primary' },
    IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CUSTOMER_CONFIRMED: { label: 'Finished', variant: 'success' },
    CANCELLED_BY_CUSTOMER: { label: 'Cancelled', variant: 'danger' },
    CANCELLED_BY_PROVIDER: { label: 'Cancelled by Tech', variant: 'danger' },
    CANCELLED_BY_ADMIN: { label: 'Cancelled by Admin', variant: 'danger' },

    // Verification Statuses
    UNVERIFIED: { label: 'Unverified', variant: 'default' },
    VERIFIED: { label: 'Verified Pro', variant: 'success' },
    REJECTED: { label: 'Verification Rejected', variant: 'danger' },

    // Availability
    ONLINE: { label: 'Online', variant: 'success' },
    OFFLINE: { label: 'Offline', variant: 'default' },
    BUSY: { label: 'On Job', variant: 'warning' },
    ON_VACATION: { label: 'On Leave', variant: 'default' },
  };

  const config = statusMap[status] || { label: status, variant: 'default' as BadgeVariant };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default Badge;
