// index.ts
// Main del agente de tareas

import "dotenv/config";
import { createMCPClients } from "../../mcp-client.js";
import { setMcpClients } from "./tools.js";
import { ejecutarAgente } from "./agent-loop.js";
import { Provider } from "../shared/llm-client.js";

// ============================================
// Main
// ============================================

async function main() {
  // Obtener provider de argumentos o variable de entorno
  const providerArg = process.argv.find(arg => arg.startsWith("--provider="));
  const provider = providerArg?.split("=")[1] as Provider | undefined;

  console.log("\n🚀 DEMO: Agente de Tareas con MCPs\n");

  // Inicializar clientes MCP
  console.log("🔌 Inicializando servidores MCP...");
  const mcpClients = createMCPClients();
  setMcpClients(mcpClients);

  try {
    await mcpClients.notas.start();
    await mcpClients.utils.start();
    console.log("✅ Servidores MCP inicializados\n");
  } catch (error) {
    console.error("❌ Error inicializando MCPs, continuando con herramientas simuladas:", error);
    setMcpClients(null);
  }

  // Ejemplo 1: Gestión de notas
  await ejecutarAgente("Crea una nota llamada 'Reunión mañana' con el contenido 'Preparar presentación del proyecto IA'", provider);

  console.log("\n");

  // Ejemplo 2: Utilidades + notas
  await ejecutarAgente(
    "Genera un UUID y crea una nota llamada 'ID Proyecto' con ese UUID como contenido",
    provider
  );

  console.log("\n");

  // Ejemplo 3: Cálculos y conversiones
  await ejecutarAgente(
    "Suma 15 + 27, convierte 25 grados Celsius a Fahrenheit, y genera una contraseña segura de 12 caracteres",
    provider
  );

  // Limpiar MCP clients
  if (mcpClients) {
    await mcpClients.notas.stop();
    await mcpClients.utils.stop();
  }
}

main().catch(console.error);