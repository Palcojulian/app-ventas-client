# Ejecución del proyecto

## Requisitos

Para ejecutar el proyecto necesitas tener instalado:

* Docker
* Docker Compose

Verifica las instalaciones:

```bash
docker --version
docker compose version
```

## Entornos

El proyecto cuenta con dos configuraciones de Docker:

| Archivo          | Entorno              | Uso                                     |
| ---------------- | -------------------- | --------------------------------------- |
| `Dockerfile.dev` | Pruebas / Desarrollo | Ejecutar y probar cambios localmente    |
| `Dockerfile`     | Producción           | Construir la aplicación para producción |

---

# 🧪 Entorno de pruebas / desarrollo

Para ejecutar el proyecto utilizando `Dockerfile.dev`:

```bash
docker build -f Dockerfile.dev -t proyecto-dev .
```

Luego inicia el contenedor:

```bash
docker run --name proyecto-dev -p 5173:5173 proyecto-dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

### Ejecutar en segundo plano

También puedes iniciar el contenedor en segundo plano:

```bash
docker run -d --name proyecto-dev -p 5173:5173 proyecto-dev
```

### Ver los logs

```bash
docker logs -f proyecto-dev
```

### Detener el contenedor

```bash
docker stop proyecto-dev
```

### Eliminar el contenedor

```bash
docker rm proyecto-dev
```

---

# 🚀 Entorno de producción

Pendiente configuracion:

---