// investigar.ts
// Función para investigar las sub-preguntas

import { LLMClient } from "../shared/llm-client.js";
import { PlanDeInvestigacion, ResultadoInvestigacion } from "./types.js";

export async function investigar(
  client: LLMClient,
  plan: PlanDeInvestigacion
): Promise<ResultadoInvestigacion[]> {
  console.log("🔍 Paso 2: Investigando sub-preguntas en paralelo...\n");

  const investigaciones = await Promise.all(
    plan.subpreguntas.map(async (subpregunta, index) => {
      const response = await client.chat([{
        role: "user",
        content: `Responde de forma concisa y directa (máximo 3-4 oraciones):

${subpregunta}`
      }]);

      console.log(`   ✓ Pregunta ${index + 1} investigada`);

      return {
        pregunta: subpregunta,
        respuesta: response.content || "Sin respuesta"
      };
    })
  );

  console.log();
  return investigaciones;
}