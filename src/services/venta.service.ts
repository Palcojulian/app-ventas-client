import { Api } from '../config/axios';
import type { Venta, VentaPayload, VentaResponse } from '../types/venta.types';

export const ventaService = {
    getAll: async (): Promise<Venta[]> => {
        const { data } = await Api.get<Venta[]>('/api/v1/ventas');
        return data;
    },
    create: async (payload: VentaPayload): Promise<VentaResponse> => {
        const { data } = await Api.post<VentaResponse>('/api/v1/ventas', payload);
        return data;
    },
};
