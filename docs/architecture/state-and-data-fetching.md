# Arquitectura — Estado y fetching (TanStack Query)

Toda la gestión de estado del servidor se hace con **TanStack Query v5**. No hay Zustand, Redux ni React Context para datos remotos. El estado local de UI se maneja con `useState`.

## Provider

`src/providers/QueryProvider.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);
```

**Importante:** el `QueryClient` se crea **sin opciones por defecto**. No hay `defaultOptions.queries.staleTime`, ni `retry`, ni `refetchOnWindowFocus`. Esto se delega a cada hook. (Ver mejora en [`conventions/naming-and-types.md`](../conventions/naming-and-types.md).)

El `QueryProvider` está montado **fuera** del `BrowserRouter` en `App.tsx`, lo cual es correcto: TanStack Query no necesita el contexto del Router.

## Convención de query keys

Las claves son **string literals** simples, sin factory:

```ts
['categorias']
['productos']
['proveedores']
['compras']
['ventas']
```

No hay claves jerárquicas (e.g. `['productos', id]`) porque la app no usa `useParams` para detalle.

## Patrón de hooks por recurso

Cada recurso expone un hook por verbo HTTP. La firma es **consistente** y predecible:

| Recurso | Listar | Crear | Editar | Eliminar |
|---|---|---|---|---|
| Categorías | `useCategorias()` | `useCreateCategoria()` | `useUpdateCategoria()` | — |
| Productos | `useProductos()` | `useCreateProducto()` | `useUpdateProducto()` | — |
| Proveedores | `useProveedores()` | `useCreateProveedor()` | `useUpdateProveedor()` | — |
| Compras | `useCompras()` | `useCreateCompra()` | — | — |
| Ventas | `useVentas()` | `useCreateVenta()` | — | — |

`Compras` y `Ventas` no tienen `update` (no se editan ventas/compras tras emitirse, según el dominio).

### Anatomía de un hook de listado

```ts
// src/hooks/useCategoria.ts (extracto)
export const useCategorias = () => {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: () => categoriaService.getAll(),
        staleTime: 1000 * 60 * 60,  // 1 hora
    });
};
```

`staleTime: 60 * 60 * 1000` está fijado **solo** en `useCategorias`, `useProductos` y `useProveedores` (recursos de "cambio lento"). `useCompras` y `useVentas` usan el default `0` (siempre stale, refetch inmediato). Esto es intencional: los datos transaccionales deben estar frescos; las listas de catálogo pueden cachearse una hora.

### Anatomía de un hook de mutación

```ts
export const useCreateCategoria = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CategoriaPayload) => categoriaService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            onSuccessCallback?.();
        },
    });
};
```

**Patrón clave:** el hook recibe un `onSuccessCallback` opcional. El componente (formulario) lo usa para resetear su estado o mostrar un banner. Esto evita que el hook conozca la UI.

### Cross-resource invalidation

Solo `useCreateVenta` invalida una query de otro recurso:

```ts
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['ventas'] });
    queryClient.invalidateQueries({ queryKey: ['productos'] });  // ← stock decrementado
    onSuccessCallback?.();
},
```

`useCreateCompra` **no** invalida `['productos']`, aunque una compra también afecta el stock. Es un bug latente. Ver [`operations/troubleshooting.md`](../operations/troubleshooting.md).

## Estado de carga y error

### En tablas (`*Tabla.tsx`)

```tsx
const { data: categorias = [], isLoading, isError } = useCategorias();

if (isLoading) {
    return (
        <tr><td colSpan={N}>Cargando...</td></tr>
    );
}
// render de filas…
```

No hay skeleton, no hay `isError` con UI de error (la tabla simplemente no renderiza filas si falla — el `<tr>Cargando…</tr>` se queda visible). **Esto es un bug menor**: el usuario no sabe si la carga está en curso o si falló.

### En formularios (`*Form.tsx`)

```tsx
const { mutate: create, isPending: isCreating, isError: createError } = useCreateCategoria();
const { mutate: update, isPending: isUpdating, isError: updateError } = useUpdateCategoria();

if (createError) {
    // muestra banner rojo con mensaje extraído del AxiosError
}
```

Los formularios sí distinguen entre `isPending` (deshabilita el botón) e `isError` (banner). El mensaje se extrae con un cast inline repetido en 4 archivos. Ver [`conventions/error-handling.md`](../conventions/error-handling.md) para la refactorización propuesta.

## Estado de éxito

Los forms usan un estado local `showSuccess` con `setTimeout(3000)`:

```tsx
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = () => {
    create(payload, {
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            resetForm();
        },
    });
};
```

No hay librería de toasts. La UX es aceptable pero no escalable. Si se quiere globalizar, una librería liviana (e.g. `sonner`) o un `<Toaster>` con un reducer global es el camino.

## Mutación vs. promesa

Los hooks exponen `mutate` (no `mutateAsync`). Toda la lógica de éxito/error va por callbacks (`onSuccess` / `onError`).

- **Pro:** simple, no requiere `try/catch` en el componente.
- **Contra:** si el `onSuccess` de un hook lanza (e.g. `invalidateQueries` falla), el componente no se entera. En la práctica, `invalidateQueries` no lanza.

## Variables derivadas de la query

Algunos forms derivan datos desde la query (e.g. `ProductoForm` carga `useCategorias()` para popular el `<select>` de categorías). Esto es correcto: el cache de TanStack Query actúa como fuente de verdad compartida.

## Resumen visual

```
Component
  ├── useQuery (listado)   ──► [queryKey] ──► service ──► Api
  └── useMutation (create/update) ──► service ──► Api
                                          │
                                          └── onSuccess:
                                              ├── queryClient.invalidateQueries([key])
                                              └── callback del componente
```

## Lo que **no** se hace

- **Sin `useInfiniteQuery`.** No hay paginación.
- **Sin `useSuspenseQuery`.** El proyecto no usa React Suspense para data.
- **Sin `placeholderData` / `keepPreviousData`.** Refetch siempre reemplaza la lista entera.
- **Sin `select` para transformar la respuesta.** El service ya devuelve `data` limpio.

## Mejoras recomendadas

1. **Global `staleTime` y `refetchOnWindowFocus: false` en el `QueryClient`.** Reduciría repetición y mejoraría UX.
2. **Wrapper `<ErrorBoundary>` por tabla** para mostrar UI de error en vez de quedarse en "Cargando...".
3. **Invalidar `['productos']` también en `useCreateCompra`.** Bug latente.
4. **Migrar a `useMutation` tipado** con la `error` como `AxiosError<{message?: string}>` para eliminar los casts inline.
