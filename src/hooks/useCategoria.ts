import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoria.service';
import type { CategoriaPayload } from '../types/categoria.types';

export const useCategorias = () => {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: () => categoriaService.getAll(),
    });
};

export const useCreateCategoria = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: CategoriaPayload) => categoriaService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            onSuccess?.();
        },
    });

    return {
        create: createMutation.mutate,
        isLoading: createMutation.isPending,
        isError: createMutation.isError,
        isSuccess: createMutation.isSuccess,
        error: createMutation.error,
    };
};

export const useUpdateCategoria = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CategoriaPayload }) =>
            categoriaService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            onSuccess?.();
        },
    });

    return {
        update: updateMutation.mutate,
        isLoading: updateMutation.isPending,
        isError: updateMutation.isError,
        isSuccess: updateMutation.isSuccess,
        error: updateMutation.error,
    };
};