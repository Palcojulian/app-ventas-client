# Convenciones — Estilos

El proyecto usa **Tailwind v4** integrado con Vite (sin PostCSS), un único archivo CSS global y clases utilitarias en los componentes. No hay preprocesador, no hay CSS-in-JS, no hay design tokens explícitos.

## Setup de Tailwind v4

### `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
});
```

**Importante:** se usa el plugin oficial `@tailwindcss/vite`. **No** hay `tailwind.config.js` ni `postcss.config.js`. Esta es la forma oficial de Tailwind v4.

### `src/index.css`

```css
@import "tailwindcss";

* {
    box-sizing: border-box;
}

html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    user-select: none;       /* ⚠ ver gotcha abajo */
    overflow-x: hidden;
}

@layer base {
    h1 { @apply text-2xl text-gray-700 font-bold; }
    h2 { @apply text-xl text-gray-700 font-semibold; }
    h3 { @apply text-lg text-gray-700 font-medium; }
    h4, h5, h6 { @apply text-base text-gray-700 font-medium; }
}
```

### Notas

- `@import "tailwindcss";` es la única directiva obligatoria. Reemplaza las directivas `@tailwind base/components/utilities` de Tailwind v3.
- Los headings tienen estilos globales vía `@apply`. Esto **afecta a todos los `<h1>`-`<h6>` de la app** sin excepción. Si un día se quiere un título grande de otro color, hay que sobrescribir con clases explícitas.

## Paleta usada (por convención, no por tokens)

No hay `theme.extend.colors` en un `tailwind.config.js` (no existe). Los colores están hardcodeados en los componentes:

| Color | Uso | Ejemplo |
|---|---|---|
| `indigo-500/600/700` | Primario (botones, links, foco) | `bg-indigo-500 hover:bg-indigo-700` |
| `gray-50/100/300/500/600/700/800` | Neutros (fondos, texto, bordes) | `bg-gray-50`, `text-gray-700` |
| `green-100/500/600/700` | Éxito | `bg-green-100 text-green-700` |
| `red-100/500/600/700` | Error / peligro | `bg-red-100 text-red-700` |
| `yellow-100/700` | Advertencia (e.g. "no hay usuario") | `bg-yellow-100 text-yellow-700` |
| `white` | Tarjetas, inputs | `bg-white` |

**Decisión de diseño:** mantener esta paleta como convención informal. Si se introducen design tokens (e.g. `primary`, `success`, `danger`), se debe migrar a `@theme` de Tailwind v4 en el CSS global:

```css
@theme {
    --color-primary: oklch(0.5 0.2 270);  /* indigo-ish */
    --color-success: oklch(0.7 0.15 145);
    --color-danger: oklch(0.6 0.22 25);
}
```

## Patrones de layout

### Contenedor de página

```tsx
<div className="flex flex-col xl:flex-row gap-4 p-4 sm:p-6 lg:p-8">
```

- Padding responsive (`sm:`, `lg:`).
- Stack vertical en móvil, horizontal en `xl`.

### Tarjeta

```tsx
<div className="bg-white rounded-lg shadow p-4 sm:p-6">
```

### Botones

- **Primario:** `bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition`.
- **Secundario:** `bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition`.
- **Peligro:** `bg-red-500 hover:bg-red-600 text-white`.
- **Icon-only:** `p-2 rounded-full hover:bg-gray-100`.

### Inputs

```tsx
<input
    id="nombre"
    type="text"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
```

### Banner de éxito / error

```tsx
{showSuccess && (
    <div className="bg-green-100 text-green-700 p-2 rounded">
        Categoría guardada correctamente.
    </div>
)}
```

## Responsive breakpoints usados

| Breakpoint | Significado | Uso |
|---|---|---|
| (ninguno) | Base | Layout móvil-first. |
| `sm:` | ≥ 640 px | Mostrar columnas de tabla ocultas. |
| `md:` | ≥ 768 px | Sidebar visible, columnas adicionales. |
| `lg:` | ≥ 1024 px | Padding más generoso. |
| `xl:` | ≥ 1280 px | Layout horizontal (Form+Tabla). |

## Sidebar mobile

El sidebar es un **drawer deslizante** en móvil:

```tsx
<aside className={`
    fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow
    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    transition-transform duration-200
    md:translate-x-0
`}>
```

- `md:static`: en desktop, se renderiza en el flujo normal.
- En móvil, `fixed` + `transform` para el slide.
- Hay un overlay oscuro detrás en móvil: `md:hidden fixed inset-0 bg-black/50`.

## Gotcha conocido: `user-select: none` global

`index.css` aplica `user-select: none` a `html, body, #root`. Esto **impide seleccionar texto** en toda la app, incluyendo las tablas. Un usuario no puede:

- Copiar un email de proveedor para pegarlo en otro lado.
- Copiar un número de factura.
- Copiar un nombre de producto.

**Causa probable:** intención de evitar selección accidental en la UI chrome. **Pero afecta funcionalidad real.**

### Solución

Quitar la regla global y aplicarla solo a elementos no-textuales:

```css
html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    /* user-select: none; ← quitar */
}

/* Si se quiere evitar selección en botones/iconos: */
button, nav, header {
    user-select: none;
}
```

O más conservador: dejar `user-select: none` en `html, body, #root` pero sobrescribir en celdas de tabla:

```css
td, th {
    user-select: text;
}
```

## Lo que **no** se usa

- ❌ `tailwind.config.js` (Tailwind v4 no lo necesita).
- ❌ PostCSS.
- ❌ CSS Modules.
- ❌ CSS-in-JS (styled-components, emotion).
- ❌ Theme provider.
- ❌ Design tokens explícitos.
- ❌ Animaciones más allá de `transition`/`duration`.
- ❌ Dark mode.

## Resumen de buenas prácticas

- ✅ Tailwind v4 vía plugin oficial de Vite (forma idiomática actual).
- ✅ Mobile-first.
- ✅ Sin CSS custom fuera de `index.css`.
- ✅ `bg-white rounded-lg shadow` consistente para tarjetas.
- ✅ Estados hover explícitos.
- ✅ `focus:ring-2 focus:ring-indigo-500` para foco accesible.

## Mejoras recomendadas

1. **Quitar `user-select: none` global** o limitarlo.
2. **Migrar la paleta hardcodeada a `@theme` en `index.css`** para poder referenciar `text-primary` en vez de `text-indigo-500`. Es opt-in: Tailwind v4 lo soporta nativamente.
3. **Considerar headings como componentes** (`<PageTitle>`, `<SectionTitle>`) en vez de `<h1>/<h2>` con estilos globales. Evita acoplamiento CSS a la jerarquía semántica.
4. **Dark mode** si se requiere (Tailwind v4 lo soporta con `@variant dark` o `dark:` automático según sistema).
5. **Loading skeletons** con animación `animate-pulse` en lugar del texto "Cargando...".
