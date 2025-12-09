# 🤖 Taller de IA: Agentes y MCP Servers

Ejemplos prácticos para entender cómo funcionan los **Agentes de IA** y los **MCP Servers** (Model Context Protocol).

✅ **Compatible con Claude y DeepSeek**  
✅ **DevContainer Incluido** - Entorno preconfigurado en Docker

---

## 🐳 Inicio Rápido con DevContainer (Recomendado)

### Prerequisitos Mínimos
- **Docker Desktop** instalado ([descargar](https://www.docker.com/products/docker-desktop))
- **VS Code** instalado ([descargar](https://code.visualstudio.com/))
- **Extensión Dev Containers** (instala desde VS Code)

### Setup (5 minutos)

```bash
# 1. Clonar repositorio
git clone https://github.com/[usuario]/taller-ia.git
cd taller-ia

# 2. Abrir en VS Code
code .

# 3. VS Code sugerirá abrir en DevContainer → Haz clic en "Reopen in Container"
# Las dependencias se instalarán automáticamente

# 4. Configurar API keys (crear archivo .env en raíz)
cp .env.example .env
# Edita .env con tus claves de Anthropic y/o DeepSeek

# 5. ¡Listo! Prueba un agente
npm run agente:tareas:claude
```

📖 **Documentación completa**: Ver [`specs/001-devcontainer-setup/quickstart.md`](./specs/001-devcontainer-setup/quickstart.md)

---

## 📦 Instalación Manual (sin DevContainer)

Si prefieres NO usar DevContainer:

```bash
# Requisitos: Node.js 20+, npm 10+
node --version    # v20.x.x mínimo
npm --version     # 10.x.x mínimo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus API keys
```

---

## 📁 Estructura del proyecto

```
taller-ia/
├── .devcontainer/
│   └── devcontainer.json          # Configuración del DevContainer
├── .vscode/
│   ├── settings.json              # Configuración de VS Code
│   └── extensions.json            # Extensiones recomendadas
├── agentes/
│   ├── shared/
│   │   └── llm-client.ts          # Cliente agnóstico (Claude/DeepSeek)
│   ├── agente-tareas/
│   │   ├── index.ts               # Agente con tool use (loop básico)
│   │   ├── agent-loop.ts          # Lógica del loop de herramientas
│   │   ├── tools.ts               # Definición de herramientas
│   │   └── AgenteTareas.md        # Documentación del agente
│   └── agente-investigador/
│       ├── index.ts               # Agente Plan-Execute-Synthesize
│       ├── investigar.ts          # Lógica de investigación
│       ├── planificar.ts          # Lógica de planificación
│       ├── sintetizar.ts          # Lógica de síntesis
│       ├── types.ts               # Tipos TypeScript
│       └── AgenteInvestigador.md  # Documentación del agente
├── mcp-servers/
│   ├── notas-mcp.ts               # MCP Server con FastMCP
│   └── utils-mcp.ts               # MCP Server con SDK oficial
├── specs/
│   ├── 001-devcontainer-setup/    # Feature: DevContainer Setup
│   │   ├── spec.md                # Especificación
│   │   ├── plan.md                # Plan de implementación
│   │   ├── tasks.md               # Lista de tareas
│   │   ├── research.md            # Investigación y decisiones
│   │   └── quickstart.md          # Guía rápida para usuarios
│   └── [otras-features]/
├── AGENTS.md                       # Guías de codificación para agentes IA
├── package.json
├── tsconfig.json
├── .env.example                   # Plantilla de variables de entorno
└── README.md
```

---

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar API keys
cp .env.example .env
# Edita .env con tus API keys
```

### Variables de entorno

```bash
# Para usar Claude
export ANTHROPIC_API_KEY="sk-ant-..."

# Para usar DeepSeek
export DEEPSEEK_API_KEY="sk-..."

# Seleccionar proveedor (claude o deepseek)
export LLM_PROVIDER="claude"
```

---

## 📋 Guías de Desarrollo (AGENTS.md)

El archivo `AGENTS.md` contiene las reglas de codificación específicas para agentes de IA que trabajen en este proyecto:

- **Comandos de build/lint/test** para el proyecto
- **Estándares de código** TypeScript strict
- **Reglas del proyecto** específicas para agentes MCP
- **Convenciones de nomenclatura** y formato

**Importante**: Revisa `AGENTS.md` antes de contribuir código a agentes de IA.

---

## 🤖 Agentes

### ¿Qué es un Agente?

Un agente es un sistema que **usa un LLM en un loop**, permitiéndole:

1. Analizar una tarea
2. Decidir qué herramienta usar
3. Ejecutar la herramienta
4. Analizar el resultado
5. Repetir hasta completar la tarea

### Cliente LLM Agnóstico (shared/llm-client.ts)

El archivo `shared/llm-client.ts` proporciona una capa de abstracción que permite usar el mismo código con diferentes proveedores:

```typescript
import { createClient } from "../shared/llm-client.js";

// Usa la variable LLM_PROVIDER o 'claude' por defecto
const client = createClient();

// O especifica el proveedor directamente
const clientClaude = createClient("claude");
const clientDeepSeek = createClient("deepseek");

// La API es idéntica para ambos
const response = await client.chat(messages, tools);
```

### Agente 1: Asistente de Tareas

El ejemplo más básico de un agente: un loop que procesa tool calls.

```bash
# Con Claude (por defecto)
npm run agente:tareas:claude

# Con DeepSeek
npm run agente:tareas:deepseek

# O usando variable de entorno
LLM_PROVIDER=deepseek npm run agente:tareas
```

**Conceptos clave:**

- `tools`: Array de herramientas disponibles
- `stopReason`: "end" (terminó) o "tool_use" (quiere usar herramienta)
- `toolCalls`: Array con las herramientas que el modelo quiere ejecutar

**Flujo:**

```
Usuario → LLM → [tool_use] → Ejecutar → [resultado] → LLM → Respuesta
```

### Agente 2: Investigador (Plan-Execute-Synthesize)

Un agente más sofisticado que planifica antes de actuar.

```bash
# Con Claude
npm run agente:investigador:claude

# Con DeepSeek
npm run agente:investigador:deepseek

# Con pregunta personalizada
LLM_PROVIDER=deepseek npx tsx agentes/agente-investigador/index.ts "¿Cómo migrar de React a Vue?"
```

**Conceptos clave:**

- **Planificar**: Descomponer la pregunta en sub-preguntas
- **Ejecutar**: Investigar cada sub-pregunta (en paralelo con Promise.all)
- **Sintetizar**: Combinar todo en una respuesta coherente

---

## 🔌 MCP Servers

### ¿Qué es MCP?

**Model Context Protocol** es un estándar abierto que permite a los LLMs conectarse con herramientas y datos externos de forma segura y estandarizada.

> **Nota**: Los MCP servers son independientes del proveedor LLM. Funcionan con Claude Desktop, pero también con cualquier cliente MCP compatible.

### MCP 1: Servidor de Notas (FastMCP)

Usa `fastmcp`, una librería que simplifica la creación de MCP servers.

```bash
npm run mcp:notas
```

**Tools disponibles:**

| Tool | Descripción |
|------|-------------|
| crear_nota | Crea una nota con título y contenido |
| listar_notas | Lista todas las notas |
| leer_nota | Lee el contenido de una nota |
| actualizar_nota | Actualiza una nota existente |
| borrar_nota | Elimina una nota |
| buscar_notas | Busca notas por término |

### MCP 2: Servidor de Utilidades (SDK Oficial)

Usa el SDK oficial de MCP con Zod para validación de schemas.

```bash
npm run mcp:utils
```

**Tools disponibles:**

| Tool | Descripción |
|------|-------------|
| calcular | Operaciones matemáticas básicas |
| generar_uuid | Genera UUIDs v4 |
| timestamp | Fecha/hora en varios formatos |
| convertir_unidades | Conversión de unidades |
| generar_password | Genera contraseñas seguras |
| base64 | Codifica/decodifica Base64 |

---

## ⚙️ Configurar MCPs en Claude Desktop

1. Localiza el archivo de configuración:
   - **macOS**: ~/Library/Application Support/Claude/claude_desktop_config.json
   - **Windows**: %APPDATA%\Claude\claude_desktop_config.json
   - **Linux**: ~/.config/Claude/claude_desktop_config.json

2. Añade la configuración (adapta las rutas absolutas):

```json
{
  "mcpServers": {
    "notas": {
      "command": "npx",
      "args": ["tsx", "/ruta/completa/a/taller-ia/mcp-servers/notas-mcp.ts"]
    },
    "utilidades": {
      "command": "npx",
      "args": ["tsx", "/ruta/completa/a/taller-ia/mcp-servers/utils-mcp.ts"]
    }
  }
}
```

3. Reinicia Claude Desktop
4. Verifica que aparecen los iconos de herramientas 🔧

---

## 📊 Comparativas

### Claude vs DeepSeek para Agentes

| Aspecto | Claude | DeepSeek |
|---------|--------|----------|
| Tool calling | Nativo, muy robusto | Compatible OpenAI |
| Formato | Content blocks | Function calls |
| Coste | ~$3/MTok (Sonnet) | ~$0.14/MTok |
| Latencia | Baja | Variable |
| Límites | Rate limits estrictos | Más flexibles |

### FastMCP vs SDK Oficial

| Aspecto | FastMCP | SDK Oficial |
|---------|---------|-------------|
| Setup | Muy simple | Más código |
| Validación | JSON Schema | Zod (tipado fuerte) |
| Documentación | Menos extensa | Documentación completa |
| Flexibilidad | Básica | Alta |
| Recomendado | Prototipos | Producción |

---

## 🧠 Arquitectura

### Agente = LLM + Tools + Loop

```
┌─────────────────────────────────────────────┐
│                   AGENTE                     │
│                                              │
│   ┌──────────────────────────────────────┐  │
│   │            LLM Client                │  │
│   │  ┌─────────┐     ┌─────────────┐    │  │
│   │  │ Claude  │ OR  │  DeepSeek   │    │  │
│   │  └─────────┘     └─────────────┘    │  │
│   └──────────────────────────────────────┘  │
│                     │                        │
│                     ▼                        │
│   ┌─────────┐    ┌─────────┐    ┌───────┐  │
│   │  Tools  │◀──▶│  Loop   │◀──▶│ State │  │
│   └─────────┘    └─────────┘    └───────┘  │
└─────────────────────────────────────────────┘
```

### MCP = Protocolo estándar

```
┌──────────────┐     MCP      ┌────────────────┐
│    Claude    │◀────────────▶│   MCP Server   │
│   Desktop    │   (stdio)    │  (tu código)   │
└──────────────┘              └────────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │  APIs, DBs,  │
                              │  Servicios   │
                              └──────────────┘
```

---

## 📚 Recursos adicionales

- [Documentación de Anthropic](https://docs.anthropic.com/)
- [API de DeepSeek](https://platform.deepseek.com/api-docs/)
- [Especificación MCP](https://modelcontextprotocol.io/)
- [SDK MCP TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [FastMCP](https://github.com/jlowin/fastmcp)

---

## 🎯 Ejercicios propuestos

1. **Añadir una nueva tool** al agente de tareas (ej: enviar email simulado)
2. **Comparar respuestas** del mismo agente con Claude vs DeepSeek
3. **Crear un MCP server** que consulte una API real (ej: el tiempo)
4. **Combinar ambos**: Un agente que use tu MCP server personalizado
5. **Añadir un tercer proveedor** al llm-client.ts (ej: OpenAI, Mistral)

---

## ⚡ Troubleshooting

### Error: "Invalid API Key"

```bash
# Verifica que tienes las variables configuradas
echo $ANTHROPIC_API_KEY
echo $DEEPSEEK_API_KEY
```

### Error: "Tool not found" en DeepSeek

DeepSeek a veces tiene problemas con nombres de tools en español. Prueba a renombrarlas en inglés.

### MCP Server no aparece en Claude Desktop

1. Verifica que la ruta en claude_desktop_config.json es absoluta
2. Comprueba que puedes ejecutar el server manualmente: `npm run mcp:notas`
3. Revisa los logs de Claude Desktop
4. Asegúrate de que tienes Node.js >= 20.0.0 instalado

---

*Preparado para el taller de IA - NTT DATA 2025*
