# Operaciones — Checklist pre-merge

Antes de hacer merge a `main`, verificar lo siguiente. Cada ítem tiene un comando concreto para ejecutarlo.

## 1. Lint

```sh
npm run lint
```

- [ ] ESLint pasa sin errores.
- [ ] No hay warnings de `react-hooks/exhaustive-deps`.
- [ ] No hay warnings de `react-refresh/only-export-components`.

## 2. Typecheck

```sh
npm run build   # corre tsc -b + vite build
```

- [ ] `tsc -b` pasa sin errores.
- [ ] `vite build` genera `dist/` sin warnings de bundle.

**Importante:** `npm run lint` solo no atrapa errores de TypeScript. **Siempre correr `build` antes de mergear.**

## 3. Smoke test de la app

Levantar localmente y verificar:

```sh
npm run dev
```

Abrir `http://localhost:5173`.

### 3.1. Autenticación

- [ ] **Login:** ir a `/login`, ingresar credenciales válidas → redirige a `/inicio`.
- [ ] **Login inválido:** ingresar credenciales incorrectas → muestra error (idealmente, el mensaje del backend).
- [ ] **Logout:** click en botón logout → redirige a `/login`, el storage queda limpio.
- [ ] **Guard de ruta:** sin sesión, intentar ir a `/categorias` → redirige a `/login`.
- [ ] **Guard inverso:** con sesión, intentar ir a `/login` → redirige a `/inicio`.
- [ ] **Refresh:** recargar la página en una ruta protegida → la sesión persiste.

### 3.2. Categorías

- [ ] La tabla carga con datos.
- [ ] **Crear:** completar form, click "Crear" → banner verde, fila aparece en la tabla.
- [ ] **Editar:** click en lápiz de una fila → form se rellena, campos inmutables deshabilitados.
- [ ] **Editar (update):** cambiar un campo, confirmar → banner verde, fila actualizada.
- [ ] **Cancelar edición:** click "Cancelar" → form se resetea a modo creación.

### 3.3. Proveedores

- [ ] Igual a Categorías.

### 3.4. Productos

- [ ] La tabla carga con productos.
- [ ] El select de categorías está populado.
- [ ] **Crear:** crear un producto nuevo → aparece en la tabla.
- [ ] **Editar:** el campo `id_categoria` está deshabilitado en edición (esto es esperado, ver [`conventions/forms.md`](../conventions/forms.md)).

### 3.5. Compras

- [ ] La tabla carga con compras existentes.
- [ ] **Crear:** registrar una compra con al menos un detalle → aparece en la tabla.
- [ ] **Validar stock:** tras una compra, ir a Productos y verificar que el stock del producto comprado se actualizó. (Si no se actualiza, ver bug en [`operations/troubleshooting.md`](./troubleshooting.md) punto 5.)

### 3.6. Ventas

- [ ] La tabla carga con ventas existentes.
- [ ] **Crear:** registrar una venta con al menos un detalle → aparece en la tabla.
- [ ] **Validar stock:** tras una venta, ir a Productos y verificar que el stock del producto vendido **disminuyó** (debería invalidar `['productos']` en `useCreateVenta`).

### 3.7. Responsive

- [ ] Abrir DevTools,模拟 móvil (375 px): el sidebar se colapsa y aparece un botón ☰.
- [ ] Click en ☰: sidebar desliza desde la izquierda, overlay oscuro.
- [ ] Click en X o en el overlay: sidebar cierra.
- [ ] Tablas: columnas opcionales se ocultan en móvil.

## 4. Verificación de UI específica

- [ ] **Copiar texto:** intentar copiar un email de proveedor o número de factura. **Si `user-select: none` está activo globalmente, esto fallará** (ver [`operations/troubleshooting.md`](./troubleshooting.md) punto 9).
- [ ] **Hover en filas de tabla:** el fondo cambia a `gray-50` (sutil).
- [ ] **Focus visible:** tabular con teclado a través de inputs/buttons → outline indigo visible.
- [ ] **Iconos:** todos los iconos se renderizan (no hay cuadrados con `?` por iconos faltantes).

## 5. Verificación de build de producción

```sh
npm run build
npm run preview
```

Abrir `http://localhost:4173`.

- [ ] La app funciona idéntica a dev.
- [ ] No hay requests a HMR endpoints (404 en console).
- [ ] El bundle de `dist/` es <500 KB gzipped (referencia).

## 6. Verificación de Docker (si aplica)

```sh
docker build -t app-ventas:test .
docker run --rm -p 5173:5173 app-ventas:test
```

- [ ] El contenedor arranca sin errores.
- [ ] La app es accesible en `http://localhost:5173`.
- [ ] El log no muestra warnings de `npm install` o `vite`.

## 7. Documentación

- [ ] Si se añadió una nueva entidad, seguir [`development/adding-a-new-entity.md`](../development/adding-a-new-entity.md) y actualizar las secciones relevantes de `docs/`.
- [ ] Si se cambió un endpoint o un tipo, reflejar en [`architecture/api-client.md`](../architecture/api-client.md).
- [ ] Si se añadió una nueva convención, documentarla en `docs/conventions/`.
- [ ] Si se descubrió un bug, añadir a [`operations/troubleshooting.md`](./troubleshooting.md).

## 8. Git hygiene

- [ ] Commits con mensajes descriptivos (Conventional Commits recomendado: `feat:`, `fix:`, `chore:`, etc.).
- [ ] No hay archivos sin stagear (`git status` limpio antes de push).
- [ ] No hay commits de secretos (verificar `git log -p | grep -i 'api_key\|secret\|password'`).
- [ ] Branch está al día con `origin/main` (`git fetch && git rebase origin/main`).

## Resumen rápido

```sh
# 1. Lint
npm run lint

# 2. Build (typecheck + bundle)
npm run build

# 3. Smoke test
npm run dev   # y verificar manualmente

# 4. Build de prod
npm run preview
```

Si los 4 pasos pasan, el cambio está listo para PR.
