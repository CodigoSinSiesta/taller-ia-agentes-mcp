// marcadores-mcp.ts
// MCP Server para gestionar marcadores (bookmarks) usando el SDK oficial de MCP

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Crear servidor MCP
const server = new Server(
  {
    name: "Servidor de Marcadores",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ============================================
// Tipos y almacenamiento
// ============================================

interface Marcador {
  url: string;
  titulo: string;
  categoria: string;
  descripcion?: string;
  creadoEn: Date;
}

// Base de datos en memoria — exportada para testing
export const marcadores = new Map<string, Marcador>();

// ============================================
// Handlers exportados para unit testing
// ============================================

export function handleAgregarMarcador(
  url: string,
  titulo: string,
  categoria = "general",
  descripcion?: string
): { id: string; text: string } {
  const id = crypto.randomUUID();
  marcadores.set(id, { url, titulo, categoria, descripcion, creadoEn: new Date() });
  return { id, text: `✅ Marcador '${titulo}' guardado con ID: ${id}` };
}

export function handleBuscarMarcadores(termino: string): string {
  const terminoLower = termino.toLowerCase();

  const resultados = Array.from(marcadores.entries())
    .filter(([, m]) =>
      m.titulo.toLowerCase().includes(terminoLower) ||
      m.url.toLowerCase().includes(terminoLower) ||
      m.categoria.toLowerCase().includes(terminoLower) ||
      (m.descripcion?.toLowerCase().includes(terminoLower) ?? false)
    )
    .map(([, m]) => `📌 ${m.titulo} - ${m.url}`);

  if (resultados.length === 0) {
    return `🔍 No se encontraron marcadores con '${termino}'`;
  }

  return `🔍 Resultados para '${termino}' (${resultados.length}):\n${resultados.join("\n")}`;
}

export function handleEliminarMarcador(id: string): string {
  const marcador = marcadores.get(id);

  if (!marcador) {
    return `❌ No existe marcador con ID '${id}'`;
  }

  marcadores.delete(id);
  return `🗑️ Marcador '${marcador.titulo}' eliminado`;
}

export function handleListarMarcadores(): string {
  if (marcadores.size === 0) {
    return "📭 No hay marcadores guardados";
  }

  const lista = Array.from(marcadores.values())
    .map(m => `📌 ${m.titulo} - ${m.url} [${m.categoria}]`)
    .join("\n");

  return `📋 Marcadores guardados (${marcadores.size}):\n${lista}`;
}

export function handleListarCategorias(): string {
  if (marcadores.size === 0) {
    return "📭 No hay marcadores guardados";
  }

  const conteo = new Map<string, number>();
  for (const m of marcadores.values()) {
    conteo.set(m.categoria, (conteo.get(m.categoria) ?? 0) + 1);
  }

  const lista = Array.from(conteo.entries())
    .map(([cat, n]) => `🏷️ ${cat} (${n})`)
    .join("\n");

  return `📂 Categorías (${conteo.size}):\n${lista}`;
}

// ============================================
// Definir herramientas disponibles
// ============================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "agregar_marcador",
        description: "Guarda un nuevo marcador con URL, título, categoría y descripción opcional",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL del marcador"
            },
            titulo: {
              type: "string",
              description: "Título descriptivo del marcador"
            },
            categoria: {
              type: "string",
              description: "Categoría del marcador (por defecto: general)"
            },
            descripcion: {
              type: "string",
              description: "Descripción opcional del marcador"
            }
          },
          required: ["url", "titulo"]
        }
      },
      {
        name: "buscar_marcadores",
        description: "Busca marcadores por título, URL, categoría o descripción",
        inputSchema: {
          type: "object",
          properties: {
            termino: {
              type: "string",
              description: "Término de búsqueda"
            }
          },
          required: ["termino"]
        }
      },
      {
        name: "eliminar_marcador",
        description: "Elimina un marcador por su ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID del marcador a eliminar"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "listar_marcadores",
        description: "Lista todos los marcadores guardados con título, URL y categoría",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "listar_categorias",
        description: "Lista las categorías únicas de marcadores con su conteo",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// ============================================
// Manejar llamadas a herramientas
// ============================================
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "agregar_marcador": {
      const { url, titulo, categoria, descripcion } = args as {
        url: string;
        titulo: string;
        categoria?: string;
        descripcion?: string;
      };
      const result = handleAgregarMarcador(url, titulo, categoria, descripcion);
      return { content: [{ type: "text", text: result.text }] };
    }

    case "buscar_marcadores": {
      const { termino } = args as { termino: string };
      return { content: [{ type: "text", text: handleBuscarMarcadores(termino) }] };
    }

    case "eliminar_marcador": {
      const { id } = args as { id: string };
      return { content: [{ type: "text", text: handleEliminarMarcador(id) }] };
    }

    case "listar_marcadores": {
      return { content: [{ type: "text", text: handleListarMarcadores() }] };
    }

    case "listar_categorias": {
      return { content: [{ type: "text", text: handleListarCategorias() }] };
    }

    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
});

// ============================================
// Iniciar servidor
// ============================================
async function main() {
  console.error("🚀 Servidor MCP de Marcadores iniciado");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Servidor MCP de Marcadores conectado");
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
