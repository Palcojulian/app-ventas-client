# Convenciones — Tablas

Cada recurso tiene un componente `<Entity>Tabla` (`CategoriasTabla`, `ProductosTabla`, `ProveedoresTabla`, `ComprasTabla`, `VentasTabla`) que renderiza los registros en una tabla HTML con Tailwind y permite dispatch de edición al componente padre vía callback.

## Anatomía de una tabla

```tsx
// src/components/CategoriasTabla.tsx (esqueleto)
interface Props {
    onEdit: (categoria: Categoria) => void;
}

export const CategoriasTabla = ({ onEdit }: Props) => {
    const { data: categorias = [], isLoading } = useCategorias();

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">…</thead>
                    <tbody>
                        <tr>
                            <td colSpan={3} className="text-center py-6 text-gray-500">
                                Cargando...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left">Prefijo</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((c) => (
                        <tr key={c.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{c.nombre}</td>
                            <td className="px-4 py-2">{c.prefijo}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => onEdit(c)}>
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

## Reglas

### 1. Una sola prop: `onEdit`

```ts
interface Props {
    onEdit: (entity: Entity) => void;
}
```

**Por qué:** la tabla no sabe cómo se va a editar el registro; solo emite la intención. La página decide si abre un form, abre un modal, navega a otra ruta, etc.

### 2. El hook de listado se llama directamente

```tsx
const { data: categorias = [], isLoading } = useCategorias();
```

`data` se destructura con default `[]` para evitar `undefined` en el `.map()`. El componente no llama al service — solo al hook.

### 3. Estado de carga: `Cargando...` en una sola fila

```tsx
if (isLoading) {
    return <tr><td colSpan={N}>Cargando...</td></tr>;
}
```

Sin skeleton, sin spinner, sin mensajes contextuales. Mejora: extraer a un `<TableSkeleton rows={5} columns={N} />` o similar.

### 4. **No** se maneja `isError`

```tsx
const { data, isLoading, isError } = useCategorias();
// isError NO se usa
```

Si la query falla, `data` es `undefined` y la tabla simplemente no renderiza filas. El usuario ve una tabla vacía sin explicación. **Bug menor conocido.** Ver [`operations/troubleshooting.md`](../operations/troubleshooting.md).

### 5. `colSpan` correcto

El `colSpan` del `<td>` de carga debe coincidir con el número de `<th>` de la tabla. Si no, la fila se rompe visualmente.

### 6. Responsive: ocultar columnas en móvil

Las tablas usan clases `hidden sm:table-cell` / `hidden md:table-cell` en los `<th>/<td>` que se ocultan en pantallas pequeñas:

```tsx
<th className="px-4 py-2 text-left hidden md:table-cell">Email</th>
<td className="px-4 py-2 hidden md:table-cell">{proveedor.email}</td>
```

La columna de acciones nunca se oculta.

### 7. Hover sutil

```tsx
<tr className="border-t hover:bg-gray-50">
```

### 8. Iconos de acción con `lucide-react`

```tsx
<button onClick={() => onEdit(c)} className="text-indigo-500 hover:text-indigo-700">
    <Pencil className="w-4 h-4" />
</button>
```

Iconos usados: `Pencil` (editar), `Trash2` (eliminar — aunque no hay delete en ningún recurso todavía), `Plus` (alta — aparece en forms, no en tablas).

## El callback `onEdit` en la página

```tsx
// src/pages/Categorias.tsx (extracto)
const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();

return (
    <div className="flex flex-col xl:flex-row gap-4">
        <CategoriaForm
            key={editingCategoria?.id ?? 'create'}
            categoria={editingCategoria}
            onCancel={() => setEditingCategoria(undefined)}
        />
        <CategoriasTabla
            onEdit={(c) => setEditingCategoria(c)}
        />
    </div>
);
```

**La página es dueña del estado de edición.** El form y la tabla no se hablan directamente; pasan por la página.

## Patrón de tabs (Compras / Ventas)

`Compras.tsx` y `Ventas.tsx` no usan el patrón Form+Tabla side-by-side. Usan **tabs**:

```tsx
const [activeTab, setActiveTab] = useState<'registrar' | 'listar'>('registrar');

return (
    <div>
        <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('registrar')}>Registrar</button>
            <button onClick={() => setActiveTab('listar')}>Ver Compras</button>
        </div>
        {activeTab === 'registrar' ? <CompraForm/> : <ComprasTabla/>}
    </div>
);
```

Solo se monta un componente a la vez → menos carga de queries, menos estado vivo.

## Duplicación entre tablas

Las 5 tablas son **casi idénticas**:

- Mismo wrapper `overflow-x-auto bg-white rounded-lg shadow`.
- Mismo thead `bg-gray-100 text-gray-700`.
- Mismo `if (isLoading) return <tr>…</tr>;`.
- Misma columna "Acciones" con botón de editar.
- Mismo comportamiento de `onEdit`.

**Mejora propuesta:** extraer un componente genérico:

```tsx
// futuro: src/components/DataTable.tsx
interface Column<T> {
    header: string;
    cell: (item: T) => ReactNode;
    className?: string;          // para hidden md:table-cell
    hideOn?: 'sm' | 'md' | 'lg';
}

interface DataTableProps<T> {
    data: T[] | undefined;
    isLoading: boolean;
    columns: Column<T>[];
    getRowId: (item: T) => string | number;
    onEdit?: (item: T) => void;
    emptyMessage?: string;
}

export function DataTable<T>({ data, isLoading, columns, onEdit, getRowId, emptyMessage }: DataTableProps<T>) {
    // …
}
```

Esto eliminaría ~70% del código de cada tabla.

## Lo que **no** se hace

- ❌ Paginación (`useInfiniteQuery`).
- ❌ Ordenamiento por columnas.
- ❌ Filtros / búsqueda.
- ❌ Selección múltiple (checkbox por fila).
- ❌ Acciones en lote.
- ❌ Skeletons.
- ❌ Estado de error.
- ❌ Empty state con CTA ("No hay categorías. ¿Crear la primera?").

## Resumen de buenas prácticas respetadas

- ✅ Componente presentacional, recibe datos por hook.
- ✅ `onEdit` como único callback.
- ✅ `data` con default `[]` para evitar `undefined`.
- ✅ Responsive (columnas ocultas en móvil).
- ✅ Accesibilidad: `<th>` con `scope` no se usa, pero el contraste es correcto.
- ✅ Iconos consistentes (`Pencil` para editar).

## Mejoras

1. **Extraer `<DataTable<T>>`** (ver esqueleto arriba).
2. **Manejar `isError` con un `<tr><td>Error al cargar. <button>Reintentar</button></td></tr>`**.
3. **Empty state explícito**: si `data.length === 0 && !isLoading`, mostrar mensaje.
4. **Skeletons** en lugar de "Cargando..." plano.
5. **Paginación y ordenamiento** si la lista crece (hoy no hay productos > 50, pero es un buen momento para planificar).
6. **Eliminar `key={index}` en líneas de detalle** de `CompraForm`/`VentaForm` — usar `key={producto.id}-${idx}` o un `crypto.randomUUID()`.
