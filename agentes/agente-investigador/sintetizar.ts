// sintetizar.ts
// Función para sintetizar la respuesta final

import { LLMClient } from "../shared/llm-client.js";
import { ResultadoInvestigacion } from "./types.js";

export async function sintetizar(
  client: LLMClient,
  preguntaOriginal: string,
  investigaciones: ResultadoInvestigacion[]
): Promise<string> {
  console.log("✨ Paso 3: Sintetizando respuesta final...\n");

  const informacionRecopilada = investigaciones
    .map((inv, i) => `**Investigación ${i + 1}:** ${inv.pregunta}\n${inv.respuesta}`)
    .join("\n\n");

  const response = await client.chat([{
    role: "user",
    content: `Eres un experto sintetizando información.

**Pregunta original del usuario:**
"${preguntaOriginal}"

**Información recopilada de la investigación:**
${informacionRecopilada}

**Tu tarea:**
Sintetiza toda la información en una respuesta coherente, bien estructurada y completa para el usuario.
No menciones que hubo "sub-preguntas" o "investigación", simplemente responde de forma natural y fluida.`
  }]);

  return response.content || "No se pudo generar una síntesis";
}