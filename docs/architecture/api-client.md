# Arquitectura — Cliente HTTP (Axios)

Existe **una sola instancia de Axios** en toda la app: `Api`, definida en `src/config/axios.ts`. Todos los services la importan y la usan directamente. No hay factories, no hay múltiples instancias, no hay re-creación.

## Definición

```ts
// src/config/axios.ts
import axios from 'axios';
import { getData } from '../utils/storage';

const Api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

Api.interceptors.request.use((config) => {
    const token = getData<string>('token-user');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api;
```

### Notas

- **`baseURL` viene de `import.meta.env.VITE_APP_API_URL`**, que se resuelve a `http://127.0.0.1:8000` por defecto. Ver [`development/environment.md`](../development/environment.md).
- El interceptor **re-lee el token en cada request** desde `localStorage`. Es lo correcto: el token puede aparecer (login) o desaparecer (logout) en cualquier momento.
- **No hay interceptor de respuesta.** 401s no se manejan globalmente. Ver [`architecture/authentication.md`](./authentication.md).

## Services

Cada recurso tiene un archivo `src/services/<recurso>.service.ts` con **funciones puras** que devuelven `data` ya extraído de la respuesta de Axios.

### `auth.service.ts`

```ts
import Api from '../config/axios';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await Api.post<LoginResponse>('/api/auth/login', payload);
        return data;
    },
    logout: async (): Promise<void> => {
        await Api.post('/api/auth/logout');
    },
};
```

### `categoria.service.ts` (paradigma CRUD)

```ts
export const categoriaService = {
    getAll: async (): Promise<Categoria[]> => {
        const { data } = await Api.get<{ data: Categoria[] }>('/api/categorias');
        return data.data;          // ← doble `.data` por la envoltura del backend
    },
    create: async (payload: CategoriaPayload): Promise<CategoriaResponse> => {
        const { data } = await Api.post<{ data: CategoriaResponse }>('/api/categorias', payload);
        return data.data;
    },
    update: async (id: number, payload: CategoriaPayload): Promise<CategoriaResponse> => {
        const { data } = await Api.put<{ data: CategoriaResponse }>(`/api/categorias/${id}`, payload);
        return data.data;
    },
};
```

### Otros services

`producto.service.ts`, `proveedor.service.ts`, `compra.service.ts` y `venta.service.ts` siguen el mismo patrón. `compra` y `venta` solo tienen `getAll` y `create` (no hay update/delete).

## Endpoints consumidos

| Recurso | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| Auth | — | `/api/auth/login`, `/api/auth/logout` | — | — |
| Categorías | `/api/categorias` | `/api/categorias` | `/api/categorias/:id` | — |
| Proveedores | `/api/proveedores` | `/api/proveedores` | `/api/proveedores/:id` | — |
| Productos | `/api/productos` | `/api/productos` | `/api/productos/:id` | — |
| Compras | `/api/compras` | `/api/compras` | — | — |
| Ventas | `/api/ventas` | `/api/ventas` | — | — |

⚠ **No hay endpoints de DELETE** en ningún recurso. Si se necesita borrado lógico, hay que añadir el verbo y la ruta.

## Forma de la respuesta del backend

El backend (Laravel-style) envuelve cada respuesta en `{ success, data, message? }`. El service hace el doble unwrap:

```ts
const { data } = await Api.get<{ data: Categoria[] }>('/api/categorias');
//        ^^^^^^^^^ envelope de axios               ^^^^^^^^^ envelope del backend
return data.data;
```

**Decisión de diseño:** se mantiene el doble unwrap explícito. Alternativa: configurar un interceptor de respuesta que haga `return response.data.data` y simplificar los services. La forma actual es más explícita pero repetitiva.

## Tipado de errores

Los services **no tipan errores**. `mutationFn: (payload) => service.create(payload)` devuelve `Promise<CategoriaResponse>`, pero la mutación de TanStack Query recibe `error: unknown` por defecto. Los forms hacen un cast inline:

```ts
const message = (createError as { response?: { data?: { message?: string } } })
    ?.response?.data?.message ?? 'Error';
```

Mejora propuesta: tipar la mutación con `useMutation<CategoriaResponse, AxiosError<{ message?: string }>, CategoriaPayload>`. Ver [`conventions/error-handling.md`](../conventions/error-handling.md).

## Buenas prácticas respetadas

- ✅ Una sola instancia.
- ✅ `baseURL` desde variable de entorno.
- ✅ Interceptor de request para auth header.
- ✅ Services sin estado, funciones puras.
- ✅ Tipos de retorno explícitos.

## Anti-patrones / mejoras

- ❌ **No hay interceptor de respuesta** → 401s no se manejan globalmente.
- ❌ **No hay cancelación de requests** con `AbortController` al desmontar componentes. Riesgo bajo en esta app (no hay fetches costosos), pero es una mejora si se añaden vistas con polling.
- ❌ **No hay reintento** (`axios-retry` o `useQuery.retry`).
- ❌ **No hay timeout global**. `axios.defaults.timeout` está sin definir.
- ❌ **No hay logging de requests** en dev. Útil para debug.
- ❌ **El prefijo `/api` está hardcodeado** en cada service. Si cambia, hay que tocar 6 archivos. Mejora: añadirlo al `baseURL` o a una constante.

## Cómo añadir un endpoint nuevo

1. Añadir el tipo de payload y respuesta en `src/types/<recurso>.types.ts`.
2. Añadir la función en `src/services/<recurso>.service.ts`.
3. Si es GET: crear (o reusar) el hook de listado.
4. Si es POST/PUT/DELETE: crear (o ampliar) el hook de mutación, e invalidar las queries correspondientes en `onSuccess`.
5. Usar el hook en el componente.

Ver paso a paso completo en [`development/adding-a-new-entity.md`](../development/adding-a-new-entity.md).
