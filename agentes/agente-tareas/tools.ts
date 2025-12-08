// tools.ts
// Definición e implementación de herramientas MCP

import { Tool } from "../shared/llm-client.js";
import { MCPClient } from "../../mcp-client.js";

// Clientes MCP (se inicializarán en main)
let mcpClients: { notas: MCPClient; utils: MCPClient } | null = null;

export function setMcpClients(clients: { notas: MCPClient; utils: MCPClient } | null) {
  mcpClients = clients;
}

// Función para obtener herramientas disponibles de MCPs
export async function getMCPTools(): Promise<Tool[]> {
  if (!mcpClients) {
    throw new Error("Clientes MCP no inicializados");
  }

  const tools: Tool[] = [];

  try {
    // Herramientas de notas
    const notasTools = await mcpClients.notas.listTools();
    for (const tool of notasTools) {
      tools.push({
        name: `notas_${tool.name}`,
        description: tool.description,
        parameters: tool.inputSchema
      });
    }

    // Herramientas de utilidades
    const utilsTools = await mcpClients.utils.listTools();
    for (const tool of utilsTools) {
      tools.push({
        name: `utils_${tool.name}`,
        description: tool.description,
        parameters: tool.inputSchema
      });
    }
  } catch (error) {
    console.error("Error obteniendo herramientas MCP:", error);
    // Fallback: herramientas básicas simuladas
    tools.push(
      {
        name: "notas_crear_nota",
        description: "Crea una nueva nota con título y contenido",
        parameters: {
          type: "object",
          properties: {
            titulo: { type: "string", description: "Título único de la nota" },
            contenido: { type: "string", description: "Contenido de la nota" }
          },
          required: ["titulo", "contenido"]
        }
      },
      {
        name: "utils_calcular",
        description: "Realiza operaciones matemáticas básicas",
        parameters: {
          type: "object",
          properties: {
            operacion: { type: "string", enum: ["sumar", "restar", "multiplicar", "dividir"] },
            a: { type: "number", description: "Primer número" },
            b: { type: "number", description: "Segundo número" }
          },
          required: ["operacion", "a", "b"]
        }
      }
    );
  }

  return tools;
}

// ============================================
// Implementación de las tools via MCP
// ============================================

export async function ejecutarTool(nombre: string, inputs: Record<string, unknown>): Promise<string> {
  if (!mcpClients) {
    return "❌ Clientes MCP no inicializados";
  }

  try {
    // Routing basado en prefijo del nombre
    if (nombre.startsWith("notas_")) {
      const toolName = nombre.replace("notas_", "");
      const response = await mcpClients.notas.callTool(toolName, inputs);
      return response.content.map(c => c.text).join("\n");
    } else if (nombre.startsWith("utils_")) {
      const toolName = nombre.replace("utils_", "");
      const response = await mcpClients.utils.callTool(toolName, inputs);
      return response.content.map(c => c.text).join("\n");
    } else {
      // Fallback para herramientas simuladas (por si no hay MCP)
      return ejecutarToolFallback(nombre, inputs);
    }
  } catch (error) {
    console.error(`Error ejecutando herramienta ${nombre}:`, error);
    return `❌ Error ejecutando herramienta ${nombre}: ${error}`;
  }
}

// Fallback para herramientas simuladas (cuando MCP no está disponible)
function ejecutarToolFallback(nombre: string, inputs: Record<string, unknown>): string {
  switch (nombre) {
    case "obtener_clima": {
      const ciudad = inputs.ciudad as string;
      const climas = ["☀️ soleado", "🌧️ lluvioso", "⛅ parcialmente nublado", "🌤️ despejado"];
      const clima = climas[Math.floor(Math.random() * climas.length)];
      const temp = Math.floor(Math.random() * 20) + 10;
      return `En ${ciudad}: ${temp}°C, ${clima}`;
    }

    case "crear_recordatorio": {
      const mensaje = inputs.mensaje as string;
      const hora = inputs.hora as string;
      return `✅ Recordatorio creado: '${mensaje}' programado para las ${hora}`;
    }

    case "buscar_contacto": {
      const nombre = inputs.nombre as string;
      // Simulamos una base de datos de contactos
      const contactos: Record<string, string> = {
        "juan": "Juan García - Tel: 666-111-222 - Email: juan@empresa.com",
        "maria": "María López - Tel: 666-333-444 - Email: maria@empresa.com",
        "pedro": "Pedro Sánchez - Tel: 666-555-666 - Email: pedro@empresa.com"
      };
      const key = nombre.toLowerCase();
      const match = Object.entries(contactos).find(([k]) => k.includes(key));
      return match ? match[1] : `No se encontró ningún contacto con el nombre '${nombre}'`;
    }

    default:
      return `❌ Tool '${nombre}' no encontrada`;
  }
}