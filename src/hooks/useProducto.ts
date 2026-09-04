import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/producto.service';
import type { ProductoPayload } from '../types/producto.types';

export const useProductos = () => {
    return useQuery({
        queryKey: ['productos'],
        queryFn: () => productoService.getAll(),
        staleTime: 60 * 1000 * 60
    });
};

export const useCreateProducto = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: ProductoPayload) => productoService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
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

export const useUpdateProducto = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ProductoPayload }) =>
            productoService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
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