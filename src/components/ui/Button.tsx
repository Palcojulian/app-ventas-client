import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
    primary:
        'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-indigo-300',
    secondary:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400',
    danger:
        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300',
    ghost:
        'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-300',
    outline:
        'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm sm:text-base',
    lg: 'h-12 px-6 text-base',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    disabled,
    ...rest
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed hover:cursor-pointer disabled:hover:bg-current ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...rest}
        >
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
};

export default Button;
