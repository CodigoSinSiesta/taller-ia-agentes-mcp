// planificar.ts
// Función para planificar la investigación

import { LLMClient } from "../shared/llm-client.js";
import { PlanDeInvestigacion } from "./types.js";

export async function planificar(client: LLMClient, pregunta: string): Promise<PlanDeInvestigacion> {
  console.log("📋 Paso 1: Generando plan de investigación...\n");

  const response = await client.chat([{
    role: "user",
    content: `Eres un agente investigador metódico. Para responder esta pregunta:

"${pregunta}"

Genera exactamente 3 sub-preguntas específicas que necesitas investigar para dar una respuesta completa.

Formato de respuesta (solo las preguntas, una por línea):
1. [primera sub-pregunta]
2. [segunda sub-pregunta]
3. [tercera sub-pregunta]`
  }]);

  const texto = response.content || "";

  // Parseamos las sub-preguntas
  const subpreguntas = texto
    .split("\n")
    .filter(linea => linea.match(/^\d+\./))
    .map(linea => linea.replace(/^\d+\.\s*/, "").trim())
    .filter(p => p.length > 0);

  // Si no encontramos 3 preguntas, intentar otro parseo
  const preguntasFinales = subpreguntas.length >= 3
    ? subpreguntas.slice(0, 3)
    : texto.split("\n").filter(l => l.trim().length > 10).slice(0, 3);

  console.log("   Sub-preguntas identificadas:");
  preguntasFinales.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
  console.log();

  return {
    preguntaOriginal: pregunta,
    subpreguntas: preguntasFinales
  };
}