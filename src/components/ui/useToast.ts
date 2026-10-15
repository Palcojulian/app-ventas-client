import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './toast-context';

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast debe usarse dentro de un ToastProvider');
    }
    return ctx;
};
