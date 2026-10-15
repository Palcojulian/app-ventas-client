import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helper,
            leftIcon,
            rightIcon,
            containerClassName = '',
            className = '',
            id,
            required,
            ...rest
        },
        ref,
    ) => {
        const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
        const helperId = helper ? `${inputId}-helper` : undefined;
        const errorId = error ? `${inputId}-error` : undefined;
        const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={error ? 'true' : undefined}
                        aria-describedby={describedBy}
                        className={`w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                        {...rest}
                    />
                    {rightIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {helper && !error && (
                    <p id={helperId} className="mt-1.5 text-xs text-gray-500">
                        {helper}
                    </p>
                )}
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
