# Convenciones — Formularios

Los formularios del proyecto son **componentes controlados con `useState` puro**, sin `react-hook-form`, sin Formik, sin Zod. La validación es **nativa** (`required`, `maxLength`) y los errores de la API se muestran en un **banner rojo** extraído del `AxiosError` con un cast inline.

## Anatomía de un formulario (paradigma `<Entity>Form`)

```tsx
// src/components/CategoriaForm.tsx (esqueleto)
export const CategoriaForm = ({ categoria, onCancel }: Props) => {
    const isEditMode = !!categoria;

    const [nombre, setNombre] = useState(categoria?.nombre ?? '');
    const [prefijo, setPrefijo] = useState(categoria?.prefijo ?? '');
    const [showSuccess, setShowSuccess] = useState(false);

    const { mutate: create, isPending: isCreating, isError: createError } =
        useCreateCategoria(() => resetAndShowSuccess());
    const { mutate: update, isPending: isUpdating, isError: updateError } =
        useUpdateCategoria(() => resetAndShowSuccess());

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload: CategoriaPayload = { nombre, prefijo, estado: 'activo' };

        if (isEditMode && categoria) {
            if (!window.confirm('¿Está seguro de editar esta categoría?')) return;
            update({ id: categoria.id, payload });
        } else {
            create(payload);
        }
    };

    const resetAndShowSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setNombre('');
        setPrefijo('');
        onCancel?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* inputs con className de Tailwind */}
            <button type="submit" disabled={isCreating || isUpdating}>…</button>
        </form>
    );
};
```

## Reglas de oro

### 1. Una sola fuente de verdad para el estado del formulario

Cada campo es su propio `useState`. Para 5-10 campos está bien; más de eso se vuelve ruidoso y debería motivar la introducción de `react-hook-form` o un `useReducer`.

### 2. Props mínimas

```ts
interface Props {
    categoria?: Categoria;   // undefined = modo creación
    onCancel?: () => void;   // reset a modo creación
}
```

- La presencia de `categoria` indica **modo edición**.
- `onCancel` se llama tras éxito en edición (para que la página limpie su `editing<Entity>`).

### 3. `key={editing?.id ?? 'create'}` en la página

```tsx
// src/pages/Categorias.tsx (extracto)
<CategoriaForm
    key={editingCategoria?.id ?? 'create'}
    categoria={editingCategoria}
    onCancel={() => setEditingCategoria(undefined)}
/>
```

**Por qué:** cuando cambia `editingCategoria`, el `key` cambia, React desmonta y vuelve a montar el form. Esto resetea automáticamente todos los `useState` internos. Sin esto, el form retendría los valores del registro anterior.

### 4. Banner de éxito con `setTimeout`

```ts
const [showSuccess, setShowSuccess] = useState(false);

// tras onSuccess:
setShowSuccess(true);
setTimeout(() => setShowSuccess(false), 3000);
```

**Patrón repetido** en los 5 formularios. Es candidato natural para un hook `useFormSuccess()` o para una librería de toasts.

### 5. Banner de error con cast inline

```tsx
{(createError as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? 'Error al crear la categoría'}
```

Ver [`conventions/error-handling.md`](./error-handling.md) para el helper propuesto.

### 6. Confirmación de edición con `window.confirm`

```ts
if (!window.confirm('¿Está seguro de editar esta categoría?')) return;
```

**Anti-patrón conocido:** modal nativo del navegador, bloqueante, no estilizable. Aplicado en `CategoriaForm`, `ProductoForm` y `ProveedorForm`. Mejora: modal estilizado o doble-click dentro de un intervalo. **NO** se pide confirmación en `create` (decisión consciente: crear es reversible, editar sobreescribe).

### 7. Inputs deshabilitados en edición

Algunos campos son inmutables en modo edición. Esto está **hardcodeado** en cada form y **no documentado** explícitamente al usuario:

| Form | Campo deshabilitado en edición | Razón probable |
|---|---|---|
| `CategoriaForm` | `nombre` | El nombre identifica la categoría. |
| `CategoriaForm` | `prefijo` | El prefijo es una clave de negocio. |
| `ProductoForm` | `id_categoria` | Mover un producto de categoría es una decisión de otro proceso. |

⚠ **Esto sorprende al usuario.** El cursor cambia pero no hay un mensaje que explique por qué. Mejora: añadir un tooltip o un `<span class="text-xs text-gray-500">Inmutable</span>` debajo del campo.

### 8. Label asociado a input

Todos los inputs tienen `<label htmlFor="x">…</label>` con `id="x"` en el input. Accesibilidad básica respetada. **Falta** `aria-invalid`, `aria-describedby` para errores.

### 9. Submit deshabilitado durante la mutación

```tsx
<button type="submit" disabled={isCreating || isUpdating}>
    {isCreating || isUpdating ? 'Guardando…' : isEditMode ? 'Actualizar' : 'Crear'}
</button>
```

El label del botón cambia según el modo.

## Formularios "compuestos" (Compras / Ventas)

`CompraForm` y `VentaForm` no siguen el paradigma `Form + Tabla` side-by-side. Son formularios con **líneas de detalle** (`detalles[]`) que se editan inline.

```tsx
// VentaForm.tsx (extracto)
const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

const addDetalle = (producto: Producto, cantidad: number, precio: number) => {
    setDetalles([...detalles, { id_producto: producto.id, cantidad, precio_unitario: precio }]);
};
```

- Las líneas se renderizan en una mini-tabla debajo de los campos de cabecera.
- `key={index}` se usa como id de fila (⚠ anti-patrón; usar clave estable cuando se reordene/filtre).
- `SearchableSelect` se usa para elegir el producto (única implementación actual del componente).

## Búsqueda con `SearchableSelect`

`<SearchableSelect<T>>` es un combobox genérico con modal:

```tsx
<SearchableSelect<Product>
    items={productos}
    getId={(p) => p.id}
    getLabel={(p) => p.nombre}
    onSelect={(p) => addDetalle(p, 1, p.precio_venta)}
    placeholder="Buscar producto…"
/>
```

**Hoy solo lo usa `VentaForm`.** Mejora: aplicarlo a `ProductoForm.id_categoria`, `CompraForm.id_producto`, etc.

## Layout responsive

- `flex flex-col xl:flex-row` en la página: form y tabla lado a lado en pantallas grandes, apilados en móvil.
- Dentro del form: `grid grid-cols-1 md:grid-cols-2` para los pares de campos.
- Botones de submit: `w-full md:w-auto`.

## Datos derivados

Algunos forms hacen queries auxiliares para popular selects:

- `ProductoForm` → `useCategorias()` para el select de categoría.
- `VentaForm` → `useProductos()` para el `SearchableSelect`.
- `CompraForm` → idem.

Estas queries **comparten cache** con las queries equivalentes de las tablas (mismo `queryKey`). Es una decisión correcta: una sola fuente de verdad.

## Lo que **no** se hace

- ❌ Validación con Zod / Yup.
- ❌ Form library (react-hook-form).
- ❌ Toasts globales.
- ❌ Confirmación de creación.
- ❌ Modal estilizado de confirmación de edición.
- ❌ `aria-invalid` / `aria-describedby` en errores.
- ❌ Persistencia de borrador al recargar la página.

## Mejoras recomendadas (resumen)

1. **Extraer `<EntityFormShell>`** con el `<form>`, los banners y los botones. Reduciría ~60% del código de cada form.
2. **Extraer `useFormSuccess()`** hook que devuelva `[showSuccess, flashSuccess]`.
3. **Tipar `useMutation` con `AxiosError<{message?: string}>`** y crear `getApiErrorMessage(err)`.
4. **Sustituir `window.confirm`** por un modal estilizado o `<dialog>`.
5. **Documentar los campos inmutables** con un mensaje visible.
6. **Validación HTML5 completa**: añadir `min`, `max`, `pattern`, `minLength` a todos los inputs numéricos y de texto.
7. **Considerar `react-hook-form + Zod`** si la complejidad crece (más de 5 forms con validación rica).
