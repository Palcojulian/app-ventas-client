# `app-ventas-client` — Documentación

Frontend del sistema de ventas e inventario **app-ventas**. Construido con React 19 + TypeScript + Vite, Tailwind v4, TanStack Query y Axios contra un backend HTTP en `http://127.0.0.1:8000`.

Esta carpeta describe la **arquitectura**, las **convenciones de implementación** y los **procedimientos operativos** del proyecto. Está escrita en español para mantener consistencia con el dominio (`id_proveedor`, `numero_factura`, `metodo_pago`, etc.).

---

## Índice

### Arquitectura

- [`architecture/overview.md`](./architecture/overview.md) — Visión general del sistema, capas y flujo de datos.
- [`architecture/folder-structure.md`](./architecture/folder-structure.md) — Estructura de `src/`: intención vs. contenido real de cada carpeta.
- [`architecture/routing.md`](./architecture/routing.md) — Modelo de rutas, `ProtectedRoute` y `GuestRoute`.
- [`architecture/state-and-data-fetching.md`](./architecture/state-and-data-fetching.md) — TanStack Query, claves, mutaciones e invalidaciones.
- [`architecture/authentication.md`](./architecture/authentication.md) — Tokens, `useAuth`, `axios` interceptor, guards.
- [`architecture/api-client.md`](./architecture/api-client.md) — Singleton de Axios, `baseURL`, endpoints consumidos.

### Convenciones

- [`conventions/forms.md`](./conventions/forms.md) — Patrón de formularios con `useState`, `key={editing?.id}`, campos deshabilitados en edición.
- [`conventions/tables.md`](./conventions/tables.md) — Patrón de `*Tabla`, `isLoading`, estado vacío, callback `onEdit`.
- [`conventions/naming-and-types.md`](./conventions/naming-and-types.md) — Convenciones de nombres y forma de los tipos (`<Entity>`, `<Entity>Payload`, `<Entity>Response`).
- [`conventions/error-handling.md`](./conventions/error-handling.md) — Manejo de `AxiosError` y helper `getApiErrorMessage`.
- [`conventions/styling.md`](./conventions/styling.md) — Tailwind v4, paleta, gotcha de `user-select: none`.
- [`conventions/icons.md`](./conventions/icons.md) — Uso de `lucide-react`, iconos empleados.

### Desarrollo

- [`development/environment.md`](./development/environment.md) — Variables de entorno (`.env`, `VITE_APP_*`).
- [`development/scripts.md`](./development/scripts.md) — `npm run dev / build / lint / preview`.
- [`development/typescript.md`](./development/typescript.md) — Project references, flags estrictos, `verbatimModuleSyntax`.
- [`development/adding-a-new-entity.md`](./development/adding-a-new-entity.md) — Paso a paso: tipos → servicio → hook → formulario → tabla → página → ruta.
- [`development/docker.md`](./development/docker.md) — `Dockerfile` actual, advertencias y propuesta de producción.

### Operaciones

- [`operations/troubleshooting.md`](./operations/troubleshooting.md) — Gotchas conocidos: versiones bleeding-edge, `user-select`, `Home` placeholder, etc.
- [`operations/release-checklist.md`](./operations/release-checklist.md) — Checklist antes de hacer merge a `main`: typecheck, lint, build, smoke tests.

---

## Resumen del proyecto en una página

- **Dominio:** CRUD de `Categorías`, `Proveedores`, `Productos`, `Compras`, `Ventas` + autenticación JWT.
- **Organización:** por **tipo de archivo** (`components/`, `hooks/`, `services/`, `pages/`, `types/`, `layout/`, `utils/`, `providers/`, `config/`). Las carpetas `features/`, `lib/`, `stores/` y `routes/` están reservadas y actualmente vacías.
- **Estado del servidor:** TanStack Query v5 con claves string (`['<entity>']`).
- **Estado local:** `useState` puro (sin `react-hook-form` ni Zustand).
- **Auth:** bearer token en `localStorage` (`token-user`, `auth-user`), `ProtectedRoute`/`GuestRoute` síncronos.
- **HTTP:** un único `axios.create()` en `config/axios.ts` con interceptor que re-lee el token por request.
- **Estilos:** Tailwind v4 vía `@tailwindcss/vite` (sin PostCSS), clases utilitarias en componentes.
- **Rutas:** declaradas inline en `App.tsx` (sin `routes.ts`).
- **Build:** Vite + TypeScript con project references (`tsconfig.app.json` + `tsconfig.node.json`).
- **Despliegue:** `Dockerfile` ejecuta `npm run dev` (no es una imagen de producción — ver [`development/docker.md`](./development/docker.md)).

Para una visión más profunda, comienza por [`architecture/overview.md`](./architecture/overview.md).
