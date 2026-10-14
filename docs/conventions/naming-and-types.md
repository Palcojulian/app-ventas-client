# Convenciones — Naming y tipos

Este documento define las convenciones de **nombres de archivo**, **nombres de export** y **forma de los tipos** que se usan en todo el proyecto. La consistencia se mantiene manualmente (no hay ESLint custom para esto todavía).

## Naming

### Archivos

| Rol | Convención | Ejemplo |
|---|---|---|
| Página | `PascalCase.tsx` | `Categorias.tsx` |
| Componente de dominio | `PascalCase.tsx` | `CategoriaForm.tsx`, `CategoriasTabla.tsx` |
| Componente compartido | `PascalCase.tsx` | `ProtectedRoute.tsx`, `SearchableSelect.tsx` |
| Hook | `camelCase.ts` con `use` prefix | `useCategoria.ts`, `useAuth.ts` |
| Service | `kebab-case.service.ts` | `categoria.service.ts` |
| Types | `kebab-case.types.ts` | `compra.types.ts` |
| Config | `kebab-case.ts` o `PascalCase.ts` | `axios.ts` |
| Provider | `PascalCase.tsx` | `QueryProvider.tsx` |
| Util | `camelCase.ts` | `storage.ts` |
| Layout | `PascalCase.tsx` | `MainLayout.tsx` |

### Exports

| Concepto | Convención | Ejemplo |
|---|---|---|
| Hook de listado | `use<Entity>s` (plural) | `useCategorias`, `useProductos` |
| Hook de creación | `useCreate<Entity>` | `useCreateCategoria` |
| Hook de edición | `useUpdate<Entity>` | `useUpdateCategoria` |
| Hook de auth | `useAuth` | `useAuth` |
| Service | objeto con métodos HTTP | `categoriaService.getAll()` |
| Tipo de dominio | `<Entity>` | `Categoria`, `Producto` |
| Tipo de payload | `<Entity>Payload` | `CategoriaPayload` |
| Tipo de respuesta | `<Entity>Response` | `CategoriaResponse` |
| Constante de UI | `SCREAMING_SNAKE_CASE` | `UNIDADES_MEDIDA`, `METODOS_PAGO` |

⚠ **Inconsistencia actual:** `Categoria` y `Proveedor` usan `<Entity>Response` pero el contenido es idéntico al tipo base. Ver [Duplicación de tipos](#duplicación-de-tipos) abajo.

## Forma de los tipos

### Patrón por recurso

Cada recurso define exactamente tres tipos en `src/types/<recurso>.types.ts`:

```ts
// 1. El dominio (lo que el backend devuelve en GET)
export interface Categoria {
    id: number;
    nombre: string;
    prefijo: string;
    estado: string;                 // ⚠ debería ser 'activo' | 'inactivo'
    created_at?: string;
    updated_at?: string;
}

// 2. El payload (lo que se envía en POST/PUT)
export type CategoriaPayload = Omit<Categoria, 'id' | 'created_at' | 'updated_at'>;

// 3. La respuesta (lo que el backend devuelve en POST/PUT)
export interface CategoriaResponse {
    id: number;
    nombre: string;
    prefijo: string;
    estado: string;
    created_at: string;
    updated_at: string;
}
```

**Convención aplicada** en `categoria`, `producto`, `proveedor`. `compra` y `venta` tienen shapes más complejos (líneas de detalle, FKs).

### Tipos auxiliares

Algunos recursos necesitan tipos extra para **líneas de detalle** o **relaciones embebidas**:

```ts
// compra.types.ts
export interface DetalleCompra {
    id_producto: number;
    cantidad: number;
    costo_unitario: number;
}

export interface Compra {
    id: number;
    id_proveedor: number;
    numero_factura: string;
    fecha: string;
    detalles: DetalleCompra[];
    subtotal: number;
    impuestos: number;
    descuento: number;
    total: number;
    created_at: string;
    updated_at: string;
}
```

### Tipos compartidos

Algunos tipos se importan desde otros archivos:

- `User` en `auth.types.ts` se importa donde haga falta (e.g. `VentaForm` para `id_cliente`).
- `Producto` en `producto.types.ts` se importa desde `compra.types.ts` y `venta.types.ts` — **aunque hoy se re-declara** (ver siguiente sección).

## Duplicación de tipos

### Problema 1: `<Entity>Response` redundante

`CategoriaResponse` y `ProveedorResponse` son **idénticos** a `Categoria` y `Proveedor`. No aportan información. La forma idiomática sería:

```ts
export type CategoriaResponse = Categoria;
```

O, mejor aún, **eliminar `<Entity>Response` y usar `<Entity>` directamente** en hooks y services. Hoy se usa para distinguir "lo que envío" vs. "lo que recibo", pero en este proyecto la distinción es trivial.

### Problema 2: `Producto` re-declarado

`Producto` se declara en `producto.types.ts` y **vuelve a declararse** dentro de `compra.types.ts` y `venta.types.ts`:

```ts
// compra.types.ts (extracto)
export interface Producto {        // ⚠ duplicado
    id: number;
    nombre: string;
    // …campos iguales a producto.types.ts
}
```

Si la API cambia la forma de `Producto`, hay que actualizar **3 archivos**. La solución:

```ts
// compra.types.ts (forma correcta)
import type { Producto } from './producto.types';
export type { Producto };
```

O importar directamente donde se use.

### Problema 3: `Proveedor` re-declarado

Mismo caso que `Producto`, pero solo en `compra.types.ts`.

## Tipos "estado" como string

```ts
// categoria.types.ts
export interface Categoria {
    estado: string;        // debería ser: 'activo' | 'inactivo'
}
```

La UI asume valores literales (`'activo'`, `'inactivo'`) pero el tipo es `string`. Mejora: unión literal.

## Constantes de UI

Algunas constantes se exportan desde los archivos de tipos:

```ts
// producto.types.ts
export const UNIDADES_MEDIDA = ['unidad', 'kg', 'litro', 'metro', 'caja'] as const;

// venta.types.ts
export const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia'] as const;
export const ESTADOS_VENTA = ['pendiente', 'pagada', 'cancelada'] as const;
```

⚠ **`UNIDADES_MEDIDA` no se usa en ningún componente.** Está exportada pero el form de Producto no tiene input para `unidad_medida` (que sí está en el tipo). Es código muerto.

## Convenciones para `enum`-like

El proyecto usa `as const` arrays en vez de `enum` de TypeScript. Razón: `tsconfig.app.json` tiene `"erasableSyntaxOnly": true`, que **prohíbe `enum`**.

```ts
// ✅ forma permitida
export const ESTADOS = ['activo', 'inactivo'] as const;
export type Estado = typeof ESTADOS[number];  // 'activo' | 'inactivo'
```

```ts
// ❌ prohibida por erasableSyntaxOnly
export enum Estado { Activo = 'activo', Inactivo = 'inactivo' }
```

## Tipos de UI

No hay tipos específicos para props de UI en un archivo separado. Las props se declaran inline en cada componente:

```tsx
// SearchableSelect.tsx
interface SearchableSelectProps<T> {
    items: T[];
    getId: (item: T) => string | number;
    getLabel: (item: T) => string;
    onSelect: (item: T) => void;
    placeholder?: string;
}
```

**Ventaja:** tipos pegados al componente que los usa, no hay que saltar a otro archivo.
**Desventaja:** si dos componentes comparten props, hay que duplicar (hoy no ocurre).

## Cómo añadir un tipo nuevo

1. Si es de un recurso existente, añadir en `src/types/<recurso>.types.ts`.
2. Si es de un recurso nuevo, crear `src/types/<recurso>.types.ts` con la triada `<Entity>`, `<Entity>Payload`, `<Entity>Response`.
3. Si es un tipo compartido (e.g. `User`), añadir en `auth.types.ts` o crear un nuevo archivo de tipos comunes.
4. **Nunca** re-declarar un tipo existente en otro archivo. Importar.

## Cómo añadir un hook / service / form nuevo

Ver [`development/adding-a-new-entity.md`](../development/adding-a-new-entity.md).
