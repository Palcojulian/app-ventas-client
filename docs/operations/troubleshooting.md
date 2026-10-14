# Operaciones — Troubleshooting

Listado de problemas conocidos, con causa raíz y solución propuesta. Organizado por severidad.

## 🔴 Críticos (bloquean `npm install` o el build)

### 1. `lucide-react: ^1.14.0` no existe en el registro público

**Síntoma:** `npm install` falla con `404 Not Found` para `lucide-react@1.14.0`.

**Causa:** la línea real de `lucide-react` es `0.x` (e.g. `0.460.0`). El `1.14.0` declarado en `package.json` parece un typo.

**Solución:**
```sh
npm install lucide-react@^0.460.0
```

Verificar la última versión estable en [npmjs.com/package/lucide-react](https://www.npmjs.com/package/lucide-react).

**Si el equipo usa un registry privado** con un fork interno, entonces el `1.14.0` es válido; en ese caso, configurar el registry en `.npmrc` y documentarlo en [`development/environment.md`](../development/environment.md).

### 2. `typescript: ~6.0.2` no existe

**Síntoma:** `npm install` falla o TypeScript no se instala.

**Causa:** TypeScript 6 no está publicado; la línea estable es `5.x`.

**Solución:**
```sh
npm install -D typescript@~5.6.2
```

**Acción similar para:**
- `vite: ^8.0.10` → `^5.4.x` o `^6.0.x`
- `eslint: ^10.2.1` → `^9.x`
- `@eslint/js: ^10.0.1` → `^9.x`
- `@types/node: ^24.12.2` → `^22.x` (compatible con Node 20/22 LTS)

⚠ **Antes de cambiar versiones:** verificar que las nuevas versiones sean compatibles con `@vitejs/plugin-react`, `typescript-eslint`, etc.

### 3. Falta `.dockerignore`

**Síntoma:** la imagen Docker incluye `.env`, `.git`, `node_modules` → imagen de >500 MB con secretos filtrados.

**Causa:** no existe `.dockerignore` en la raíz.

**Solución:** crear `.dockerignore` con el contenido listado en [`development/docker.md`](../development/docker.md).

### 4. El `Dockerfile` corre el dev server

**Síntoma:** la "imagen de producción" expone HMR, source maps, código no minificado.

**Causa:** `CMD ["npm", "run", "dev", "--", "--host"]`.

**Solución:** renombrar a `Dockerfile.dev` y crear `Dockerfile.prod` con multi-stage + nginx. Ver [`development/docker.md`](../development/docker.md).

## 🟠 Importantes (afectan UX o correctness)

### 5. `useCreateCompra` no invalida `['productos']`

**Síntoma:** tras crear una compra, el stock del producto no se refleja en `ProductoForm` o en `ProductosTabla` hasta recargar la página.

**Causa:** el `onSuccess` de `useCreateCompra` solo invalida `['compras']`. `useCreateVenta` sí invalida `['productos']` (porque una venta también afecta el stock).

**Solución:** añadir al `onSuccess` de `useCreateCompra`:
```ts
queryClient.invalidateQueries({ queryKey: ['productos'] });
```

### 6. `destroyAllData()` en logout

**Síntoma:** si en el futuro se añaden otras claves a `localStorage`, el logout las borra todas.

**Causa:** `useAuth().logout` llama `destroyData('auth-user')` + `destroyData('token-user')` + `destroyAllData()`.

**Solución:** eliminar `destroyAllData()` y dejar solo los dos `destroyData` específicos:
```ts
destroyData('auth-user');
destroyData('token-user');
```

### 7. No hay interceptor de 401

**Síntoma:** si el token expira, las queries fallan silenciosamente. Las tablas se quedan vacías, los forms muestran error genérico.

**Causa:** no hay `Api.interceptors.response.use(...)`.

**Solución:** añadir interceptor en `src/config/axios.ts`:
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

### 8. `VentaForm` asigna `id_cliente = user?.id`

**Síntoma:** el cliente de la venta es siempre el usuario logado. No hay forma de vender a otro cliente.

**Causa:** placeholder o bug. El form no tiene selector de cliente.

**Solución:** añadir un `useClientes()` + `<select>` o `<SearchableSelect>` para `id_cliente`. Ver [`development/adding-a-new-entity.md`](../development/adding-a-new-entity.md) para un ejemplo de Select con datos de otra entidad.

### 9. `user-select: none` global impide copiar texto

**Síntoma:** el usuario no puede copiar emails de proveedores, números de factura, etc.

**Causa:** `src/index.css` aplica `user-select: none` a `html, body, #root`.

**Solución:** quitar la regla global y aplicarla solo a elementos no-textuales (botones, nav, header):
```css
html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
}

button, nav, header {
    user-select: none;
}
```

### 10. `Home.tsx` es un placeholder

**Síntoma:** la ruta `/inicio` renderiza solo `<h1>HOME PAGE</h1>`.

**Causa:** nunca se implementó el dashboard.

**Solución:** o bien (a) implementar widgets de resumen (total de ventas del día, productos con stock bajo, etc.) o (b) eliminar la ruta y el link del sidebar hasta tener contenido.

### 11. Headings con estilos globales afectan contenido

**Síntoma:** cualquier `<h1>`-`<h6>` en la app queda en `text-gray-700 font-bold/semibold/medium`, sin aviso. Si un día se quiere un título grande de otro color, hay que sobrescribir.

**Causa:** `@layer base` en `index.css` aplica `@apply` a los headings.

**Solución:** eliminar el bloque de headings de `index.css` y aplicar clases explícitas donde se quiera estilo, o crear componentes `<PageTitle>`, `<SectionTitle>`.

### 12. Asimetría de rutas (`/inicio` vs. `/dashboard`)

**Síntoma:** el sidebar dice "Dashboard" pero la URL es `/inicio`. El catch-all redirige a `/inicio` también.

**Causa:** naming inconsistente.

**Solución:** renombrar la ruta a `/dashboard` (o cambiar el label del sidebar a "Inicio"). Actualizar `useAuth.login` y los `<Route>` correspondientes.

## 🟡 Refactors (mejoras de calidad)

### 13. Duplicación entre `*Form`

**Síntoma:** los 5 forms repiten la misma estructura (banner de éxito, banner de error, botón submit/cancel).

**Solución:** extraer `<EntityFormShell>` que reciba `<Entity>Form` como children o `<EntityFormShell>` con `useFormSuccess` hook. Ver [`conventions/forms.md`](../conventions/forms.md).

### 14. Duplicación entre `*Tabla`

**Síntoma:** las 5 tablas son casi idénticas (wrapper, thead, isLoading → "Cargando...").

**Solución:** extraer `<DataTable<T>>` genérico. Ver [`conventions/tables.md`](./tables.md).

### 15. `<SearchableSelect>` subutilizado

**Síntoma:** solo `VentaForm` lo usa. `ProductoForm` usa `<select>` nativo para categoría, que se vuelve ilegible con muchas categorías.

**Solución:** aplicar `<SearchableSelect>` también a:
- `ProductoForm.id_categoria`
- `CompraForm.id_producto`
- `VentaForm.id_cliente` (cuando se implemente)

### 16. `window.confirm` para edición

**Síntoma:** modal nativo, bloqueante, no estilizable.

**Solución:** modal estilizado o `<dialog>` HTML5, o doble-click dentro de 2 segundos.

### 17. Cast inline de `AxiosError` repetido 5 veces

**Síntoma:** `(error as { response?: { data?: { message?: string } } })?.response?.data?.message` en cada form.

**Solución:** helper `getApiErrorMessage(err, fallback)` y tipar `useMutation` con `AxiosError<ApiErrorBody>`. Ver [`conventions/error-handling.md`](../conventions/error-handling.md).

### 18. `Producto` y `Proveedor` re-declarados en `compra.types.ts` y `venta.types.ts`

**Síntoma:** si la API cambia, hay que actualizar 3 archivos.

**Solución:** importar desde `producto.types.ts` y `proveedor.types.ts`:
```ts
import type { Producto } from './producto.types';
```

### 19. `CategoriaResponse` y `ProveedorResponse` son idénticos a sus entidades

**Síntoma:** dos tipos para lo mismo.

**Solución:** eliminar `<Entity>Response` cuando sea trivial, o `export type CategoriaResponse = Categoria;`.

### 20. `Categoria.estado: string` debería ser unión literal

**Síntoma:** la UI asume `'activo' | 'inactivo'` pero el tipo permite cualquier string.

**Solución:**
```ts
export type EstadoCategoria = 'activo' | 'inactivo';
export interface Categoria {
    estado: EstadoCategoria;
}
```

### 21. Tablas no manejan `isError`

**Síntoma:** si la query falla, la tabla se ve vacía sin explicación.

**Solución:** branch explícito:
```tsx
if (isError) {
    return <tr><td colSpan={N}>Error al cargar. <button onClick={refetch}>Reintentar</button></td></tr>;
}
```

### 22. `QueryClient` sin opciones por defecto

**Síntoma:** cada hook repite `staleTime: 1000 * 60 * 60` y los defaults son ruidosos (refetchOnWindowFocus true, retry 3, etc.).

**Solución:** en `QueryProvider.tsx`:
```ts
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,        // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
```

### 23. `useAuth` no expone `user`

**Síntoma:** `Header` y `VentaForm` leen `getData<User>('auth-user')` directamente, saltándose el hook.

**Solución:** añadir `user` al return de `useAuth`:
```ts
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(getData<User>('auth-user'));
    // … login, logout
    return { user, login, logout };
};
```

### 24. Sin validación de formularios

**Síntoma:** solo HTML5 nativo (`required`, `maxLength`). Faltan `min`, `max`, `pattern`, mensajes custom.

**Solución:** considerar `react-hook-form` + `Zod`. Refactor mediano pero elimina boilerplate de `useState` y agrega validación declarativa.

### 25. Header `Authorization` inicial es `Bearer null`

**Síntoma:** la primera request antes de login tiene `Authorization: Bearer null`.

**Causa:** `axios.create({ headers: { Authorization: 'Bearer ' + getData('token-user') } })` se evalúa una vez.

**Solución:** eliminar el header del constructor, dejar solo el interceptor (que ya maneja correctamente la presencia/ausencia del token).

### 26. `Sidebar` con iconos hardcodeados

**Síntoma:** los iconos están literales en el JSX, no en un config.

**Solución:** mover a un `navLinks` array (que de hecho ya existe, pero los iconos se importan directamente).

### 27. Falta `.dockerignore`

**Síntoma:** imagen Docker inflada con `.env`, `.git`, `node_modules`.

**Solución:** ver punto 3 arriba.

### 28. `README.md` es el scaffold de Vite por defecto

**Síntoma:** el README no describe el proyecto real.

**Solución:** reescribir con:
- Resumen del dominio.
- Stack.
- Scripts.
- Variables de entorno.
- Cómo correr el backend.
- Estructura de carpetas (link a [`architecture/folder-structure.md`](../architecture/folder-structure.md)).
- Link a esta carpeta `docs/`.

### 29. `AGENTS.md` sin commitear

**Síntoma:** existe como archivo nuevo pero no está en git.

**Causa:** se añadió pero no se hizo `git add AGENTS.md`.

**Solución:**
```sh
git add AGENTS.md
git commit -m "Add AGENTS.md with dev conventions"
```

## 🟢 Menores (nice-to-have)

### 30. Sin `key` estable en líneas de detalle

**Síntoma:** `key={index}` en `CompraForm` y `VentaForm`.

**Solución:** usar `key={`${producto.id}-${idx}`}` o `crypto.randomUUID()`.

### 31. Sin loading skeletons

**Síntoma:** texto plano "Cargando..." sin spinner.

**Solución:** añadir `<Skeleton>` reutilizable con `animate-pulse` de Tailwind.

### 32. Sin error boundaries

**Síntoma:** un solo error de render puede tirar toda la app.

**Solución:** `<ErrorBoundary>` por página o por sección.

### 33. Sin `aria-live` en banners

**Síntoma:** los lectores de pantalla no anuncian el éxito/error.

**Solución:** añadir `role="alert"` y `aria-live="polite"` al `<div>` del banner.

### 34. `Footer` con "Desarrollado por" sin autor

**Síntoma:** placeholder obvio.

**Solución:** poner nombre/email del autor o quitar el footer.

### 35. Sin 404 page

**Síntoma:** rutas inválidas redirigen silenciosamente a `/inicio`.

**Solución:** crear `<NotFound/>` y reemplazar el catch-all:
```tsx
<Route path="*" element={<NotFound/>} />
```

### 36. Sin tests

**Síntoma:** no hay suite de tests. Cambios sin red de seguridad.

**Solución:** introducir Vitest + React Testing Library. Empezar por hooks (más fáciles de testear sin DOM).

### 37. Sin form de logout dedicado

**Síntoma:** el botón de logout está en el header sin confirmación.

**Solución:** considerar confirmación si la app maneja datos sensibles. (No urgente.)

### 38. Sin paginación

**Síntoma:** si la lista de productos crece a cientos, la tabla se vuelve lenta.

**Solución:** añadir paginación con `useInfiniteQuery` o paginación clásica con `useQuery({ page })`.

### 39. Sin ordenamiento

**Síntoma:** las tablas se renderizan en el orden del backend.

**Solución:** añadir `?sort=name&dir=asc` y headers clickeables.

### 40. Sin dark mode

**Síntoma:** la app es solo light.

**Solución:** Tailwind v4 lo soporta con `@variant dark` o `dark:` automático. Decisión de diseño previa.
