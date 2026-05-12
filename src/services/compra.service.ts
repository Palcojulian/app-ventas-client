import { Api } from '../config/axios';
import type { Compra, CompraPayload, CompraResponse } from '../types/compra.types';

export const compraService = {
    getAll: async (): Promise<Compra[]> => {
        const { data } = await Api.get<Compra[]>('/api/v1/compras');
        return data;
    },
    create: async (payload: CompraPayload): Promise<CompraResponse> => {
        const { data } = await Api.post<CompraResponse>('/api/v1/compras', payload);
        return data;
    },
};