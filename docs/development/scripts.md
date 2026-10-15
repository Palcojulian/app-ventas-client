# Desarrollo — Scripts npm

Definidos en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## `npm run dev`

Arranca el servidor de desarrollo de Vite con HMR (Hot Module Replacement).

- **Puerto:** 5173 (default de Vite).
- **Host:** `localhost` por defecto. Si se quiere exponer en la red, usar `npm run dev -- --host`.
- **HMR:** cualquier cambio en `src/` recarga la app preservando el estado (cuando es posible).

### Uso típico

```sh
npm run dev
# luego abrir http://localhost:5173
```

### En Docker

El `Dockerfile` actual ejecuta:

```sh
npm run dev -- --host
```

Esto expone Vite en `0.0.0.0:5173`, accesible desde fuera del contenedor. Ver [`development/docker.md`](./docker.md) — **esto no es una imagen de producción**.

## `npm run build`

Compila TypeScript con `tsc -b` (project references) y luego hace el bundle de Vite.

```sh
npm run build
# = tsc -b && vite build
```

- **`tsc -b`:** typecheck del proyecto completo. Si hay errores de tipos, el build falla **antes** del bundling.
- **`vite build`:** bundlea `src/` → `dist/`. Por defecto genera `dist/index.html` + assets hasheados.

**Importante:** a diferencia de `npm run lint` (que solo aplica ESLint), `build` **sí** detecta errores de TypeScript. Si solo corres `lint`, los errores de tipos pasan inadvertidos. **Siempre corre `build` antes de mergear a `main`.**

### Output

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── …
├── favicon.svg
├── icons.svg
└── index.html
```

Listo para servir con cualquier static server (nginx, Caddy, Vercel, Netlify, etc.).

## `npm run lint`

Ejecuta ESLint con la flat config (`eslint.config.js`).

```sh
npm run lint
```

Aplica:

- `@eslint/js` recommended.
- `typescript-eslint` recommended (no `recommended-typeChecked`).
- `eslint-plugin-react-hooks` (reglas de hooks).
- `eslint-plugin-react-refresh` (HMR-safe exports).
- `globals.browser` como globals.

**No** incluye reglas estilísticas (formato), por lo que no corre Prettier. **No** es type-aware.

### Lint en CI

```sh
npm run lint
```

Si se quiere typecheck en CI también, agregar `npm run build` (que ya lo hace vía `tsc -b`).

## `npm run preview`

Sirve el bundle de producción (`dist/`) localmente, sin rebuild.

```sh
npm run build
npm run preview
# abrir http://localhost:4173 (puerto default de vite preview)
```

Útil para validar que el bundle de producción se comporta igual que el de dev antes de desplegar.

## Scripts no definidos (pero recomendables)

```json
{
  "typecheck": "tsc -b --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

- **`typecheck`:** corre solo `tsc -b` sin emitir. Más rápido que `build` para validar tipos en watch.
- **`test` / `test:watch`:** Vitest (recomendado por compatibilidad nativa con Vite). El proyecto **no tiene tests configurados** aún.
- **`format` / `format:check`:** Prettier. Útil para estilar imports, comillas, etc. **No** está configurado en este proyecto.

## Pre-commit hooks (recomendado)

Si se quiere automatizar lint + typecheck antes de cada commit, añadir **Husky + lint-staged**:

```sh
npx husky-init && npm install
npx husky set .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

## Verificación rápida de un cambio

```sh
npm run lint        # eslint
npm run build       # tsc -b + vite build (typecheck + bundle)
npm run preview     # smoke test del bundle
```

Si los tres pasan, el cambio está listo para PR.
