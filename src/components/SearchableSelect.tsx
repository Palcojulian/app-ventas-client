import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface SearchableSelectOption<T> {
    value: T;
    label: string;
    subLabel?: string;
}

interface SearchableSelectProps<T extends string | number> {
    value: T;
    onChange: (value: T) => void;
    options: SearchableSelectOption<T>[];
    placeholder?: string;
    title?: string;
    required?: boolean;
    disabled?: boolean;
    clearValue: T;
    emptyMessage?: string;
    searchPlaceholder?: string;
}

export function SearchableSelect<T extends string | number>({
    value,
    onChange,
    options,
    placeholder = 'Seleccione',
    title,
    required = false,
    disabled = false,
    clearValue,
    emptyMessage = 'No se encontraron resultados',
    searchPlaceholder = 'Buscar...',
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const hasValue = selectedOption !== undefined;

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const filteredOptions = options.filter((opt) => {
        const text = `${opt.label} ${opt.subLabel ?? ''}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const openModal = () => {
        if (!disabled) setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleSelect = (optionValue: T) => {
        onChange(optionValue);
        closeModal();
    };

    const handleClear = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        onChange(clearValue);
    };

    return (
        <>
            <div
                onClick={openModal}
                className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between text-sm transition-all ${
                    disabled
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500'
                        : 'bg-white border-gray-200 cursor-pointer hover:border-gray-300'
                }`}
            >
                <span className={hasValue ? 'text-gray-700 truncate' : 'text-gray-400'}>
                    {hasValue ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {hasValue && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-400 hover:text-red-500 hover:cursor-pointer"
                            title="Limpiar"
                            aria-label="Limpiar selección"
                        >
                            <X width={14} height={14} />
                        </button>
                    )}
                    <ChevronDown width={16} height={16} className="text-gray-400" />
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeModal}
                        aria-hidden="true"
                    />
                    <div className="relative bg-white w-full sm:max-w-lg sm:rounded-xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[80vh]">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 truncate pr-2">
                                {title ?? placeholder}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer flex-shrink-0"
                                title="Cerrar"
                                aria-label="Cerrar"
                            >
                                <X width={20} height={20} />
                            </button>
                        </div>

                        <div className="p-4 border-b border-gray-200 flex-shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-8 text-sm text-gray-500 text-center">
                                    {emptyMessage}
                                </div>
                            ) : (
                                <ul>
                                    {filteredOptions.map((opt) => (
                                        <li
                                            key={String(opt.value)}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`px-4 py-3 cursor-pointer hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 ${
                                                opt.value === value ? 'bg-indigo-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        className={`text-sm ${opt.value === value ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}
                                                    >
                                                        {opt.label}
                                                    </div>
                                                    {opt.subLabel && (
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {opt.subLabel}
                                                        </div>
                                                    )}
                                                </div>
                                                {opt.value === value && (
                                                    <Check
                                                        width={18}
                                                        height={18}
                                                        className="text-indigo-600 flex-shrink-0"
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {hasValue && !disabled && (
                            <div className="p-3 border-t border-gray-200 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg hover:cursor-pointer"
                                >
                                    Limpiar selección
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {required && !hasValue && (
                <input
                    tabIndex={-1}
                    value=""
                    onChange={() => {}}
                    required
                    aria-hidden="true"
                    className="absolute opacity-0 pointer-events-none"
                    style={{ height: 0, width: 0, left: 0, top: 0 }}
                />
            )}
        </>
    );
}
