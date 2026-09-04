import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { proveedorService } from '../services/proveedor.service';
import type { ProveedorPayload } from '../types/proveedor.types';

export const useProveedores = () => {
    return useQuery({
        queryKey: ['proveedores'],
        queryFn: () => proveedorService.getAll(),
        staleTime: 60 * 1000 * 60
    });
};

export const useCreateProveedor = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: ProveedorPayload) => proveedorService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proveedores'] });
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

export const useUpdateProveedor = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ProveedorPayload }) =>
            proveedorService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proveedores'] });
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