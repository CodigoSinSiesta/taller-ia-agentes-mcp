# Implementation Plan: DevContainer Setup

**Branch**: `001-devcontainer-setup` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-devcontainer-setup/spec.md`

## Summary

Crear un entorno de desarrollo containerizado (DevContainer) que proporcione a los participantes del taller un ambiente completamente configurado con Node.js 20+, todas las dependencias npm instaladas, soporte para agentes IA (Claude/DeepSeek), servidores MCP, y integración con OpenCode para asistencia AI durante el aprendizaje.

**Technical Approach**: Utilizar la especificación DevContainer de VS Code con imagen base oficial de Microsoft para Node.js 20, configurar extensiones necesarias, montar volúmenes para persistencia de configuración, y establecer variables de entorno seguras para API keys.

## Technical Context

**Language/Version**: TypeScript 5.5+ with strict mode, Node.js 20.0.0+  
**Primary Dependencies**: 
- DevContainers (VS Code Remote - Containers extension)
- Node.js base image: `mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm`
- npm packages: @anthropic-ai/sdk, @modelcontextprotocol/sdk, openai, zod, dotenv, fastmcp, tsx, typescript
- OpenCode CLI tools (integrated via workspace settings)

**Storage**: JSON files (notas.json) en proyecto - no requiere bases de datos adicionales  
**Testing**: Validación manual (sin framework formal según constitución del proyecto)  
**Target Platform**: Cross-platform DevContainer (Windows/Mac/Linux vía Docker Desktop)  
**Project Type**: Single project (taller educativo)  
**Performance Goals**: 
- Construcción del contenedor < 10 minutos
- Entorno listo para uso < 5 minutos post-construcción
- Arranque de agentes < 30 segundos

**Constraints**: 
- Debe funcionar offline después de construcción inicial
- Preservar API keys entre reconstrucciones
- Compatible con Docker Desktop en todas las plataformas
- Sin dependencias de servicios externos (excepto APIs de LLM)

**Scale/Scope**: ~20-50 participantes de taller simultáneamente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Analysis

| Principio | Estado | Notas |
|-----------|--------|-------|
| **I. TypeScript Strict Mode** | ✅ PASS | DevContainer incluirá TypeScript 5.5+ con configuración strict del tsconfig.json existente |
| **II. Provider Abstraction** | ✅ PASS | Entorno soporta variable LLM_PROVIDER para cambio entre Claude/DeepSeek sin modificar código |
| **III. Tool-First Design** | ✅ PASS | MCP servers y herramientas de agentes funcionan sin modificación |
| **IV. Educational Clarity** | ✅ PASS | README y instrucciones de setup en español, mensajes de error claros, documentación inline |
| **V. Environment-Based Configuration** | ✅ PASS | Soporte completo para .env con volúmenes montados, API keys nunca committed |

**Technology Stack Alignment**: ✅ Todos los requisitos constitucionales cumplidos  
**Development Workflow**: ✅ Soporta scripts npm, operaciones git, locale español

**Gate Status**: **✅ PASS** - Sin violaciones, proceder a Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-devcontainer-setup/
├── plan.md              # Este archivo
├── spec.md              # Especificación de funcionalidad
├── quickstart.md        # Guía rápida para participantes (Phase 1)
└── research.md          # Investigación de mejores prácticas (Phase 0)
```

### Source Code (repository root)

```text
.devcontainer/
├── devcontainer.json         # Configuración principal del DevContainer
└── postCreateCommand.sh      # Script de setup post-creación (opcional)

.vscode/
├── settings.json             # Settings de workspace (OpenCode, formateo)
└── extensions.json           # Extensiones recomendadas

# Estructura existente (sin cambios)
agentes/
├── shared/
│   └── llm-client.ts
├── agente-tareas/
│   ├── index.ts
│   ├── agent-loop.ts
│   ├── tools.ts
│   └── AgenteTareas.md
└── agente-investigador/
    ├── index.ts
    ├── investigar.ts
    ├── planificar.ts
    ├── sintetizar.ts
    ├── types.ts
    └── AgenteInvestigador.md

mcp-servers/
├── notas-mcp.ts
└── utils-mcp.ts

.env.example                  # Actualizado con variables OpenCode
README.md                     # Actualizado con instrucciones devcontainer
package.json                  # Sin cambios (dependencias ya definidas)
tsconfig.json                 # Sin cambios (config strict ya establecida)
```

**Structure Decision**: Configuración de infraestructura en raíz del repositorio siguiendo convenciones de DevContainer. Sin cambios en estructura de código existente. La carpeta `.devcontainer/` es el estándar de VS Code para definiciones de contenedores de desarrollo.

## Complexity Tracking

> **No aplica** - No hay violaciones de la constitución que requieran justificación.

## Phase 0: Research (to be generated)

Tareas de investigación identificadas:

1. **DevContainer Base Image Selection**: Comparar imágenes oficiales de Microsoft vs Docker para Node.js 20+
2. **OpenCode Integration**: Documentar método de integración con DevContainers
3. **API Key Persistence**: Mejores prácticas para preservar secretos entre rebuilds
4. **Spanish Locale Support**: Configuración de locale para mensajes en español
5. **VS Code Extensions**: Identificar extensiones necesarias para experiencia óptima

## Phase 1: Design (to be generated)

Artefactos a generar:

1. **quickstart.md**: Guía paso a paso para participantes del taller
   - Prerequisitos (Docker Desktop, VS Code)
   - Cómo abrir el proyecto en DevContainer
   - Cómo configurar API keys
   - Cómo ejecutar agentes y MCP servers
   - Troubleshooting común

2. **No data-model.md**: No aplica (configuración de infraestructura)

3. **No contracts/**: No aplica (sin APIs nuevas)

## Implementation Notes

- **Prioridad 1 (US1)**: Entorno funcional básico
- **Prioridad 2 (US2)**: Integración OpenCode
- **Prioridad 3 (US3)**: Gestión avanzada de API keys

**MVP Scope**: Solo User Story 1 - Entorno de desarrollo funcional con capacidad de ejecutar agentes.

**Incremental Delivery**:
1. US1 → Participantes pueden empezar el taller
2. US2 → Agregar asistencia AI durante aprendizaje
3. US3 → Mejorar experiencia con persistencia de configuración
