# Marcadores MCP - Python FastMCP

Servidor MCP de gestión de marcadores usando Python FastMCP.

## Setup

```bash
# Crear entorno virtual e instalar dependencias (recomendado con uv)
uv venv .venv
uv pip install fastmcp pytest

# Activar entorno
source .venv/bin/activate
```

## Uso

```bash
# Iniciar el servidor
python server.py

# Ejecutar tests
pytest test_server.py -v
# o directamente con uv:
.venv/bin/pytest test_server.py -v
```

## Herramientas disponibles

| Tool | Descripción |
|------|-------------|
| `agregar_marcador` | Añade un marcador (url, titulo, categoria) |
| `buscar_marcadores` | Busca marcadores por término |
| `eliminar_marcador` | Elimina un marcador por ID |

## Recursos

| Resource URI | Descripción |
|-------------|-------------|
| `marcadores://todos` | Lista todos los marcadores |
| `marcadores://{id}` | Detalle de un marcador |
