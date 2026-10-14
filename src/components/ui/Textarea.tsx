import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helper?: string;
    containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helper,
            containerClassName = '',
            className = '',
            id,
            required,
            rows = 3,
            ...rest
        },
        ref,
    ) => {
        const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    className={`w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 transition-colors resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${error ? 'border-red-500' : ''} ${className}`}
                    {...rest}
                />
                {helper && !error && (
                    <p className="mt-1.5 text-xs text-gray-500">{helper}</p>
                )}
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export default Textarea;
