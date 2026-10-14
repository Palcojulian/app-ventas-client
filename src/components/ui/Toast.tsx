import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import {
    ToastContext,
    type Toast,
    type ToastContextValue,
} from './toast-context';

const iconFor = (type: Toast['type']) => {
    switch (type) {
        case 'success':
            return <CheckCircle2 width={20} height={20} />;
        case 'error':
            return <XCircle width={20} height={20} />;
        case 'warning':
            return <AlertTriangle width={20} height={20} />;
        case 'info':
        default:
            return <Info width={20} height={20} />;
    }
};

const classesFor = (type: Toast['type']) => {
    switch (type) {
        case 'success':
            return 'bg-white border-emerald-200 text-emerald-700';
        case 'error':
            return 'bg-white border-red-200 text-red-700';
        case 'warning':
            return 'bg-white border-amber-200 text-amber-700';
        case 'info':
        default:
            return 'bg-white border-sky-200 text-sky-700';
    }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const show = (type: Toast['type'], message: string, duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
    };

    const value: ToastContextValue = {
        show,
        success: (m, d) => show('success', m, d),
        error: (m, d) => show('error', m, d),
        info: (m, d) => show('info', m, d),
        warning: (m, d) => show('warning', m, d),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm sm:max-w-sm sm:bottom-6 sm:right-6 pointer-events-none"
                role="region"
                aria-label="Notificaciones"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border shadow-lg transition-all duration-200 ${classesFor(toast.type)} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            role="status"
        >
            <span className="flex-shrink-0 mt-0.5">{iconFor(toast.type)}</span>
            <p className="flex-1 text-sm font-medium text-gray-800 break-words">{toast.message}</p>
            <button
                type="button"
                onClick={onDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:cursor-pointer p-0.5 rounded transition-colors"
                aria-label="Cerrar notificación"
            >
                <X width={16} height={16} />
            </button>
        </div>
    );
};
