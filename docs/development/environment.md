# Desarrollo — Variables de entorno

El proyecto lee configuración de `.env` mediante `import.meta.env.*`. Las variables **deben** tener el prefijo `VITE_` para ser expuestas al cliente (Vite filtra el resto).

## Variables definidas

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `VITE_APP_NAME` | `string` | (de `.env`) | Nombre de la app. Se muestra en `<title>` y en `<Header>`. |
| `VITE_APP_VERSION` | `string` | (de `.env`) | Versión mostrada en el footer. |
| `VITE_APP_API_URL` | `string` | (de `.env`) | Base URL del backend. Se usa como `baseURL` en Axios. |

## Archivo `.env` (ejemplo actual)

```dotenv
VITE_APP_NAME=app-ventas
VITE_APP_VERSION=1.0.0
VITE_APP_API_URL=http://127.0.0.1:8000
```

⚠ **`.env` está commiteado al repositorio.** Si contiene secretos, **hay que añadirlo a `.gitignore`** y crear un `.env.example` con los placeholders. Hoy no hay secretos (las variables son públicas por diseño), pero la convención es no commitear `.env`.

## Tipado de `import.meta.env`

`src/vite-env.d.ts` redeclara `ImportMetaEnv` para añadir las claves custom:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

Si añades una variable nueva, **debes** añadirla aquí también, si no TypeScript se quejará.

## Cómo añadir una variable nueva

1. Añadir la clave en `.env`:
   ```dotenv
   VITE_APP_TIMEOUT=30000
   ```
2. Añadir el tipo en `src/vite-env.d.ts`:
   ```ts
   interface ImportMetaEnv {
       readonly VITE_APP_TIMEOUT: string;
   }
   ```
3. Usarla en código:
   ```ts
   const timeout = Number(import.meta.env.VITE_APP_TIMEOUT);
   ```

## Archivos `.env` por entorno

Vite carga estos archivos según el modo (de más a menos prioritario):

1. `.env.[mode].local` (e.g. `.env.production.local`)
2. `.env.[mode]` (e.g. `.env.production`)
3. `.env.local` (ignorado por git)
4. `.env`

**Convención recomendada:**

- `.env` → valores por defecto commiteados.
- `.env.development` → overrides para dev local.
- `.env.production` → overrides para build de producción.
- `.env.local` → overrides personales, en `.gitignore`.

Hoy el proyecto solo tiene `.env` (commiteado). Si se introduce variabilidad por entorno, crear los archivos adicionales.

## `.gitignore`

Asegúrate de que `.env.local` y `.env.*.local` estén en `.gitignore`:

```gitignore
.env.local
.env.*.local
```

## Uso en el código

### En `config/axios.ts`

```ts
const Api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});
```

### En `index.html` (no recomendado)

```html
<title>%VITE_APP_NAME%</title>
```

Esto funciona en build-time porque Vite reemplaza las variables.

## Gotchas

- ❌ **No** se puede usar `import.meta.env` en runtime dinámico que escape al bundle (e.g. `eval(import.meta.env.VITE_X)`). Vite hace la sustitución en build.
- ❌ **No** se pueden leer variables sin prefijo `VITE_`. Vite las filtra.
- ✅ Las variables son strings. Convertir a número con `Number(...)` o `parseInt(...)`.
- ✅ No hay validación de que las variables existan. Si falta `VITE_APP_API_URL`, axios hace requests a `baseURL: undefined` (URL inválida). Mejora: usar un `env.ts` que valide o tire al inicio.

## Mejoras recomendadas

1. **Crear `src/config/env.ts`** que centralice y valide las variables:
   ```ts
   const required = (name: string, value: string | undefined): string => {
       if (!value) throw new Error(`Missing env var: ${name}`);
       return value;
   };
   
   export const env = {
       apiUrl: required('VITE_APP_API_URL', import.meta.env.VITE_APP_API_URL),
       appName: import.meta.env.VITE_APP_NAME ?? 'app-ventas',
       appVersion: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
   } as const;
   ```
2. **Mover `.env` a `.env.example`** y añadir `.env` a `.gitignore`. Cada desarrollador copia `.env.example` → `.env`.
3. **Separar configs por entorno**: `.env.development`, `.env.production`.
