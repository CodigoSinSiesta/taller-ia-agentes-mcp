"""
Gestor de Marcadores MCP - usando FastMCP
Ejemplo práctico para el taller: equivale a ~150 líneas con el SDK oficial de TypeScript.
"""

import json
import uuid
from datetime import datetime

from fastmcp import FastMCP

mcp = FastMCP("Marcadores 📚")

# Almacenamiento en memoria: id -> marcador
marcadores: dict[str, dict] = {}


@mcp.tool
def agregar_marcador(
    url: str, titulo: str, categoria: str = "general", descripcion: str = ""
) -> str:
    """Añade un nuevo marcador con URL, título y categoría opcional."""
    id_marcador = str(uuid.uuid4())
    marcadores[id_marcador] = {
        "url": url,
        "titulo": titulo,
        "categoria": categoria,
        "descripcion": descripcion,
        "creado_en": datetime.now().isoformat(),
    }
    return f"✅ Marcador '{titulo}' guardado con ID: {id_marcador}"


@mcp.tool
def buscar_marcadores(termino: str) -> str:
    """Busca marcadores por término en título, URL, categoría o descripción."""
    termino_lower = termino.lower()
    resultados = [
        m
        for m in marcadores.values()
        if termino_lower in m["titulo"].lower()
        or termino_lower in m["url"].lower()
        or termino_lower in m["categoria"].lower()
        or termino_lower in m.get("descripcion", "").lower()
    ]
    if not resultados:
        return f"🔍 No se encontraron marcadores con '{termino}'"
    lista = "\n".join(f"📌 {m['titulo']} - {m['url']}" for m in resultados)
    return f"🔍 Resultados para '{termino}' ({len(resultados)}):\n{lista}"


@mcp.tool
def eliminar_marcador(id_marcador: str) -> str:
    """Elimina un marcador por su ID."""
    if id_marcador not in marcadores:
        return f"❌ No existe marcador con ID '{id_marcador}'"
    titulo = marcadores[id_marcador]["titulo"]
    del marcadores[id_marcador]
    return f"🗑️ Marcador '{titulo}' eliminado"


@mcp.resource("marcadores://todos")
def listar_todos() -> str:
    """Lista todos los marcadores guardados como JSON."""
    return json.dumps(list(marcadores.values()), ensure_ascii=False, indent=2)


@mcp.resource("marcadores://{id_marcador}")
def obtener_marcador(id_marcador: str) -> str:
    """Obtiene el detalle de un marcador por su ID."""
    if id_marcador not in marcadores:
        return json.dumps({"error": f"Marcador '{id_marcador}' no encontrado"})
    return json.dumps(marcadores[id_marcador], ensure_ascii=False, indent=2)


@mcp.prompt
def organizar_marcadores(criterio: str = "categoria") -> str:
    """Genera un prompt para organizar los marcadores según un criterio."""
    return (
        f"Tengo {len(marcadores)} marcadores guardados. "
        f"Por favor, organízalos por {criterio} y sugiere una estructura de categorías más clara."
    )


if __name__ == "__main__":
    mcp.run()
