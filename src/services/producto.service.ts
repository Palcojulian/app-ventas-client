import { Api } from '../config/axios';
import type { Producto, ProductoPayload, ProductoResponse } from '../types/producto.types';

export const productoService = {
    getAll: async (): Promise<Producto[]> => {
        const { data } = await Api.get<Producto[]>('/api/v1/productos');
        return data;
    },
    create: async (payload: ProductoPayload): Promise<ProductoResponse> => {
        const { data } = await Api.post<ProductoResponse>('/api/v1/productos', payload);
        return data;
    },
    update: async (id: number, payload: ProductoPayload): Promise<ProductoResponse> => {
        const { data } = await Api.put<ProductoResponse>(`/api/v1/productos/${id}`, payload);
        return data;
    },
};