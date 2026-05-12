import { Api } from '../config/axios';
import type { Proveedor, ProveedorPayload, ProveedorResponse } from '../types/proveedor.types';

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        const { data } = await Api.get<Proveedor[]>('/api/v1/proveedores');
        return data;
    },
    create: async (payload: ProveedorPayload): Promise<ProveedorResponse> => {
        const { data } = await Api.post<ProveedorResponse>('/api/v1/proveedores', payload);
        return data;
    },
    update: async (id: number, payload: ProveedorPayload): Promise<ProveedorResponse> => {
        const { data } = await Api.put<ProveedorResponse>(`/api/v1/proveedores/${id}`, payload);
        return data;
    },
};