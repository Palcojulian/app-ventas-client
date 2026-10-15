# Arquitectura — Visión general

`app-ventas-client` es un **SPA monolítico de capa fina** sobre un backend HTTP REST. No hay SSR, no hay enrutamiento con `createBrowserRouter`, no hay state store global. Toda la inteligencia de UI se reparte entre React (estado local) y TanStack Query (estado del servidor).

## Diagrama de capas

```
┌─────────────────────────────────────────────────────────────┐
│  main.tsx                                                   │
│  └── <QueryProvider>          (TanStack Query)              │
│       └── <BrowserRouter>     (React Router v7)             │
│            └── <Routes>                                  │
│                 ├── /login        → <GuestRoute>            │
│                 └── /<resto>      → <ProtectedRoute>        │
│                      └── <MainLayout>                      │
│                           └── <Page>      (pages/*)         │
│                                ├── <Entity>Form            │
│                                │     └── use<Entity>…      │
│                                │           └── <entity>     │
│                                │                .service   │
│                                │                     └── Api│
│                                │                          (ax│
│                                │                          ios│
│                                │                          sin│
│                                │                          gle│
│                                │                          ton)│
│                                └── <Entity>Tabla            │
│                                      └── use<Entity>s()     │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de datos (request)

```
1. Page monta <Entity>Form / <Entity>Tabla
2. El componente llama un hook (useProductos, useCreateCategoria, …)
3. El hook usa TanStack Query (useQuery / useMutation)
4. La queryFn invoca el service (<entity>.service.ts)
5. El service llama al singleton Api (config/axios.ts)
6. Api añade Authorization: Bearer <token> mediante interceptor
7. Backend procesa y responde
8. El hook entrega la respuesta a TanStack Query
9. El componente re-renderiza con la data / el error
```

## Flujo de datos (mutación)

```
1. Usuario completa <Entity>Form y hace submit
2. El componente llama useCreate<Entity>().mutate(payload)
3. onSuccess del hook hace:
   a. invalidar queryClient.invalidateQueries(['<entity>'])
   b. callback (mostrar banner verde, resetear form, etc.)
4. La tabla se vuelve a renderizar con datos frescos
```

## Capas y responsabilidades

| Capa | Carpeta | Responsabilidad | No debe… |
|---|---|---|---|
| **Page** | `src/pages/` | Componer Form + Tabla, poseer el estado de edición (`editing<Entity>`), decidir tabs (Compras/Ventas). | Hacer fetch directo ni manejar errores de Axios. |
| **Component** | `src/components/` | Renderizar UI, mantener estado local del formulario, llamar hooks, mostrar banners de éxito/error. | Conocer Axios ni las rutas HTTP. |
| **Hook** | `src/hooks/` | Envolver TanStack Query (`useQuery` / `useMutation`), invalidar queries en `onSuccess`, side-effects de auth. | Renderizar UI ni manejar formularios. |
| **Service** | `src/services/` | Funciones puras que llaman `Api` con un verbo HTTP. Una función por endpoint. | Usar React ni mantener estado. |
| **Config** | `src/config/` | Singleton de Axios con `baseURL` e interceptor de request. | Contener lógica de negocio. |
| **Provider** | `src/providers/` | Composition root de TanStack Query. | Contener estado de negocio. |
| **Types** | `src/types/` | Definir formas del dominio (`<Entity>`, `<Entity>Payload`, `<Entity>Response`) y constantes de UI. | Contener lógica. |
| **Utils** | `src/utils/` | Wrappers tipados de `localStorage`. | Depender de React. |

## Principios rectores

1. **Hooks como única fuente de fetch.** Los componentes nunca importan `services/*` directamente. Esto facilita testing (mockear hooks) y separa concerns.
2. **Service devuelve `data` ya extraído.** El componente nunca recibe el wrapper `{ data, status, headers, … }` de Axios.
3. **Tokens en `localStorage`, leídos por el interceptor de Axios por request.** Ver [`architecture/authentication.md`](./authentication.md).
4. **Sin state store global.** TanStack Query cubre estado del servidor; `useState` cubre estado local de UI.
5. **Componentes presentacionales + stateful livianos.** Los forms son la unidad de estado más compleja permitida.
6. **Tipos por recurso, no por endpoint.** `<Entity>`, `<Entity>Payload`, `<Entity>Response` se definen una vez en `types/<entity>.types.ts` y se importan desde hooks, services y components.

## Lo que **no** hace esta arquitectura

- No usa **React Router Data APIs** (`loader`, `action`); se queda en la API declarativa clásica de `<Routes>`/`<Route element>`.
- No usa **Server Components** ni SSR.
- No usa **state store global** (Zustand/Redux). Auth vive en `localStorage` y se lee directamente.
- No usa **form library** (react-hook-form, Formik). Formularios con `useState` puro.
- No usa **validation library** (Zod, Yup). Solo `required` y `maxLength` nativos.
- No usa **toast library**. Banners inline con `setTimeout(3000)`.
- No usa **i18n**. Toda la UI está en español.

## Punto de entrada

`src/main.tsx` monta `<App />` dentro de `<StrictMode>`. `App` compone el árbol de providers y rutas:

```tsx
<QueryProvider>
  <BrowserRouter>
    <Routes>…</Routes>
  </BrowserRouter>
</QueryProvider>
```

`QueryProvider` está **fuera** del `BrowserRouter` a propósito: TanStack Query no necesita el contexto de Router y mantiene su client accesible desde cualquier parte.

---

## Próximos pasos

- Detalle de la estructura de carpetas: [`folder-structure.md`](./folder-structure.md).
- Cómo se enruta la app: [`routing.md`](./routing.md).
- Cómo se gestiona el estado del servidor: [`state-and-data-fetching.md`](./state-and-data-fetching.md).
- Cómo se autentican los usuarios: [`authentication.md`](./authentication.md).
- Cómo se configura el cliente HTTP: [`api-client.md`](./api-client.md).
