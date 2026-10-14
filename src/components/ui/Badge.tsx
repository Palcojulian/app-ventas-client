import type { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-sky-100 text-sky-700',
    neutral: 'bg-gray-100 text-gray-700',
};

const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full capitalize ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
