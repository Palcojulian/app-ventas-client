import { Api } from '../config/axios';
import type { Categoria, CategoriaPayload, CategoriaResponse } from '../types/categoria.types';

export const categoriaService = {
    getAll: async (): Promise<Categoria[]> => {
        const { data } = await Api.get<Categoria[]>('/api/v1/categorias');
        return data;
    },
    create: async (payload: CategoriaPayload): Promise<CategoriaResponse> => {
        const { data } = await Api.post<CategoriaResponse>('/api/v1/categorias', payload);
        return data;
    },
    update: async (id: number, payload: CategoriaPayload): Promise<CategoriaResponse> => {
        const { data } = await Api.put<CategoriaResponse>(`/api/v1/categorias/${id}`, payload);
        return data;
    },
};