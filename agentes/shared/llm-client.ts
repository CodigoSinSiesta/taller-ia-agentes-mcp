// llm-client.ts
// Cliente agnóstico que soporta múltiples proveedores: Claude y DeepSeek

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// ============================================
// Tipos comunes
// ============================================

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface LLMResponse {
  content: string | null;
  toolCalls: ToolCall[];
  stopReason: "end" | "tool_use";
}

export type Provider = "claude" | "deepseek";

// ============================================
// Configuración
// ============================================

export interface LLMConfig {
  provider: Provider;
  model?: string;
  maxTokens?: number;
}

const DEFAULT_MODELS: Record<Provider, string> = {
  claude: "claude-sonnet-4-20250514",
  deepseek: "deepseek-chat"
};

// ============================================
// Cliente LLM
// ============================================

export class LLMClient {
  private provider: Provider;
  private model: string;
  private maxTokens: number;
  private anthropicClient?: Anthropic;
  private openaiClient?: OpenAI;

  constructor(config: LLMConfig) {
    this.provider = config.provider;
    this.model = config.model || DEFAULT_MODELS[config.provider];
    this.maxTokens = config.maxTokens || 1024;

    if (this.provider === "claude") {
      this.anthropicClient = new Anthropic();
    } else if (this.provider === "deepseek") {
      this.openaiClient = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com"
      });
    }
  }

  getProviderName(): string {
    return this.provider.toUpperCase();
  }

  getModelName(): string {
    return this.model;
  }

  async chat(messages: Message[], tools?: Tool[]): Promise<LLMResponse> {
    if (this.provider === "claude") {
      return this.chatClaude(messages, tools);
    } else {
      return this.chatDeepSeek(messages, tools);
    }
  }

  // ============================================
  // Claude (Anthropic)
  // ============================================

  private async chatClaude(messages: Message[], tools?: Tool[]): Promise<LLMResponse> {
    const anthropicMessages = this.toAnthropicMessages(messages);
    const anthropicTools = tools?.map(t => this.toAnthropicTool(t));

    const response = await this.anthropicClient!.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      messages: anthropicMessages,
      ...(anthropicTools && { tools: anthropicTools })
    });

    return this.fromAnthropicResponse(response);
  }

  private toAnthropicMessages(messages: Message[]): Anthropic.MessageParam[] {
    const result: Anthropic.MessageParam[] = [];

    for (const msg of messages) {
      if (msg.role === "user") {
        result.push({ role: "user", content: msg.content });
      } else if (msg.role === "assistant") {
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          const content: Anthropic.ContentBlockParam[] = [];
          if (msg.content) {
            content.push({ type: "text", text: msg.content });
          }
          for (const tc of msg.toolCalls) {
            content.push({
              type: "tool_use",
              id: tc.id,
              name: tc.name,
              input: tc.input
            });
          }
          result.push({ role: "assistant", content });
        } else {
          result.push({ role: "assistant", content: msg.content });
        }
      } else if (msg.role === "tool") {
        // Buscar si el mensaje anterior ya es de usuario con tool_result
        const lastMsg = result[result.length - 1];
        const toolResult: Anthropic.ToolResultBlockParam = {
          type: "tool_result",
          tool_use_id: msg.toolCallId!,
          content: msg.content
        };

        if (lastMsg && lastMsg.role === "user" && Array.isArray(lastMsg.content)) {
          (lastMsg.content as Anthropic.ToolResultBlockParam[]).push(toolResult);
        } else {
          result.push({ role: "user", content: [toolResult] });
        }
      }
    }

    return result;
  }

  private toAnthropicTool(tool: Tool): Anthropic.Tool {
    return {
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: "object" as const,
        properties: tool.parameters.properties,
        required: tool.parameters.required
      }
    };
  }

  private fromAnthropicResponse(response: Anthropic.Message): LLMResponse {
    const toolCalls: ToolCall[] = [];
    let content: string | null = null;

    for (const block of response.content) {
      if (block.type === "text") {
        content = block.text;
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>
        });
      }
    }

    return {
      content,
      toolCalls,
      stopReason: response.stop_reason === "tool_use" ? "tool_use" : "end"
    };
  }

  // ============================================
  // DeepSeek (OpenAI compatible)
  // ============================================

  private async chatDeepSeek(messages: Message[], tools?: Tool[]): Promise<LLMResponse> {
    const openaiMessages = this.toOpenAIMessages(messages);
    const openaiTools = tools?.map(t => this.toOpenAITool(t));

    const response = await this.openaiClient!.chat.completions.create({
      model: this.model,
      max_tokens: this.maxTokens,
      messages: openaiMessages,
      ...(openaiTools && { tools: openaiTools })
    });

    return this.fromOpenAIResponse(response);
  }

  private toOpenAIMessages(messages: Message[]): OpenAI.ChatCompletionMessageParam[] {
    return messages.map(msg => {
      if (msg.role === "user") {
        return { role: "user" as const, content: msg.content };
      } else if (msg.role === "assistant") {
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          return {
            role: "assistant" as const,
            content: msg.content || null,
            tool_calls: msg.toolCalls.map(tc => ({
              id: tc.id,
              type: "function" as const,
              function: {
                name: tc.name,
                arguments: JSON.stringify(tc.input)
              }
            }))
          };
        }
        return { role: "assistant" as const, content: msg.content };
      } else {
        // tool response
        return {
          role: "tool" as const,
          tool_call_id: msg.toolCallId!,
          content: msg.content
        };
      }
    });
  }

  private toOpenAITool(tool: Tool): OpenAI.ChatCompletionTool {
    return {
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    };
  }

  private fromOpenAIResponse(response: OpenAI.ChatCompletion): LLMResponse {
    const choice = response.choices[0];
    const message = choice.message;
    const toolCalls: ToolCall[] = [];

    if (message.tool_calls) {
      for (const tc of message.tool_calls) {
        toolCalls.push({
          id: tc.id,
          name: tc.function.name,
          input: JSON.parse(tc.function.arguments)
        });
      }
    }

    return {
      content: message.content,
      toolCalls,
      stopReason: choice.finish_reason === "tool_calls" ? "tool_use" : "end"
    };
  }
}

// ============================================
// Factory helper
// ============================================

export function createClient(provider?: Provider): LLMClient {
  const selectedProvider = provider || (process.env.LLM_PROVIDER as Provider) || "claude";
  
  return new LLMClient({ provider: selectedProvider });
}
