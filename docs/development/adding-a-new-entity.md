# Desarrollo — Cómo añadir un nuevo recurso (entidad)

Esta guía paso a paso documenta cómo añadir una nueva entidad al sistema, siguiendo las convenciones del proyecto. Usaremos como ejemplo una entidad **`Cliente`** con campos `id`, `nombre`, `email`, `telefono`.

> **Nota:** estos pasos asumen que la API backend ya existe. Si no, primero definir el endpoint.

## 1. Crear los tipos (`src/types/cliente.types.ts`)

```ts
export interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    created_at?: string;
    updated_at?: string;
}

export type ClientePayload = Omit<Cliente, 'id' | 'created_at' | 'updated_at'>;

// Si la respuesta del POST/PUT tiene la misma forma que el GET:
export type ClienteResponse = Cliente;
```

Convención: la triada `<Entity>`, `<Entity>Payload`, `<Entity>Response`. Ver [`conventions/naming-and-types.md`](../conventions/naming-and-types.md).

## 2. Crear el service (`src/services/cliente.service.ts`)

```ts
import Api from '../config/axios';
import type { Cliente, ClientePayload, ClienteResponse } from '../types/cliente.types';

const unwrap = <T>(response: { data: { data: T } }): T => response.data.data;

export const clienteService = {
    getAll: async (): Promise<Cliente[]> => {
        const res = await Api.get<{ data: Cliente[] }>('/api/clientes');
        return unwrap(res);
    },
    create: async (payload: ClientePayload): Promise<ClienteResponse> => {
        const res = await Api.post<{ data: ClienteResponse }>('/api/clientes', payload);
        return unwrap(res);
    },
    update: async (id: number, payload: ClientePayload): Promise<ClienteResponse> => {
        const res = await Api.put<{ data: ClienteResponse }>(`/api/clientes/${id}`, payload);
        return unwrap(res);
    },
};
```

El helper `unwrap` quita la envoltura `{ success, data }` del backend. Ver [`architecture/api-client.md`](../../architecture/api-client.md).

## 3. Crear el hook (`src/hooks/useCliente.ts`)

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { clienteService } from '../services/cliente.service';
import type { Cliente, ClientePayload, ClienteResponse } from '../types/cliente.types';
import type { ApiErrorBody } from '../utils/apiError';  // (helper propuesto)

const QUERY_KEY = ['clientes'] as const;

export const useClientes = () =>
    useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => clienteService.getAll(),
        staleTime: 1000 * 60 * 60,  // 1 hora (cambio lento)
    });

export const useCreateCliente = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation<
        ClienteResponse,
        AxiosError<ApiErrorBody>,
        ClientePayload
    >({
        mutationFn: (payload) => clienteService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            onSuccessCallback?.();
        },
    });
};

export const useUpdateCliente = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation<
        ClienteResponse,
        AxiosError<ApiErrorBody>,
        { id: number; payload: ClientePayload }
    >({
        mutationFn: ({ id, payload }) => clienteService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            onSuccessCallback?.();
        },
    });
};
```

Convención: el hook recibe `onSuccessCallback` opcional para resetear el form. Ver [`conventions/forms.md`](../conventions/forms.md).

## 4. Crear el formulario (`src/components/ClienteForm.tsx`)

```tsx
import { useState, type FormEvent } from 'react';
import { useCreateCliente, useUpdateCliente } from '../hooks/useCliente';
import { getApiErrorMessage } from '../utils/apiError';
import { ErrorBanner } from './ErrorBanner';
import type { Cliente } from '../types/cliente.types';

interface Props {
    cliente?: Cliente;
    onCancel?: () => void;
}

export const ClienteForm = ({ cliente, onCancel }: Props) => {
    const isEditMode = !!cliente;
    const [nombre, setNombre] = useState(cliente?.nombre ?? '');
    const [email, setEmail]   = useState(cliente?.email ?? '');
    const [telefono, setTelefono] = useState(cliente?.telefono ?? '');
    const [showSuccess, setShowSuccess] = useState(false);

    const { mutate: create, isPending: isCreating, isError: createError } =
        useCreateCliente(onSuccess);
    const { mutate: update, isPending: isUpdating, isError: updateError } =
        useUpdateCliente(onSuccess);

    function onSuccess() {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setNombre(''); setEmail(''); setTelefono('');
        onCancel?.();
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = { nombre, email, telefono };
        if (isEditMode && cliente) {
            if (!window.confirm('¿Está seguro de editar este cliente?')) return;
            update({ id: cliente.id, payload });
        } else {
            create(payload);
        }
    };

    const isPending = isCreating || isUpdating;
    const error = createError || updateError;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
                {isEditMode ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>

            {showSuccess && (
                <div className="bg-green-100 text-green-700 p-2 rounded">
                    Cliente guardado correctamente.
                </div>
            )}
            <ErrorBanner error={error} fallback="Error al guardar el cliente" />

            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre
                </label>
                <input
                    id="nombre" type="text" required
                    value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email" type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono
                </label>
                <input
                    id="telefono" type="tel"
                    value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit" disabled={isPending}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {isPending ? 'Guardando…' : isEditMode ? 'Actualizar' : 'Crear'}
                </button>
                {isEditMode && (
                    <button
                        type="button" onClick={onCancel}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};
```

## 5. Crear la tabla (`src/components/ClientesTabla.tsx`)

```tsx
import { Pencil } from 'lucide-react';
import { useClientes } from '../hooks/useCliente';
import type { Cliente } from '../types/cliente.types';

interface Props {
    onEdit: (cliente: Cliente) => void;
}

export const ClientesTabla = ({ onEdit }: Props) => {
    const { data: clientes = [], isLoading } = useClientes();

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3} className="text-center py-6 text-gray-500">
                                Cargando...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Email</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Teléfono</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{c.nombre}</td>
                            <td className="px-4 py-2 hidden md:table-cell">{c.email}</td>
                            <td className="px-4 py-2 hidden md:table-cell">{c.telefono}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onEdit(c)}
                                    className="text-indigo-500 hover:text-indigo-700"
                                    aria-label="Editar"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

## 6. Crear la página (`src/pages/Clientes.tsx`)

```tsx
import { useState } from 'react';
import { ClienteForm } from '../components/ClienteForm';
import { ClientesTabla } from '../components/ClientesTabla';
import type { Cliente } from '../types/cliente.types';

const Clientes = () => {
    const [editingCliente, setEditingCliente] = useState<Cliente | undefined>();

    return (
        <div className="flex flex-col xl:flex-row gap-4">
            <div className="xl:w-1/3">
                <ClienteForm
                    key={editingCliente?.id ?? 'create'}
                    cliente={editingCliente}
                    onCancel={() => setEditingCliente(undefined)}
                />
            </div>
            <div className="xl:flex-1">
                <ClientesTabla onEdit={(c) => setEditingCliente(c)} />
            </div>
        </div>
    );
};

export default Clientes;
```

## 7. Registrar la ruta en `src/App.tsx`

```tsx
import Clientes from './pages/Clientes';

// dentro de <Routes>:
<Route
    path="/clientes"
    element={
        <ProtectedRoute>
            <MainLayout><Clientes/></MainLayout>
        </ProtectedRoute>
    }
/>
```

## 8. Añadir al sidebar (`src/layout/Sidebar.tsx`)

```tsx
import { UserPlus } from 'lucide-react';

// añadir al array de navItems:
{ to: '/clientes', label: 'Clientes', icon: UserPlus },
```

## 9. Verificar

```sh
npm run lint
npm run build
npm run dev
```

- Abre `http://localhost:5173/clientes`.
- Verifica que la tabla carga.
- Crea un cliente, verifica que aparece en la tabla.
- Edita, verifica que el form se rellena y la edición funciona.
- Revisa que `CategoriaForm` (y otros) sigue funcionando (no rompiste nada compartido).

## Checklist

- [ ] `src/types/cliente.types.ts` con `<Entity>`, `<Entity>Payload`, `<Entity>Response`.
- [ ] `src/services/cliente.service.ts` con `getAll`, `create`, `update`.
- [ ] `src/hooks/useCliente.ts` con `useClientes`, `useCreateCliente`, `useUpdateCliente`.
- [ ] `src/components/ClienteForm.tsx` con `useState`, banner de éxito/error, `key={editing?.id ?? 'create'}` desde la página.
- [ ] `src/components/ClientesTabla.tsx` con `isLoading` → "Cargando...", `onEdit` callback.
- [ ] `src/pages/Clientes.tsx` con `editingCliente` state y `<Form>` + `<Tabla>` side-by-side.
- [ ] Ruta añadida en `App.tsx` con `<ProtectedRoute><MainLayout>`.
- [ ] Link en `Sidebar.tsx` con icono de `lucide-react`.
- [ ] `npm run lint` pasa.
- [ ] `npm run build` pasa.
- [ ] Smoke test manual: crear, listar, editar, recargar.

## Variaciones

- **Sin update** (e.g. `Compras`, `Ventas`): no crear `useUpdate<Entity>`, no usar `key={editing?.id}`, usar tabs en la página.
- **Con líneas de detalle** (e.g. `Venta` con `detalles[]`): el form es compuesto, ver [`conventions/forms.md`](../conventions/forms.md#formularios-compuestos-compras--ventas).
- **Relación FK** (e.g. `Producto.id_categoria`): el form hace `useCategorias()` para popular el `<select>`. Compartir cache de TanStack Query.
