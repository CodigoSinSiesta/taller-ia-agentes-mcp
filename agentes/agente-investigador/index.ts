// index.ts
// Orquestador del agente investigador

import "dotenv/config";
import { createClient, Provider } from "../shared/llm-client.js";
import { planificar } from "./planificar.js";
import { investigar } from "./investigar.js";
import { sintetizar } from "./sintetizar.js";

// ============================================
// Orquestador del agente
// ============================================

async function agenteInvestigador(pregunta: string, provider?: Provider): Promise<void> {
  const client = createClient(provider);

  console.log("━".repeat(60));
  console.log(`🔬 AGENTE INVESTIGADOR (${client.getProviderName()})`);
  console.log(`📦 Modelo: ${client.getModelName()}`);
  console.log("━".repeat(60));
  console.log(`\n👤 Pregunta: "${pregunta}"\n`);

  const tiempoInicio = Date.now();

  try {
    // Ejecutar los 3 pasos del patrón
    const plan = await planificar(client, pregunta);
    const investigaciones = await investigar(client, plan);
    const respuestaFinal = await sintetizar(client, pregunta, investigaciones);

    const tiempoTotal = ((Date.now() - tiempoInicio) / 1000).toFixed(2);

    // Mostrar resultado
    console.log("━".repeat(60));
    console.log("📝 RESPUESTA FINAL");
    console.log("━".repeat(60));
    console.log(respuestaFinal);
    console.log("\n" + "━".repeat(60));
    console.log(`⏱️  Tiempo total: ${tiempoTotal}s`);
    console.log("━".repeat(60));

  } catch (error) {
    console.error("❌ Error en el agente:", error);
    throw error;
  }
}

// ============================================
// Main
// ============================================

async function main() {
  // Obtener provider de argumentos
  const providerArg = process.argv.find(arg => arg.startsWith("--provider="));
  const provider = providerArg?.split("=")[1] as Provider | undefined;

  // Obtener pregunta de argumentos (ignorando flags)
  const pregunta = process.argv
    .slice(2)
    .filter(arg => !arg.startsWith("--"))
    .join(" ") || "¿Cuáles son las mejores prácticas para implementar IA generativa en una empresa tradicional?";

  console.log("\n🚀 Agente Investigador Multi-Proveedor\n");

  await agenteInvestigador(pregunta, provider);
}

main().catch(console.error);