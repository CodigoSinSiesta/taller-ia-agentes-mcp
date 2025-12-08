// utils-mcp.ts
// MCP Server de utilidades usando el SDK oficial de MCP

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Crear servidor MCP
const server = new Server(
  {
    name: "Utilidades",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ============================================
// Definir herramientas disponibles
// ============================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calcular",
        description: "Realiza operaciones matemáticas básicas entre dos números",
        inputSchema: {
          type: "object",
          properties: {
            operacion: {
              type: "string",
              enum: ["sumar", "restar", "multiplicar", "dividir"],
              description: "Operación a realizar"
            },
            a: {
              type: "number",
              description: "Primer número"
            },
            b: {
              type: "number",
              description: "Segundo número"
            }
          },
          required: ["operacion", "a", "b"]
        }
      },
      {
        name: "generar_uuid",
        description: "Genera uno o más identificadores únicos UUID v4",
        inputSchema: {
          type: "object",
          properties: {
            cantidad: {
              type: "number",
              minimum: 1,
              maximum: 10,
              default: 1,
              description: "Cantidad de UUIDs a generar (1-10)"
            }
          }
        }
      },
      {
        name: "timestamp",
        description: "Obtiene la fecha y hora actual en diferentes formatos",
        inputSchema: {
          type: "object",
          properties: {
            formato: {
              type: "string",
              enum: ["iso", "unix", "legible", "fecha", "hora"],
              default: "legible",
              description: "Formato de salida"
            },
            zona_horaria: {
              type: "string",
              default: "Europe/Madrid",
              description: "Zona horaria (ej: Europe/Madrid, America/New_York)"
            }
          }
        }
      },
      {
        name: "convertir_unidades",
        description: "Convierte valores entre diferentes unidades de medida",
        inputSchema: {
          type: "object",
          properties: {
            valor: {
              type: "number",
              description: "Valor a convertir"
            },
            tipo: {
              type: "string",
              enum: ["temperatura", "longitud", "peso"],
              description: "Tipo de conversión"
            },
            de: {
              type: "string",
              description: "Unidad de origen"
            },
            a: {
              type: "string",
              description: "Unidad de destino"
            }
          },
          required: ["valor", "tipo", "de", "a"]
        }
      },
      {
        name: "generar_password",
        description: "Genera una contraseña segura aleatoria",
        inputSchema: {
          type: "object",
          properties: {
            longitud: {
              type: "number",
              minimum: 8,
              maximum: 64,
              default: 16,
              description: "Longitud de la contraseña (8-64)"
            },
            incluir_simbolos: {
              type: "boolean",
              default: true,
              description: "Incluir símbolos especiales"
            },
            incluir_numeros: {
              type: "boolean",
              default: true,
              description: "Incluir números"
            },
            incluir_mayusculas: {
              type: "boolean",
              default: true,
              description: "Incluir letras mayúsculas"
            }
          }
        }
      },
      {
        name: "base64",
        description: "Codifica o decodifica texto en Base64",
        inputSchema: {
          type: "object",
          properties: {
            accion: {
              type: "string",
              enum: ["codificar", "decodificar"],
              description: "Acción a realizar"
            },
            texto: {
              type: "string",
              description: "Texto a procesar"
            }
          },
          required: ["accion", "texto"]
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
    case "calcular": {
      const { operacion, a, b } = args as { operacion: string; a: number; b: number };

      const operaciones: Record<string, () => number> = {
        sumar: () => a + b,
        restar: () => a - b,
        multiplicar: () => a * b,
        dividir: () => b !== 0 ? a / b : NaN
      };

      const resultado = operaciones[operacion]();
      const simbolos: Record<string, string> = {
        sumar: "+",
        restar: "-",
        multiplicar: "×",
        dividir: "÷"
      };

      if (isNaN(resultado)) {
        return {
          content: [{ type: "text", text: "❌ Error: División por cero" }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `🔢 ${a} ${simbolos[operacion]} ${b} = ${resultado}`
        }]
      };
    }

    case "generar_uuid": {
      const { cantidad = 1 } = args as { cantidad?: number };
      const uuids = Array.from({ length: cantidad }, () => crypto.randomUUID());

      const texto = cantidad === 1
        ? `🆔 UUID: ${uuids[0]}`
        : `🆔 UUIDs generados:\n${uuids.map((u, i) => `   ${i + 1}. ${u}`).join("\n")}`;

      return {
        content: [{ type: "text", text: texto }]
      };
    }

    case "timestamp": {
      const { formato = "legible", zona_horaria = "Europe/Madrid" } = args as { formato?: string; zona_horaria?: string };
      const ahora = new Date();

      const formatos: Record<string, string> = {
        iso: ahora.toISOString(),
        unix: Math.floor(ahora.getTime() / 1000).toString(),
        legible: ahora.toLocaleString("es-ES", { timeZone: zona_horaria }),
        fecha: ahora.toLocaleDateString("es-ES", { timeZone: zona_horaria }),
        hora: ahora.toLocaleTimeString("es-ES", { timeZone: zona_horaria })
      };

      return {
        content: [{ type: "text", text: `🕐 ${formatos[formato]}` }]
      };
    }

    case "convertir_unidades": {
      const { valor, tipo, de, a } = args as { valor: number; tipo: string; de: string; a: string };

      // Conversiones de temperatura
      const tempConversiones: Record<string, Record<string, (v: number) => number>> = {
        celsius: {
          fahrenheit: (v) => (v * 9/5) + 32,
          kelvin: (v) => v + 273.15
        },
        fahrenheit: {
          celsius: (v) => (v - 32) * 5/9,
          kelvin: (v) => (v - 32) * 5/9 + 273.15
        },
        kelvin: {
          celsius: (v) => v - 273.15,
          fahrenheit: (v) => (v - 273.15) * 9/5 + 32
        }
      };

      // Conversiones de longitud (todo a metros y de vuelta)
      const longitudFactores: Record<string, number> = {
        metros: 1,
        kilometros: 1000,
        centimetros: 0.01,
        milimetros: 0.001,
        millas: 1609.344,
        pies: 0.3048,
        pulgadas: 0.0254
      };

      // Conversiones de peso (todo a gramos y de vuelta)
      const pesoFactores: Record<string, number> = {
        gramos: 1,
        kilogramos: 1000,
        miligramos: 0.001,
        libras: 453.592,
        onzas: 28.3495
      };

      let resultado: number | null = null;

      if (tipo === "temperatura") {
        const conversion = tempConversiones[de.toLowerCase()]?.[a.toLowerCase()];
        if (conversion) {
          resultado = conversion(valor);
        }
      } else if (tipo === "longitud") {
        const factorDe = longitudFactores[de.toLowerCase()];
        const factorA = longitudFactores[a.toLowerCase()];
        if (factorDe && factorA) {
          resultado = (valor * factorDe) / factorA;
        }
      } else if (tipo === "peso") {
        const factorDe = pesoFactores[de.toLowerCase()];
        const factorA = pesoFactores[a.toLowerCase()];
        if (factorDe && factorA) {
          resultado = (valor * factorDe) / factorA;
        }
      }

      if (resultado === null) {
        return {
          content: [{ type: "text", text: `❌ Conversión no soportada: ${de} → ${a}` }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `📐 ${valor} ${de} = ${resultado.toFixed(4)} ${a}`
        }]
      };
    }

    case "generar_password": {
      const {
        longitud = 16,
        incluir_simbolos = true,
        incluir_numeros = true,
        incluir_mayusculas = true
      } = args as { longitud?: number; incluir_simbolos?: boolean; incluir_numeros?: boolean; incluir_mayusculas?: boolean };

      let caracteres = "abcdefghijklmnopqrstuvwxyz";

      if (incluir_mayusculas) caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (incluir_numeros) caracteres += "0123456789";
      if (incluir_simbolos) caracteres += "!@#$%^&*()_+-=[]{}|;:,.<>?";

      const array = new Uint32Array(longitud);
      crypto.getRandomValues(array);

      const password = Array.from(array)
        .map(n => caracteres[n % caracteres.length])
        .join("");

      return {
        content: [{ type: "text", text: `🔐 Contraseña generada: ${password}` }]
      };
    }

    case "base64": {
      const { accion, texto } = args as { accion: string; texto: string };

      try {
        const resultado = accion === "codificar"
          ? Buffer.from(texto).toString("base64")
          : Buffer.from(texto, "base64").toString("utf-8");

        return {
          content: [{
            type: "text",
            text: `🔄 ${accion === "codificar" ? "Codificado" : "Decodificado"}:\n${resultado}`
          }]
        };
      } catch {
        return {
          content: [{ type: "text", text: "❌ Error: Texto inválido para la operación" }]
        };
      }
    }

    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
});

// ============================================
// Iniciar servidor
// ============================================
async function main() {
  console.error("🚀 Servidor MCP de Utilidades iniciado");

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Servidor MCP de Utilidades conectado");
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
