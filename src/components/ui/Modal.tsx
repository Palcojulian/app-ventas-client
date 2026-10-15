import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
};

const Modal = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
}: ModalProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const reactId = useId();
    const titleId = `modal-title-${reactId}`;
    const descId = `modal-desc-${reactId}`;

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            dialogRef.current?.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={dialogRef}
                tabIndex={-1}
                className={`relative bg-white w-full ${sizeClasses[size]} sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] animate-[slideUp_200ms_ease-out] focus:outline-none`}
            >
                {(title || description) && (
                    <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-gray-200 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h3 id={titleId} className="text-base sm:text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p id={descId} className="mt-1 text-sm text-gray-500">
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors hover:cursor-pointer flex-shrink-0"
                            title="Cerrar"
                            aria-label="Cerrar"
                        >
                            <X width={20} height={20} />
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
                {footer && (
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 sm:p-5 border-t border-gray-200 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger';
    loading?: boolean;
}

export const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'primary',
    loading = false,
}: ConfirmModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            description={description}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </Button>
                </>
            }
        />
    );
};

export default Modal;
