import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compraService } from '../services/compra.service';
import type { CompraPayload } from '../types/compra.types';

export const useCompras = () => {
    return useQuery({
        queryKey: ['compras'],
        queryFn: () => compraService.getAll(),
    });
};

export const useCreateCompra = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: CompraPayload) => compraService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compras'] });
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