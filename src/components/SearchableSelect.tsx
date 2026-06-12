import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

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
    required = false,
    disabled = false,
    clearValue,
    emptyMessage = 'No se encontraron resultados',
    searchPlaceholder = 'Buscar...',
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const hasValue = selectedOption !== undefined;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const filteredOptions = options.filter((opt) => {
        const text = `${opt.label} ${opt.subLabel ?? ''}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const handleSelect = (optionValue: T) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(clearValue);
        setSearchTerm('');
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between text-sm transition-all ${
                    disabled
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500'
                        : `bg-white border-gray-200 cursor-pointer hover:border-gray-300 ${isOpen ? 'ring-2 ring-indigo-500 border-transparent' : ''}`
                }`}
            >
                <span className={hasValue ? 'text-gray-700' : 'text-gray-400'}>
                    {hasValue ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {hasValue && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-400 hover:text-red-500 hover:cursor-pointer"
                            title="Limpiar"
                        >
                            <X width={14} height={14} />
                        </button>
                    )}
                    <ChevronDown
                        width={16}
                        height={16}
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    />
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-gray-500 text-center">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={String(opt.value)}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                                        opt.value === value
                                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    <div>{opt.label}</div>
                                    {opt.subLabel && (
                                        <div className="text-xs text-gray-500">{opt.subLabel}</div>
                                    )}
                                </div>
                            ))
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
        </div>
    );
}
