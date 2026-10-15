# Arquitectura — Ruteo

El proyecto usa la **API declarativa clásica** de React Router v7 (`<BrowserRouter>` + `<Routes>` + `<Route element>`), no las *Data Router APIs* (`createBrowserRouter`, `loader`, `action`). Todas las rutas están declaradas **inline en `src/App.tsx`**; no existe un archivo `routes.ts` central.

## Declaración actual

```tsx
// src/App.tsx (extracto)
<QueryProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={
        <GuestRoute><Login/></GuestRoute>
      }/>

      <Route path="/inicio" element={
        <ProtectedRoute>
          <MainLayout><Home/></MainLayout>
        </ProtectedRoute>
      }/>

      <Route path="/categorias" element={
        <ProtectedRoute>
          <MainLayout><Categorias/></MainLayout>
        </ProtectedRoute>
      }/>
      {/* … proveedores, productos, compras, ventas … */}

      <Route path="*" element={<Navigate to="/inicio" replace />}/>
    </Routes>
  </BrowserRouter>
</QueryProvider>
```

## Mapa de rutas

| Path | Guard | Layout | Página | Notas |
|---|---|---|---|---|
| `/login` | `<GuestRoute>` | — | `<Login/>` | Si ya hay sesión, redirige a `/inicio`. |
| `/inicio` | `<ProtectedRoute>` | `<MainLayout>` | `<Home/>` | ⚠ Placeholder (`<h1>HOME PAGE</h1>`). |
| `/categorias` | `<ProtectedRoute>` | `<MainLayout>` | `<Categorias/>` | |
| `/proveedores` | `<ProtectedRoute>` | `<MainLayout>` | `<Proveedores/>` | |
| `/productos` | `<ProtectedRoute>` | `<MainLayout>` | `<Productos/>` | |
| `/compras` | `<ProtectedRoute>` | `<MainLayout>` | `<Compras/>` | Usa tabs internas `Registrar` / `Listar`. |
| `/ventas` | `<ProtectedRoute>` | `<MainLayout>` | `<Ventas/>` | Usa tabs internas `Registrar` / `Listar`. |
| `*` | — | — | `<Navigate to="/inicio" replace/>` | Catch-all. |

## Guards

### `<ProtectedRoute>` (`src/components/ProtectedRoute.tsx`)

Wrap de cualquier página que requiera sesión activa.

```tsx
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!getData<string>('token-user')) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};
```

**Tipo de verificación:** síncrona, basada en `localStorage.getItem('token-user')`. No hay decodificación ni validación de expiración del JWT. La protección real contra token expirado vive en el backend y se manifestaría como un 401 — ver [`architecture/authentication.md`](./authentication.md).

### `<GuestRoute>` (`src/components/GuestRoute.tsx`)

Inverso: bloquea `/login` si ya hay sesión activa (evita que un usuario autenticado vuelva al login).

```tsx
export const GuestRoute = ({ children }: { children: ReactNode }) => {
    if (getData<string>('token-user')) {
        return <Navigate to="/inicio" replace />;
    }
    return <>{children}</>;
};
```

## Layout

`<MainLayout>` envuelve **todas** las rutas autenticadas. Renderiza `<Header>` + `<Sidebar>` + `<main>{children}</main>` + `<Footer>`. La página es el único `children` del layout.

```tsx
// src/layout/MainLayout.tsx
<div className="flex flex-col min-h-screen bg-gray-50">
  <Header />
  <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
  <Footer />
</div>
```

## Asimetrías conocidas

1. **Ruta raíz inexistente.** No hay `<Route path="/" …/>`. Cualquier navegación a `/` cae en el catch-all y termina en `/inicio`.
2. **`/inicio` y no `/` o `/dashboard`.** El sidebar muestra "Dashboard" como label pero la ruta es `/inicio`. Cosmetico, pero confunde.
3. **El catch-all redirige a `/inicio`**, no a `/login`. Si un usuario sin sesión intenta una ruta protegida, el guard lo redirige a `/login`; si llega al catch-all es porque entró a una ruta desconocida **estando autenticado**, por eso `/inicio` tiene sentido.
4. **Sin 404 real.** No existe un componente "NotFound". Las URLs inválidas redirigen silenciosamente a `/inicio`.

## Lo que no se usa (deliberadamente)

- `createBrowserRouter` + `loader`/`action` (Data Router API).
- Rutas anidadas (`<Outlet/>`). Cada ruta repite `<ProtectedRoute><MainLayout>…</MainLayout></ProtectedRoute>`.
- `React.lazy` + `<Suspense>` para code-splitting.
- `useParams` / `useSearchParams` (no hay rutas dinámicas).
- `useNavigate` con state complejo.

## Cómo añadir una nueva ruta

1. Crear la página en `src/pages/<Nombre>.tsx`.
2. Importar en `src/App.tsx`.
3. Añadir `<Route>` dentro de `<Routes>`:
   ```tsx
   <Route path="/<path>" element={
     <ProtectedRoute>
       <MainLayout><Nombre/></MainLayout>
     </ProtectedRoute>
   }/>
   ```
4. Si la página debe aparecer en el sidebar, añadir el link en `src/layout/Sidebar.tsx`.
5. Si necesita ícono, importarlo de `lucide-react`. Ver [`conventions/icons.md`](../conventions/icons.md).

## Mejora recomendada

Migrar a `createBrowserRouter` con un `<RootLayout>` que anide todas las rutas autenticadas:

```tsx
// futuro: src/routes/index.tsx
const router = createBrowserRouter([
  { path: '/login', element: <GuestRoute><Login/></GuestRoute> },
  {
    element: <ProtectedRoute><MainLayout/></ProtectedRoute>,  // outlet
    children: [
      { path: '/inicio', element: <Home/> },
      { path: '/categorias', element: <Categorias/> },
      // …
    ],
  },
  { path: '*', element: <Navigate to="/inicio" replace/> },
]);
```

Esto eliminaría la repetición de `<ProtectedRoute><MainLayout>…</MainLayout></ProtectedRoute>` y permitiría lazy loading con `lazy: () => import('./pages/Categorias')`.

> Documentado como mejora. No aplicar sin acuerdo del equipo.
