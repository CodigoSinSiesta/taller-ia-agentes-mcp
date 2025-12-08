# Código Sin Siesta - Taller de IA

Bienvenido al repositorio oficial del **Taller de Agentes de IA y MCP Servers** de la organización **Código Sin Siesta**.

Este proyecto es un ejemplo práctico y educativo para entender cómo funcionan los Agentes de IA y los MCP Servers (Model Context Protocol), compatible con Claude y DeepSeek.

## Contenido Principal

- 🤖 **Dos Agentes de IA funcionales** con diferentes patrones de arquitectura
- 🔌 **Dos MCP Servers** listos para usar con Claude Desktop
- 📚 **Documentación completa** en español
- 🔄 **Compatible con múltiples LLMs** (Claude, DeepSeek)
- ⚡ **Código TypeScript** strict con ejemplos ejecutables

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus API keys

# Ejecutar un agente
npm run agente:tareas:claude

# Ejecutar un MCP server
npm run mcp:notas
```

## Estructura del Proyecto

```
📦 taller-ia-agentes-mcp
├── 🤖 agentes/
│   ├── agente-tareas/          # Agente básico con tool use
│   ├── agente-investigador/    # Agente avanzado (Plan-Execute-Synthesize)
│   └── shared/                 # Cliente LLM agnóstico
├── 🔌 mcp-servers/
│   ├── notas-mcp.ts            # MCP Server de notas (FastMCP)
│   └── utils-mcp.ts            # MCP Server de utilidades (SDK Oficial)
├── 📖 AGENTS.md                # Guía de codificación
└── 📚 README.md                # Documentación completa
```

## Documentación

- [**README.md**](README.md) - Guía completa y ejercicios propuestos
- [**AGENTS.md**](AGENTS.md) - Estándares de código para agentes de IA
- [**Agente de Tareas**](agentes/agente-tareas/AgenteTareas.md) - Documentación del primer agente
- [**Agente Investigador**](agentes/agente-investigador/AgenteInvestigador.md) - Documentación del segundo agente

## Tecnologías

- **TypeScript** - Tipado fuerte y seguridad de tipos
- **Claude & DeepSeek** - Modelos de lenguaje avanzados
- **MCP (Model Context Protocol)** - Estándar para conexión de herramientas
- **Node.js** - Runtime >= 20.0.0
- **FastMCP & SDK MCP** - Librerías para construir MCP Servers

## Cómo Contribuir

Si quieres mejorar este taller o añadir nuevos ejemplos:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/mi-mejora`
3. Commit tus cambios: `git commit -am 'Añade mi mejora'`
4. Push a la rama: `git push origin feature/mi-mejora`
5. Abre un Pull Request

Por favor, sigue las convenciones de código especificadas en [AGENTS.md](AGENTS.md).

## Recursos Externos

- 📖 [Documentación de Anthropic](https://docs.anthropic.com/)
- 🚀 [API de DeepSeek](https://platform.deepseek.com/api-docs/)
- 🔌 [Especificación MCP](https://modelcontextprotocol.io/)
- 📚 [SDK MCP TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- ⚡ [FastMCP](https://github.com/jlowin/fastmcp)

## Licencia

Este proyecto es de código abierto y educativo. Úsalo libremente para aprender y enseñar.

---

**Preparado para el taller de IA - Código Sin Siesta 2025**
