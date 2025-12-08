// mcp-client.ts
// Cliente para comunicar con servidores MCP usando JSON-RPC sobre stdio

import { spawn, ChildProcess } from "child_process";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export class MCPClient {
  private process: ChildProcess | null = null;
  private requestId = 1;
  private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();

  constructor(private serverPath: string) {}

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.error(`🚀 Iniciando servidor MCP: ${this.serverPath}`);

      this.process = spawn("npx", ["tsx", this.serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd()
      });

      if (!this.process.stdout || !this.process.stderr || !this.process.stdin) {
        reject(new Error("No se pudieron crear los streams del proceso"));
        return;
      }

      // Buffer para acumular datos JSON-RPC
      let buffer = "";

      this.process.stdout.on("data", (data) => {
        buffer += data.toString();

        // Procesar mensajes completos (separados por nueva línea)
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Última línea incompleta queda en buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const message = JSON.parse(line.trim());
              this.handleMessage(message);
            } catch (error) {
              console.error("Error parseando mensaje MCP:", error, line);
            }
          }
        }
      });

      this.process.stderr.on("data", (data) => {
        console.error(`[MCP ${this.serverPath}]`, data.toString().trim());
      });

      this.process.on("close", (code) => {
        console.error(`Servidor MCP cerrado: ${this.serverPath} (código: ${code})`);
        this.process = null;
      });

      this.process.on("error", (error) => {
        console.error(`Error en servidor MCP: ${this.serverPath}`, error);
        reject(error);
      });

      // Esperar un poco para que el servidor se inicialice
      setTimeout(() => {
        if (this.process) {
          console.error(`✅ Servidor MCP iniciado: ${this.serverPath}`);
          resolve();
        }
      }, 1000);
    });
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  async listTools(): Promise<MCPTool[]> {
    const response = await this.sendRequest("tools/list", {});
    return response.tools || [];
  }

  async callTool(name: string, args: Record<string, any> = {}): Promise<MCPResponse> {
    try {
      const response = await this.sendRequest("tools/call", {
        name,
        arguments: args
      });

      return {
        content: response.content || [],
        isError: response.isError || false
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `❌ Error llamando herramienta MCP: ${error}` }],
        isError: true
      };
    }
  }

  private async sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        reject(new Error("Servidor MCP no iniciado"));
        return;
      }

      const id = this.requestId++;
      const request = {
        jsonrpc: "2.0",
        id,
        method,
        params
      };

      this.pendingRequests.set(id, { resolve, reject });

      // Timeout de 30 segundos
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Timeout en llamada MCP: ${method}`));
      }, 30000);

      // Resolver el timeout si la respuesta llega
      const originalResolve = resolve;
      resolve = (result: any) => {
        clearTimeout(timeout);
        originalResolve(result);
      };

      this.process.stdin.write(JSON.stringify(request) + "\n");
    });
  }

  private handleMessage(message: any): void {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);

      if (message.error) {
        reject(new Error(`Error MCP: ${message.error.message}`));
      } else {
        resolve(message.result);
      }
    }
  }
}

// Factory para crear clientes MCP
export function createMCPClients(): { notas: MCPClient; utils: MCPClient } {
  return {
    notas: new MCPClient("mcp-servers/notas-mcp.ts"),
    utils: new MCPClient("mcp-servers/utils-mcp.ts")
  };
}