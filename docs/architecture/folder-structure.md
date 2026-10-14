# Arquitectura — Estructura de carpetas

La organización del proyecto es **por tipo de archivo** (no por *feature-sliced*). Cada carpeta agrupa un rol técnico, y los archivos se nombran con el sufijo del recurso al que pertenecen (e.g. `CategoriaForm.tsx`, `categoria.service.ts`, `useCategoria.ts`).

## Vista global

```
app-ventas-client/
├── AGENTS.md                      # convenciones de dev (scripts, stack)
├── Dockerfile                     # ⚠ ejecuta `npm run dev` (no producción)
├── eslint.config.js               # flat config
├── package.json
├── tsconfig.json                  # project references root
├── tsconfig.app.json              # strict para src/
├── tsconfig.node.json             # para vite.config.ts
├── vite.config.ts                 # @tailwindcss/vite + @vitejs/plugin-react
├── index.html
├── .env                           # VITE_APP_NAME / _VERSION / _API_URL
├── public/                        # assets estáticos (favicon.svg, icons.svg)
├── docs/                          # ← esta documentación
└── src/
    ├── main.tsx                   # entry: monta <App/> en <StrictMode>
    ├── App.tsx                    # composición de providers + rutas
    ├── index.css                  # @import "tailwindcss" + estilos base
    ├── vite-env.d.ts              # tipos de import.meta.env
    │
    ├── assets/
    │   ├── css/                   # VACÍA
    │   └── icons/                 # VACÍA
    │
    ├── components/                # piezas reutilizables y de dominio
    │   ├── ProtectedRoute.tsx     # guard para rutas autenticadas
    │   ├── GuestRoute.tsx         # guard para /login cuando ya hay sesión
    │   ├── SearchableSelect.tsx   # combobox genérico con modal (solo lo usa VentaForm)
    │   ├── CategoriaForm.tsx      # alta/baja de categorías
    │   ├── CategoriasTabla.tsx    # listado + edit dispatch
    │   ├── ProductoForm.tsx
    │   ├── ProductosTabla.tsx
    │   ├── ProveedorForm.tsx
    │   ├── ProveedoresTabla.tsx
    │   ├── CompraForm.tsx
    │   ├── ComprasTabla.tsx
    │   ├── VentaForm.tsx
    │   └── VentasTabla.tsx
    │
    ├── config/
    │   └── axios.ts               # singleton `Api` con interceptor de Authorization
    │
    ├── features/                  # VACÍA (reservada para futuro FSD)
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useCategoria.ts        # 3 hooks: useCategorias, useCreateCategoria, useUpdateCategoria
    │   ├── useProducto.ts         # 3 hooks
    │   ├── useProveedor.ts        # 3 hooks
    │   ├── useCompra.ts           # 2 hooks (sin update)
    │   └── useVenta.ts            # 2 hooks (sin update)
    │
    ├── layout/
    │   ├── MainLayout.tsx         # shell: header + sidebar + main + footer
    │   ├── Header.tsx             # logo + nombre + usuario + logout
    │   ├── Sidebar.tsx            # nav links con iconos lucide
    │   └── Footer.tsx             # "Desarrollado por" (placeholder)
    │
    ├── lib/                       # VACÍA
    │
    ├── pages/
    │   ├── Home.tsx               # placeholder: <h1>HOME PAGE</h1>
    │   ├── Login.tsx
    │   ├── Categorias.tsx
    │   ├── Productos.tsx
    │   ├── Proveedores.tsx
    │   ├── Compras.tsx            # usa tabs: Registrar / Listar
    │   └── Ventas.tsx             # usa tabs: Registrar / Listar
    │
    ├── providers/
    │   └── QueryProvider.tsx      # new QueryClient() (sin defaults)
    │
    ├── routes/                    # VACÍA
    │
    ├── services/
    │   ├── auth.service.ts
    │   ├── categoria.service.ts
    │   ├── producto.service.ts
    │   ├── proveedor.service.ts
    │   ├── compra.service.ts
    │   └── venta.service.ts
    │
    ├── stores/                    # VACÍA
    │
    ├── types/
    │   ├── auth.types.ts
    │   ├── categoria.types.ts
    │   ├── producto.types.ts      # incluye constante UNIDADES_MEDIDA (no usada)
    │   ├── proveedor.types.ts
    │   ├── compra.types.ts        # re-declara Proveedor + Producto (⚠ duplicación)
    │   └── venta.types.ts         # re-declara Producto + METODOS_PAGO, ESTADOS_VENTA
    │
    └── utils/
        └── storage.ts             # wrappers tipados de localStorage
```

## Intención de cada carpeta

| Carpeta | Intención | Estado |
|---|---|---|
| `src/main.tsx` | Entry point, monta React. | ✅ |
| `src/App.tsx` | Composition root (providers + router). | ✅ |
| `src/index.css` | Estilos globales y `@import "tailwindcss"`. | ✅ |
| `src/vite-env.d.ts` | Tipos de `import.meta.env`. | ✅ |
| `src/assets/` | Recursos locales (imágenes, CSS adicional, iconos). | 🟡 Vacía. Mover los SVGs de `public/` aquí si se importan desde código. |
| `src/components/` | Piezas reutilizables: guards, formularios, tablas, combobox. | ✅ |
| `src/config/` | Configuración de librerías externas (Axios). | ✅ |
| `src/features/` | **Reservada** para futura migración a *Feature-Sliced Design*. | ⚪ Vacía. No usar todavía. |
| `src/hooks/` | Hooks de React Query + side effects de auth. | ✅ |
| `src/layout/` | Shell visual que envuelve páginas autenticadas. | ✅ |
| `src/lib/` | **Reservada** para utilidades compartidas (formatters, `cn()`, etc.). | ⚪ Vacía. |
| `src/pages/` | Páginas de la app. | ✅ |
| `src/providers/` | Providers de React. | ✅ (solo Query). |
| `src/routes/` | **Reservada** para configuración central de rutas. | ⚪ Vacía. Hoy las rutas viven en `App.tsx`. |
| `src/services/` | Funciones puras que llaman Axios. | ✅ |
| `src/stores/` | **Reservada** para state store global (Zustand/Redux). | ⚪ Vacía. No se necesita hoy. |
| `src/types/` | Tipos del dominio y constantes de UI. | ✅ |
| `src/utils/` | Utilidades genéricas sin React (storage, formatters, etc.). | ✅ |

## Convenciones de nombres

- **Componentes:** `PascalCase.tsx` con sufijo de rol (`CategoriaForm`, `CategoriasTabla`, `ProtectedRoute`).
- **Hooks:** `camelCase.ts` con prefijo `use` y nombre del recurso (`useCategoria.ts`, `useAuth.ts`).
- **Services:** `kebab-case.service.ts` con el nombre del recurso (`categoria.service.ts`).
- **Types:** `kebab-case.types.ts` con el nombre del recurso (`compra.types.ts`).
- **Páginas:** `PascalCase.tsx`, una por ruta (`Categorias.tsx` ↔ `/categorias`).
- **Layout:** `PascalCase.tsx` (`Header`, `Sidebar`, `MainLayout`).

Más detalle en [`conventions/naming-and-types.md`](../conventions/naming-and-types.md).

## Carpetas vacías — qué hacer

- **`features/`**: no usar todavía. Si en el futuro se migra a FSD, primero definir el criterio de "feature" (¿por recurso? ¿por bounded context?). Hoy provocaría preguntas sin respuesta.
- **`lib/`**: mover aquí utilidades compartidas (e.g. `cn`, `formatCurrency`, `getApiErrorMessage`).
- **`routes/`**: cuando se decida centralizar las rutas (recomendado: mover a `createBrowserRouter` con `routes.tsx`), poblar aquí.
- **`stores/`**: solo poblar si aparece estado de cliente que no sea UI efímera. Hoy la app no lo necesita.

## Archivos que no encajan en ninguna carpeta

- `vite-env.d.ts`: redeclara `ImportMetaEnv` para añadir las claves `VITE_APP_*`. Se ubica en `src/` por convención de Vite.

## Duplicación conocida

- `Producto` está declarado en `producto.types.ts` **y re-declarado** en `compra.types.ts` y `venta.types.ts`. Misma situación con `Proveedor` en `compra.types.ts`. La forma correcta es importar desde los archivos originales. Ver [`conventions/naming-and-types.md`](../conventions/naming-and-types.md).
- Los `*Form` de Categoría/Producto/Proveedor comparten gran parte de su shell. Ver [`conventions/forms.md`](../conventions/forms.md) para la propuesta de un `<EntityFormShell>`.
- Los `*Tabla` también son casi idénticos. Ver [`conventions/tables.md`](../conventions/tables.md).
