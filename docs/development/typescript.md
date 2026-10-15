# Desarrollo — TypeScript

El proyecto usa **TypeScript con project references** y un set estricto de flags. El typecheck se ejecuta antes del bundle (`npm run build` corre `tsc -b` antes de `vite build`).

## Configuración

### `tsconfig.json` (root)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Vacío, solo declara las referencias. El root no se typechek por sí mismo.

### `tsconfig.app.json` (código de la app)

```jsonc
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "erasableSyntaxOnly": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

### `tsconfig.node.json` (config de Vite)

```jsonc
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

## Flags importantes (y su efecto)

| Flag | Significado | Consecuencia en este proyecto |
|---|---|---|
| `verbatimModuleSyntax: true` | Las imports de tipos deben usar `import type { … }` literal. | El código usa `import type { Categoria, User } from '…'` consistentemente. |
| `erasableSyntaxOnly: true` | Prohíbe constructs que requieren codegen (enums, namespaces con valores, parameter properties). | Hay que usar `as const` arrays en vez de `enum`. |
| `noUnusedLocals: true` | Variables locales no usadas son error. | Hay que limpiar imports/variables o prefijar con `_`. |
| `noUnusedParameters: true` | Parámetros no usados son error. | Mismo. |
| `noFallthroughCasesInSwitch: true` | `case` sin `break/return` es error. | Evita olvidos en switches. |
| `strict: true` | Activa `strictNullChecks`, `noImplicitAny`, etc. | El código es seguro con `null`/`undefined`. |
| `moduleResolution: "bundler"` | Resolución optimizada para Vite. | Permite imports sin extensión y re-exports simplificados. |
| `jsx: "react-jsx"` | Nueva transformación de JSX (sin `import React from 'react'`). | El código no importa `React` explícitamente. |
| `noEmit: true` | No emite JS. | Vite hace el bundling. `tsc -b` solo typechek. |
| `allowImportingTsExtensions: true` | Permite `import './foo.ts'`. | Coherente con `noEmit` y `moduleResolution: bundler`. |

## Cómo añadir un archivo nuevo

1. **En `src/`:** simplemente créalo. `tsconfig.app.json` incluye `src` automáticamente.
2. **Si necesita tipos de Node:** importar `import type { … } from 'node'`. Asegurarse de que el archivo no esté en `include` de `tsconfig.node.json` (a menos que sea config de build).

## Cómo añadir una variable de entorno

Ver [`development/environment.md`](./environment.md) — hay que añadirla a `ImportMetaEnv` en `src/vite-env.d.ts`.

## Cómo añadir un path alias (opcional)

Hoy no hay aliases. Para añadir uno (e.g. `@/components`):

1. En `tsconfig.app.json`:
   ```jsonc
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```
2. En `vite.config.ts`:
   ```ts
   import { resolve } from 'path';
   
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: { '@': resolve(__dirname, 'src') },
     },
   });
   ```

**Decisión:** no usar aliases por ahora. Los imports relativos (`../hooks/useAuth`) son suficientemente legibles dado el tamaño del proyecto.

## Type-check rápido en watch

```sh
npx tsc -b --watch
```

Útil durante desarrollo para feedback inmediato sin esperar al bundle completo.

## Verificación de tipos antes de commit

```sh
npm run build   # tsc -b + vite build
```

Si solo se quiere typecheck sin bundle:

```sh
npx tsc -b
```

## Gotchas conocidos

- **`erasableSyntaxOnly: true` prohibe `enum`.** Si necesitas uno:
  ```ts
  export const Estado = { Activo: 'activo', Inactivo: 'inactivo' } as const;
  export type Estado = typeof Estado[keyof typeof Estado];
  ```
- **`verbatimModuleSyntax: true` requiere `import type`** para tipos. Si recibes el error `X is a type and must be imported using a type-only import`, la fix es:
  ```ts
  // ❌ Mal
  import { Categoria } from '../types/categoria.types';
  // ✅ Bien
  import type { Categoria } from '../types/categoria.types';
  ```
- **`@types/node` en `tsconfig.node.json` puede romper** si se importan APIs que no existen en el navegador. No mezclar configs.

## Resumen de buenas prácticas respetadas

- ✅ Project references separan app y build config.
- ✅ Flags estrictos activos.
- ✅ `import type` usado consistentemente.
- ✅ `noEmit` + Vite (no se hace doble bundling).
- ✅ `react-jsx` (sin imports manuales de React).

## Mejoras recomendadas

1. **Habilitar `tseslint.configs.recommendedTypeChecked`** en `eslint.config.js` para reglas de lint que requieren información de tipos.
2. **Añadir un `tsconfig.test.json`** cuando se introduzcan tests.
3. **Considerar `noUncheckedIndexedAccess: true`** para forzar checks en `array[i]`.
4. **Migrar `allowImportingTsExtensions` a `false`** si se quiere consistencia total (hoy está permitido por la combinación con `noEmit`).
