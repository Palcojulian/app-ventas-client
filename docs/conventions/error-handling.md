# Convenciones — Manejo de errores

El proyecto no usa librería de validación ni toasts. Los errores de la API se manejan con:

1. **Cast inline de `AxiosError`** repetido en 4 formularios.
2. **Banner rojo local** con `setState`.
3. **`window.confirm`** para acciones destructivas / edición.

Este documento describe el patrón actual y propone un refactor.

## Patrón actual

### En formularios

```tsx
const { mutate: create, isPending: isCreating, isError: createError } = useCreateCategoria();

return (
    <form>
        {createError && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
                {(createError as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? 'Error al crear la categoría'}
            </div>
        )}
        {/* … */}
    </form>
);
```

El cast `(createError as { response?: { data?: { message?: string } } })` está **duplicado en 4 formularios** (`CategoriaForm`, `ProductoForm`, `ProveedorForm`, `CompraForm`, `VentaForm`).

### Por qué se repite

TanStack Query v5 tipa `useMutation().error` como `unknown` por defecto. Para acceder a `error.response.data.message` hay que hacer un cast o tipar la mutación.

## Refactor propuesto

### 1. Helper `getApiErrorMessage`

Crear `src/utils/apiError.ts`:

```ts
import type { AxiosError } from 'axios';

interface ApiErrorBody {
    message?: string;
    error?: string;
}

export const getApiErrorMessage = (err: unknown, fallback = 'Ha ocurrido un error'): string => {
    if (!err) return fallback;
    const axiosErr = err as AxiosError<ApiErrorBody>;
    return (
        axiosErr?.response?.data?.message ??
        axiosErr?.response?.data?.error ??
        axiosErr?.message ??
        fallback
    );
};
```

Uso:

```tsx
import { getApiErrorMessage } from '../utils/apiError';

{createError && (
    <div className="bg-red-100 text-red-700 p-2 rounded">
        {getApiErrorMessage(createError, 'Error al crear la categoría')}
    </div>
)}
```

### 2. Tipar `useMutation` con `AxiosError<ApiErrorBody>`

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useCreateCategoria = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation<
        CategoriaResponse,                         // TData
        AxiosError<ApiErrorBody>,                 // TError
        CategoriaPayload                           // TVariables
    >({
        mutationFn: (payload) => categoriaService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            onSuccessCallback?.();
        },
    });
};
```

Con esto, `createError` queda tipado como `AxiosError<ApiErrorBody>` y el cast inline desaparece.

### 3. Componente `<ErrorBanner>` reutilizable

```tsx
// src/components/ErrorBanner.tsx
interface Props {
    error: unknown;
    fallback?: string;
}

export const ErrorBanner = ({ error, fallback = 'Ha ocurrido un error' }: Props) => {
    if (!error) return null;
    return (
        <div className="bg-red-100 text-red-700 p-2 rounded" role="alert">
            {getApiErrorMessage(error, fallback)}
        </div>
    );
};
```

Uso:

```tsx
<ErrorBanner error={createError} fallback="Error al crear la categoría" />
```

Mejora: añadir `aria-live="polite"` para que los lectores de pantalla anuncien el error.

## Errores de carga (queries)

Las tablas **no** manejan `isError`. Si `useCategorias()` falla:

```tsx
const { data, isLoading, isError } = useCategorias();
// isError nunca se usa
```

Resultado: `data` queda `undefined`, el `?? []` lo convierte en `[]`, y la tabla se ve vacía sin explicación. **Bug menor conocido.**

### Refactor propuesto

```tsx
if (isError) {
    return (
        <tr>
            <td colSpan={N} className="text-center py-6 text-red-600">
                Error al cargar las categorías.{' '}
                <button onClick={() => refetch()} className="underline">
                    Reintentar
                </button>
            </td>
        </tr>
    );
}
```

Idealmente, todo esto encapsulado en un `<DataTable<T>>` (ver [`conventions/tables.md`](./tables.md)).

## Errores de validación del cliente

**No hay validación del cliente más allá de HTML5 nativa.**

- `required` se usa en la mayoría de los inputs.
- `maxLength={10}` en `Categoria.prefijo`.
- **Falta** `min`/`max` en numéricos (`precio_venta`, `costo`, `cantidad`).
- **Falta** validación de formato (email, números de factura).

Si se quiere validación rica, la opción idiomática es **`react-hook-form` + `Zod`**. El refactor es mediano (toca los 5 formularios) pero deja validación declarativa, errores accesibles y menos boilerplate de `useState`.

### Esqueleto con react-hook-form + Zod

```ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categoriaSchema = z.object({
    nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    prefijo: z.string().length(3, 'Debe tener 3 caracteres'),
    estado: z.enum(['activo', 'inactivo']),
});

type CategoriaFormValues = z.infer<typeof categoriaSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: editingCategoria,
});
```

Cada form pasa de ~150 líneas a ~80.

## Acciones destructivas

**No hay delete en ningún recurso** (ver [`operations/troubleshooting.md`](../operations/troubleshooting.md)). Si se añade:

- ❌ No usar `window.confirm` (UX pobre).
- ✅ Usar un modal estilizado o un componente `<ConfirmDialog>` reutilizable.
- ✅ Pedir texto de confirmación para acciones críticas (e.g. "Escribe ELIMINAR para confirmar").

## Resumen de mejoras

| Problema | Mejora | Esfuerzo |
|---|---|---|
| Cast inline de `AxiosError` repetido 5 veces | `getApiErrorMessage(err)` en `utils/` | Bajo |
| Falta tipado de `useMutation` | Tipar con `AxiosError<ApiErrorBody>` | Bajo |
| Banner rojo duplicado en 5 forms | `<ErrorBanner error={…} />` | Bajo |
| Tablas no manejan `isError` | Branch explícito en cada tabla (o en `<DataTable>`) | Medio |
| Sin validación rica | `react-hook-form` + `Zod` | Alto (refactor global) |
| `window.confirm` para edición | Modal estilizado | Medio |
| Sin `aria-live` en errores | Añadir `role="alert"` y `aria-live="polite"` | Bajo |
