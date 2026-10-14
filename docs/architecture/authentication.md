# Arquitectura — Autenticación

La app usa autenticación **básica con bearer token JWT** (o cualquier string opaco) almacenado en `localStorage`. No hay refresh token, no hay cookies `httpOnly`, no hay decodificación del JWT en cliente.

## Almacenamiento

`src/utils/storage.ts` define wrappers tipados de `localStorage`:

```ts
export const getData = <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    try { return JSON.parse(value) as T; }
    catch { return value as T; }  // permite tokens (string plano)
};

export const saveData = (key: string, data: unknown) => {
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    localStorage.setItem(key, value);
};

export const destroyData = (key: string) => localStorage.removeItem(key);
export const destroyAllData = () => localStorage.clear();
```

### Claves usadas

| Clave | Tipo | Contenido | Quién lo lee |
|---|---|---|---|
| `token-user` | `string` (token plano) | El bearer token. | `axios` interceptor, `<ProtectedRoute>`, `<GuestRoute>`. |
| `auth-user` | `User` (objeto) | Datos del usuario autenticado. | `Header.tsx`, `VentaForm.tsx`. |

⚠ **`destroyAllData()` borra todas las claves** de `localStorage`. Se usa en logout pero **borraría también cualquier futuro dato no-auth**. Hoy no hay otros datos, pero es una trampa a futuro. Ver [`operations/troubleshooting.md`](../operations/troubleshooting.md).

## Hook `useAuth` (`src/hooks/useAuth.ts`)

```ts
export const useAuth = () => {
    const navigate = useNavigate();

    const login = useMutation({
        mutationFn: (creds: LoginPayload) => authService.login(creds),
        onSuccess: (response) => {
            saveData('auth-user', response.user);
            saveData('token-user', response.token);
            navigate('/inicio', { replace: true });
        },
    });

    const logout = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            destroyData('auth-user');
            destroyData('token-user');
            destroyAllData();           // ⚠ ver nota arriba
            navigate('/login', { replace: true });
        },
    });

    return { login, logout };
};
```

El hook **no expone `user` ni `isAuthenticated`**: el consumidor tiene que leer `getData<User>('auth-user')` y `getData<string>('token-user')` por su cuenta. Es una decisión deliberada para mantener el hook simple, pero acopla los componentes al storage. Mejora propuesta: centralizar en `useAuth().user`.

## Flujo de login

```
<Login/> captura email/password
    └── useAuth().login.mutate({ email, password })
            └── authService.login() → POST /api/auth/login
                    └── Api (axios) → backend
                            └── 200 { user, token }
                                    └── onSuccess:
                                        ├── saveData('auth-user', user)
                                        ├── saveData('token-user', token)
                                        └── navigate('/inicio', { replace: true })
```

`Login.tsx` solo lee `isLoading` para deshabilitar el botón y `isError` para mostrar un mensaje hardcodeado: **"Credenciales inválidas"**. El mensaje real del backend no se muestra al usuario. Mejora: extraer el mensaje con `getApiErrorMessage(error)`.

## Flujo de logout

```
<Header> "logout" click
    └── useAuth().logout.mutate()
            └── authService.logout() → POST /api/auth/logout
                    └── onSuccess:
                        ├── destroyData('auth-user')
                        ├── destroyData('token-user')
                        ├── destroyAllData()
                        └── navigate('/login', { replace: true })
```

El `replace: true` evita que el botón "atrás" del navegador devuelva al usuario a una página autenticada.

## Guards de ruta

`<ProtectedRoute>` y `<GuestRoute>` son **síncronos** y leen `localStorage` directamente:

```tsx
// ProtectedRoute
if (!getData<string>('token-user')) {
    return <Navigate to="/login" replace />;
}

// GuestRoute
if (getData<string>('token-user')) {
    return <Navigate to="/inicio" replace />;
}
```

**No validan el token** (no decodifican, no verifican expiración, no hacen ping al backend). Si un token expirado queda en `localStorage`, el guard lo considera válido y la app entrará en bucle de carga (ver problema 401 abajo).

## Axios interceptor

`src/config/axios.ts` configura la instancia única:

```ts
const Api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

Api.interceptors.request.use((config) => {
    const token = getData<string>('token-user');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.baseURL = import.meta.env.VITE_APP_API_URL;  // re-evaluado por si cambió en runtime
    return config;
});

export default Api;
```

**Por qué el interceptor y no solo el constructor:** el header `Authorization` del constructor se evalúa **una vez** al crear la instancia. Si el usuario no está logado al inicio, el header es `Bearer null` y queda fijo para siempre. El interceptor re-lee `localStorage` **en cada request**, garantizando que el token actual se use.

## Manejo de 401 — **ausente**

El proyecto **no** tiene interceptor de respuesta. Si el backend devuelve `401 Token expired`, el componente lo recibe como un error genérico:

- Las tablas se quedan en `isLoading: false` con `data: undefined` → no renderizan filas ni error.
- Los forms muestran un banner rojo genérico.

**Mejora obligatoria:** añadir un interceptor de respuesta que, ante 401, ejecute el logout:

```ts
Api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            destroyData('token-user');
            destroyData('auth-user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);
```

## Endpoints de auth consumidos

| Método | Path | Body | Respuesta |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ email, password }` | `{ user: User, token: string }` |
| `POST` | `/api/auth/logout` | — | `void` o `{ success: true }` |

Ver [`architecture/api-client.md`](./api-client.md) para el resto de endpoints.

## Tipos

`src/types/auth.types.ts`:

```ts
export interface User {
    id: number;
    nombre: string;
    email: string;
    // …campos adicionales según el backend
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}
```

## Decisiones de diseño — quéDate cuenta

1. **`localStorage` vs. cookie httpOnly**: se eligió `localStorage` por simplicidad. La consecuencia es que el token es accesible desde cualquier script de la página (vulnerable a XSS). Si el riesgo es aceptable (intranet, app de confianza), está bien; si no, mover a cookie httpOnly.
2. **Sin refresh token**: el token caduca y el usuario debe re-loguear. No hay flujo de "renew".
3. **Sin decodificación local**: el cliente no sabe cuándo expira el token. El backend es la única fuente de verdad.
4. **Sin CSRF**: irrelevante porque la auth es por header `Authorization`, no por cookie automática.
5. **`destroyAllData()` en logout**: blanket clear. Aceptable hoy; problemático si se añaden otras claves.
