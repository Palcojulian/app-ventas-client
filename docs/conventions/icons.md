# Convenciones — Iconos

Toda la iconografía del proyecto viene de **`lucide-react`**. No se usan SVGs locales (aunque `public/icons.svg` existe pero no se importa desde código).

## Uso

```tsx
import { Pencil, Plus, Trash2, LogOut } from 'lucide-react';

<button onClick={onEdit}>
    <Pencil className="w-4 h-4" />
</button>
```

- **Tamaño:** `w-4 h-4` para acciones en tabla, `w-5 h-5` para UI general, `w-8 h-8` a `w-12 h-12` para header.
- **Color:** se hereda del `color` del padre. Para forzar: `className="text-indigo-500"`.

## Inventario de iconos usados

| Icono | Uso |
|---|---|
| `Pencil` | Botón "Editar" en cada fila de tabla. |
| `Plus` | Botón "Crear / Agregar". |
| `Trash2` | (Reservado para delete; no se usa todavía porque no hay delete en la API.) |
| `List` | Tabs "Listar" en Compras/Ventas. |
| `Menu` | Abrir sidebar en móvil. |
| `X` | Cerrar sidebar en móvil / cerrar modal. |
| `Check` | Confirmaciones, estados. |
| `ChevronDown` | Dropdowns / selects. |
| `CircleUser` | Avatar genérico en `<Header>`. |
| `LogOut` | Botón "Cerrar sesión" en `<Header>`. |
| `ChartPie` | Link "Dashboard" en `<Sidebar>`. |
| `ChartColumnStacked` | Link "Categorías" en `<Sidebar>`. |
| `Package` | Link "Productos" en `<Sidebar>`. |
| `Users` | Link "Proveedores" en `<Sidebar>`. |
| `ShoppingCart` | Link "Compras" en `<Sidebar>`. |
| `DollarSign` | Link "Ventas" en `<Sidebar>`. |

## Sidebar

```tsx
const navItems = [
    { to: '/inicio',       label: 'Dashboard',  icon: ChartPie },
    { to: '/categorias',   label: 'Categorías', icon: ChartColumnStacked },
    { to: '/proveedores',  label: 'Proveedores',icon: Users },
    { to: '/productos',    label: 'Productos',  icon: Package },
    { to: '/compras',      label: 'Compras',    icon: ShoppingCart },
    { to: '/ventas',       label: 'Ventas',     icon: DollarSign },
];
```

Cada item se renderiza con `<NavLink>` de React Router. El icono activo recibe color indigo:

```tsx
<NavLink
    to={item.to}
    className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded
         ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
    }
>
    <item.icon className="w-5 h-5" />
    {item.label}
</NavLink>
```

## Botones de acción en tablas

```tsx
<button
    onClick={() => onEdit(c)}
    className="text-indigo-500 hover:text-indigo-700"
    aria-label="Editar"
>
    <Pencil className="w-4 h-4" />
</button>
```

**Importante:** los botones icon-only deben tener `aria-label` para accesibilidad (lectores de pantalla no anuncian el ícono por defecto).

## Accesibilidad

- ✅ Iconos decorativos: usar `aria-hidden="true"` si el texto adyacente ya describe la acción.
- ✅ Iconos significativos: añadir `aria-label` al botón que los contiene.
- ✅ Contraste: el `text-indigo-500` sobre fondo blanco cumple WCAG AA.

## Búsqueda de iconos

`lucide-react` ofrece ~1000 iconos. Para encontrar uno nuevo:

1. Buscar en [lucide.dev](https://lucide.dev) por nombre semántico.
2. Importar por nombre PascalCase:
   ```tsx
   import { IconName } from 'lucide-react';
   ```

## Gotcha: versión del paquete

`package.json` declara `lucide-react: ^1.14.0`. **Esta versión probablemente no existe en el registro público** (la línea real es `0.x`). Si `npm install` falla, ver [`operations/troubleshooting.md`](../operations/troubleshooting.md).

## No usar

- ❌ SVGs locales inline (`<svg>...</svg>` en componentes).
- ❌ Emojis como iconografía.
- ❌ Font icons (Font Awesome, Material Icons).
- ❌ Imágenes PNG para acciones.

## Mejoras

- **Reemplazar `DollarSign` por `Banknote`** en el link "Ventas" (semánticamente más correcto).
- **Añadir `BarChart3` o `LayoutDashboard`** en "Dashboard" en lugar de `ChartPie` (que sugiere un gráfico de torta, no un dashboard).
- **Considerar `Box` o `BoxIcon`** en "Productos" en lugar de `Package` (más genérico).
