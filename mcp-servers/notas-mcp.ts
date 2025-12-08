// notas-mcp.ts
// MCP Server para gestionar notas usando el SDK oficial de MCP con persistencia JSON

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Crear servidor MCP
const server = new Server(
  {
    name: "Servidor de Notas",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ============================================
// Configuración de persistencia
// ============================================
const NOTAS_FILE = process.env.NOTAS_FILE_PATH || path.join(process.cwd(), "notas.json");

interface NotaData {
  contenido: string;
  creadaEn: string; // ISO string
  actualizadaEn: string; // ISO string
  encriptado?: boolean; // Indica si el contenido está en Base64
}

interface NotasJSON {
  notas: Record<string, NotaData>;
  metadata: {
    version: string;
    ultimaModificacion: string;
  };
}

// ============================================
// Funciones de persistencia JSON
// ============================================

async function cargarNotas(): Promise<Map<string, { contenido: string; creadaEn: Date; actualizadaEn: Date; encriptado: boolean }>> {
  const notas = new Map<string, { contenido: string; creadaEn: Date; actualizadaEn: Date; encriptado: boolean }>();

  try {
    if (!existsSync(NOTAS_FILE)) {
      console.error(`📄 Archivo ${NOTAS_FILE} no existe, empezando con base de datos vacía`);
      return notas;
    }

    const data = await readFile(NOTAS_FILE, "utf-8");
    const parsed: NotasJSON = JSON.parse(data);

    // Validar estructura básica
    if (!parsed.notas || typeof parsed.notas !== "object") {
      throw new Error("Estructura de archivo inválida");
    }

    // Convertir datos del JSON al formato interno
    for (const [titulo, notaData] of Object.entries(parsed.notas)) {
      // Decodificar contenido si está encriptado en Base64
      const contenido = notaData.encriptado
        ? Buffer.from(notaData.contenido, "base64").toString("utf-8")
        : notaData.contenido;

      notas.set(titulo, {
        contenido,
        creadaEn: new Date(notaData.creadaEn),
        actualizadaEn: new Date(notaData.actualizadaEn),
        encriptado: notaData.encriptado || false
      });
    }

    console.error(`📄 Cargadas ${notas.size} notas desde ${NOTAS_FILE}`);
  } catch (error) {
    console.error(`❌ Error cargando notas desde ${NOTAS_FILE}:`, error);
    console.error("🔄 Continuando con base de datos vacía");
  }

  return notas;
}

async function guardarNotas(notas: Map<string, { contenido: string; creadaEn: Date; actualizadaEn: Date; encriptado: boolean }>): Promise<void> {
  try {
    // Convertir Map al formato JSON (codificar contenido a Base64 si no está encriptado)
    const notasObj: Record<string, NotaData> = {};
    for (const [titulo, nota] of notas.entries()) {
      // Solo codificar si no está ya encriptado
      const contenido = nota.encriptado
        ? nota.contenido // Ya está en Base64
        : Buffer.from(nota.contenido).toString("base64");

      notasObj[titulo] = {
        contenido,
        creadaEn: nota.creadaEn.toISOString(),
        actualizadaEn: nota.actualizadaEn.toISOString(),
        encriptado: true // Todas las notas guardadas estarán encriptadas
      };
    }

    const data: NotasJSON = {
      notas: notasObj,
      metadata: {
        version: "1.0",
        ultimaModificacion: new Date().toISOString()
      }
    };

    // Crear directorio si no existe (aunque debería existir)
    await writeFile(NOTAS_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.error(`💾 Guardadas ${notas.size} notas en ${NOTAS_FILE}`);
  } catch (error) {
    console.error(`❌ Error guardando notas en ${NOTAS_FILE}:`, error);
    throw error; // Re-throw para que el caller sepa que falló
  }
}

// Base de datos en memoria (se carga desde JSON al iniciar)
let notas: Map<string, { contenido: string; creadaEn: Date; actualizadaEn: Date; encriptado: boolean }>;

// ============================================
// Definir herramientas disponibles
// ============================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "crear_nota",
        description: "Crea una nueva nota con título y contenido",
        inputSchema: {
          type: "object",
          properties: {
            titulo: {
              type: "string",
              description: "Título único de la nota"
            },
            contenido: {
              type: "string",
              description: "Contenido de la nota"
            }
          },
          required: ["titulo", "contenido"]
        }
      },
      {
        name: "listar_notas",
        description: "Lista todas las notas disponibles con sus títulos y fechas",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "leer_nota",
        description: "Lee el contenido completo de una nota por su título",
        inputSchema: {
          type: "object",
          properties: {
            titulo: {
              type: "string",
              description: "Título de la nota a leer"
            }
          },
          required: ["titulo"]
        }
      },
      {
        name: "actualizar_nota",
        description: "Actualiza el contenido de una nota existente",
        inputSchema: {
          type: "object",
          properties: {
            titulo: {
              type: "string",
              description: "Título de la nota a actualizar"
            },
            contenido: {
              type: "string",
              description: "Nuevo contenido de la nota"
            }
          },
          required: ["titulo", "contenido"]
        }
      },
      {
        name: "borrar_nota",
        description: "Elimina una nota por su título",
        inputSchema: {
          type: "object",
          properties: {
            titulo: {
              type: "string",
              description: "Título de la nota a eliminar"
            }
          },
          required: ["titulo"]
        }
      },
      {
        name: "buscar_notas",
        description: "Busca notas que contengan un texto específico en su título o contenido",
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
    case "crear_nota": {
      const { titulo, contenido } = args as { titulo: string; contenido: string };

      if (notas.has(titulo)) {
        return {
          content: [{ type: "text", text: `⚠️ Ya existe una nota con el título '${titulo}'. Usa 'actualizar_nota' para modificarla.` }]
        };
      }

      const ahora = new Date();
      notas.set(titulo, {
        contenido,
        creadaEn: ahora,
        actualizadaEn: ahora,
        encriptado: false // Las notas nuevas empiezan sin encriptar, se encriptan al guardar
      });

      // Guardar cambios en JSON
      await guardarNotas(notas);

      return {
        content: [{ type: "text", text: `✅ Nota '${titulo}' creada correctamente` }]
      };
    }

    case "listar_notas": {
      if (notas.size === 0) {
        return {
          content: [{ type: "text", text: "📭 No hay notas guardadas" }]
        };
      }

      const lista = Array.from(notas.entries())
        .map(([titulo, nota]) => {
          const fecha = nota.actualizadaEn.toLocaleDateString("es-ES");
          return `📝 ${titulo} (actualizada: ${fecha})`;
        })
        .join("\n");

      return {
        content: [{ type: "text", text: `📋 Notas guardadas (${notas.size}):\n${lista}` }]
      };
    }

    case "leer_nota": {
      const { titulo } = args as { titulo: string };
      const nota = notas.get(titulo);

      if (!nota) {
        const disponibles = Array.from(notas.keys()).join(", ") || "ninguna";
        return {
          content: [{ type: "text", text: `❌ No existe la nota '${titulo}'. Notas disponibles: ${disponibles}` }]
        };
      }

      const contenido = `📄 **${titulo}**\n\n${nota.contenido}\n\n---\n_Creada: ${nota.creadaEn.toLocaleString("es-ES")}_\n_Actualizada: ${nota.actualizadaEn.toLocaleString("es-ES")}_`;

      return {
        content: [{ type: "text", text: contenido }]
      };
    }

    case "actualizar_nota": {
      const { titulo, contenido } = args as { titulo: string; contenido: string };
      const nota = notas.get(titulo);

      if (!nota) {
        return {
          content: [{ type: "text", text: `❌ No existe la nota '${titulo}'. Usa 'crear_nota' para crear una nueva.` }]
        };
      }

      nota.contenido = contenido;
      nota.actualizadaEn = new Date();

      // Guardar cambios en JSON
      await guardarNotas(notas);

      return {
        content: [{ type: "text", text: `✅ Nota '${titulo}' actualizada correctamente` }]
      };
    }

    case "borrar_nota": {
      const { titulo } = args as { titulo: string };

      if (!notas.has(titulo)) {
        return {
          content: [{ type: "text", text: `❌ No existe la nota '${titulo}'` }]
        };
      }

      notas.delete(titulo);

      // Guardar cambios en JSON
      await guardarNotas(notas);

      return {
        content: [{ type: "text", text: `🗑️ Nota '${titulo}' eliminada correctamente` }]
      };
    }

    case "buscar_notas": {
      const { termino } = args as { termino: string };
      const terminoLower = termino.toLowerCase();

      const resultados = Array.from(notas.entries())
        .filter(([titulo, nota]) =>
          titulo.toLowerCase().includes(terminoLower) ||
          nota.contenido.toLowerCase().includes(terminoLower)
        )
        .map(([titulo]) => `🔎 ${titulo}`);

      if (resultados.length === 0) {
        return {
          content: [{ type: "text", text: `🔍 No se encontraron notas que contengan '${termino}'` }]
        };
      }

      return {
        content: [{ type: "text", text: `🔍 Resultados para '${termino}' (${resultados.length}):\n${resultados.join("\n")}` }]
      };
    }

    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
});

// ============================================
// Iniciar servidor
// ============================================
async function main() {
  console.error("🚀 Servidor MCP de Notas iniciado");

  // Cargar notas desde archivo JSON
  notas = await cargarNotas();

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Servidor MCP de Notas conectado");
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});