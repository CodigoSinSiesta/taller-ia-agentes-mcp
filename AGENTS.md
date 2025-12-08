# AGENTS.md - Coding Guidelines for AI Agents

## Build/Lint/Test Commands
- **Build**: `npx tsc` (compile TypeScript to ./dist)
- **Run agents**: `npm run agente:tareas:claude`, `npm run agente:tareas:deepseek`, `npm run agente:investigador:claude`
- **Run MCP servers**: `npm run mcp:notas`, `npm run mcp:utils`
- **Test single agent**: `LLM_PROVIDER=deepseek npx tsx agentes/agente-tareas/index.ts`
- **Test MCP integration**: `echo "test command" | npx tsx agentes/agente-tareas/index.ts`
- **Lint**: No linter configured - add ESLint + Prettier for consistent formatting

## Code Style Guidelines
- **Language**: TypeScript strict mode, ES2022 target, NodeNext modules, ES modules only
- **Naming**: camelCase variables/functions, PascalCase classes/interfaces/types
- **Imports**: External libs first, then local imports; use absolute paths from project root
- **Comments**: Spanish for business logic, `===` section separators, minimal comments
- **Types**: Define interfaces for complex objects, use union types, avoid `any`, strict typing
- **Error handling**: try/catch with descriptive messages, graceful degradation, proper async/await
- **Formatting**: 2-space indentation, consistent with existing patterns
- **Async**: async/await preferred over Promises, handle rejections properly

## Project Rules
- **Author attribution**: Never attribute code to Claude as author
- **Planning**: Always create plan files in project root and track progress when developing plans
- **LLM clients**: Factory pattern with Claude/DeepSeek provider abstraction
- **Agents**: Tool-use loops with state management, timeout handling, MCP integration
- **MCP servers**: @modelcontextprotocol/sdk with Zod validation (not FastMCP)
- **Persistence**: JSON files in project root (notas.json), no databases
- **Environment**: .env files for API keys, LLM_PROVIDER env var for provider selection
- **Security**: Never commit API keys or secrets to repository</content>
<parameter name="filePath">AGENTS.md
