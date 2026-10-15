type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export const estadoToVariant = (estado: string): BadgeVariant => {
    const e = estado.toLowerCase();
    if (e === 'activo' || e === 'completado' || e === 'success') return 'success';
    if (e === 'inactivo' || e === 'cancelado' || e === 'anulado' || e === 'error') return 'danger';
    if (e === 'pendiente' || e === 'warning') return 'warning';
    if (e === 'info') return 'info';
    return 'neutral';
};
