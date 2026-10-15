# Desarrollo — Docker

El proyecto incluye un único `Dockerfile` que **no produce una imagen de producción**: ejecuta el dev server de Vite dentro de un contenedor. Esto es válido para desarrollo remoto, pero **no debe desplegarse así a producción**.

## `Dockerfile` actual

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### Análisis

| Línea | Comentario |
|---|---|
| `FROM node:24-alpine` | Imagen base liviana con Node 24. |
| `WORKDIR /app` | Directorio de trabajo. |
| `COPY package*.json ./` | Copia `package.json` y `package-lock.json` para cachear `npm install`. |
| `RUN npm install` | **⚠** Usa `npm install` (no `npm ci`). No determinista — puede generar un `package-lock.json` distinto en cada build. Mejor: `npm ci`. |
| `COPY . .` | Copia todo el proyecto al contenedor (incluye `.env`, `.git`, `node_modules` si no hay `.dockerignore`). |
| `EXPOSE 5173` | Documenta el puerto. No abre nada por sí mismo. |
| `CMD npm run dev -- --host` | Ejecuta Vite en modo dev, escuchando en `0.0.0.0` para que sea accesible desde fuera del contenedor. |

## Problemas identificados

1. **No es una imagen de producción.** El dev server incluye HMR, source maps, código no minificado. **No usar en prod.**
2. **Sin `.dockerignore`.** El contexto del build incluye `.env`, `.git`, `node_modules`, `dist`, etc. → imagen inflada, secretos filtrados.
3. **`npm install` en vez de `npm ci`.** No respeta el lockfile.
4. **Sin usuario no-root.** El contenedor corre como `root` (default). Riesgo de seguridad.
5. **Sin multi-stage build.** No hay separación entre "compilar" y "servir".
6. **Versiones pre-release de las dependencias** (`vite@^8.0.10`, `eslint@^10.2.1`, etc.) — si el `npm install` falla, el build de Docker falla. Ver [`operations/troubleshooting.md`](../operations/troubleshooting.md).

## Build & run (modo dev)

```sh
docker build -t app-ventas-client:dev .
docker run --rm -p 5173:5173 --name app-ventas app-ventas-client:dev
```

Abrir `http://localhost:5173`. El dev server queda corriendo con HMR.

## `.dockerignore` recomendado

Crear un archivo `.dockerignore` en la raíz:

```gitignore
# Node
node_modules
npm-debug.log
yarn-error.log
.npm

# Build
dist
build

# Env
.env
.env.local
.env.*.local

# Git
.git
.gitignore
.github

# Editor
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docs (no se sirven en runtime)
docs/

# Docker
Dockerfile
docker-compose*.yml
.dockerignore
```

## Dockerfile de producción (recomendado)

```dockerfile
# ---- Build stage ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

# Copia el bundle al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración opcional de nginx (SPA fallback a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf` para SPA

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # SPA fallback: todas las rutas -> index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache agresivo para assets con hash
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build & run (modo producción)

```sh
docker build -f Dockerfile.prod -t app-ventas-client:prod .
docker run --rm -p 8080:80 --name app-ventas app-ventas-client:prod
```

Abrir `http://localhost:8080`.

## docker-compose opcional

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src  # HMR: monta el código fuente
    environment:
      - VITE_APP_API_URL=http://host.docker.internal:8000
```

`host.docker.internal` permite que el contenedor (Linux) alcance servicios en el host (e.g. backend Laravel en `127.0.0.1:8000`).

## Renombrado recomendado

- `Dockerfile` → `Dockerfile.dev` (para el dev server actual).
- `Dockerfile.prod` → para el build multi-stage con nginx.

Así queda claro desde el nombre cuál usar.

## Decisión de diseño

Hoy el equipo usa el `Dockerfile` para levantar un entorno de desarrollo contenedorizado (consistente entre máquinas). Si la decisión es **solo-dev**, renombrar a `Dockerfile.dev` y dejar claro que **no se despliega**. Si la decisión es **dev + prod**, añadir el multi-stage y un script de deploy.

## Resumen

- **Hoy:** dev server en contenedor. Útil para desarrollo, **no para producción**.
- **Recomendado:** multi-stage con nginx para producción.
- **Crítico:** añadir `.dockerignore`.
- **Recomendado:** cambiar a `npm ci` y usuario no-root.
