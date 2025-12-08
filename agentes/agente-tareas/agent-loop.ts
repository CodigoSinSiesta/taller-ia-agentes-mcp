// agent-loop.ts
// Loop del agente de tareas

import { createClient, Tool, Message, Provider } from "../shared/llm-client.js";
import { getMCPTools, ejecutarTool } from "./tools.js";

export async function ejecutarAgente(mensajeUsuario: string, provider?: Provider): Promise<void> {
  const client = createClient(provider);

  console.log("━".repeat(60));
  console.log(`🤖 AGENTE DE TAREAS CON MCP (${client.getProviderName()})`);
  console.log(`📦 Modelo: ${client.getModelName()}`);
  console.log("━".repeat(60));
  console.log(`\n👤 Usuario: ${mensajeUsuario}\n`);

  // Obtener herramientas MCP disponibles
  const tools = await getMCPTools();
  console.log(`🔧 Herramientas MCP disponibles: ${tools.length}`);
  tools.forEach(tool => console.log(`   - ${tool.name}`));
  console.log();

  const messages: Message[] = [
    { role: "user", content: mensajeUsuario }
  ];

  let iteracion = 0;
  const maxIteraciones = 10;

  while (iteracion < maxIteraciones) {
    iteracion++;

    const response = await client.chat(messages, tools);

    // Si terminó, mostrar respuesta final
    if (response.stopReason === "end") {
      if (response.content) {
        console.log(`\n🤖 Agente: ${response.content}`);
      }
      break;
    }

    // Si quiere usar tools, las ejecutamos
    if (response.stopReason === "tool_use" && response.toolCalls.length > 0) {
      // Añadir respuesta del asistente con tool calls
      messages.push({
        role: "assistant",
        content: response.content || "",
        toolCalls: response.toolCalls
      });

      // Ejecutar cada tool y añadir resultados
      for (const toolCall of response.toolCalls) {
        console.log(`🔧 Ejecutando: ${toolCall.name}`);
        console.log(`   Inputs: ${JSON.stringify(toolCall.input)}`);

        const resultado = await ejecutarTool(toolCall.name, toolCall.input);
        console.log(`   Resultado: ${resultado}\n`);

        messages.push({
          role: "tool",
          content: resultado,
          toolCallId: toolCall.id
        });
      }
    }
  }

  if (iteracion >= maxIteraciones) {
    console.log("⚠️ Se alcanzó el límite de iteraciones");
  }

  console.log("\n" + "━".repeat(60));
}