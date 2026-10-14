import { forwardRef } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helper?: string;
    options: SelectOption[];
    placeholder?: string;
    containerClassName?: string;
    children?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            helper,
            options,
            placeholder,
            containerClassName = '',
            className = '',
            id,
            required,
            children,
            ...rest
        },
        ref,
    ) => {
        const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3.5 pr-10 py-2.5 text-sm sm:text-base text-gray-700 transition-colors focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ${error ? 'border-red-500' : ''} ${className}`}
                        {...rest}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                        {children}
                    </select>
                    <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        width={18}
                        height={18}
                    />
                </div>
                {helper && !error && (
                    <p className="mt-1.5 text-xs text-gray-500">{helper}</p>
                )}
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';

export default Select;
