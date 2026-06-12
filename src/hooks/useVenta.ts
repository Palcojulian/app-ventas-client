import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ventaService } from '../services/venta.service';
import type { VentaPayload } from '../types/venta.types';

export const useVentas = () => {
    return useQuery({
        queryKey: ['ventas'],
        queryFn: () => ventaService.getAll(),
    });
};

export const useCreateVenta = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: VentaPayload) => ventaService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventas'] });
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
