<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version change: NEW → 1.0.0 (Initial constitution)
Ratification: TODO(RATIFICATION_DATE): Original adoption date unknown - needs specification
Last amended: 2024-12-09

Modified principles: N/A (initial version)
Added sections:
  - I. TypeScript Strict Mode
  - II. Provider Abstraction
  - III. Tool-First Design
  - IV. Educational Clarity
  - V. Environment-Based Configuration
  - Technology Stack
  - Development Workflow
  - Governance

Removed sections: N/A (initial version)

Templates requiring updates:
  ✅ plan-template.md - Constitution Check references now valid
  ✅ spec-template.md - Requirements align with principles
  ✅ tasks-template.md - Task organization reflects principles
  ✅ agent-file-template.md - Development guidelines consistent
  ✅ checklist-template.md - No changes needed (generic template)

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Specify original constitution adoption date
-->

# Taller IA: Agentes y MCP Servers - Constitution

## Core Principles

### I. TypeScript Strict Mode

**Rule**: All code MUST use TypeScript strict mode with ES2022 target, NodeNext modules, and ES modules only.

**Rationale**: Type safety prevents runtime errors and improves code maintainability. Strict mode catches type issues at compile time, essential for educational code that students will read and modify. ES modules align with modern JavaScript standards and ensure better interoperability.

**Non-negotiable requirements**:
- No `any` types unless explicitly justified
- All functions must have return type annotations
- Interface definitions required for complex objects
- Union types preferred over loose typing

### II. Provider Abstraction

**Rule**: LLM client implementations MUST use factory pattern with provider abstraction (Claude/DeepSeek/OpenAI).

**Rationale**: This workshop teaches multi-provider AI integration. Abstraction allows students to switch providers via environment variables without code changes, demonstrating real-world architectural patterns. It also protects against vendor lock-in and teaches portable design.

**Non-negotiable requirements**:
- `createClient()` factory in `shared/llm-client.ts`
- Identical API surface for all providers
- Provider selection via `LLM_PROVIDER` environment variable
- No provider-specific logic outside client implementations

### III. Tool-First Design

**Rule**: All agent capabilities MUST be exposed as tools with clear schemas, validation, and error handling.

**Rationale**: Tool-based architecture is the foundation of modern AI agents. Clear tool definitions make agent behavior predictable and testable. This principle teaches students how LLMs interact with external systems through structured interfaces.

**Non-negotiable requirements**:
- Zod schemas for all tool parameters (@modelcontextprotocol/sdk)
- Tool definitions separate from execution logic
- Descriptive tool names and documentation
- Graceful error handling with informative messages

### IV. Educational Clarity

**Rule**: Code MUST prioritize readability and educational value over cleverness or brevity.

**Rationale**: This is workshop code designed for learning. Students must understand concepts quickly. Verbose, clear code with Spanish business logic comments teaches better than terse, "elegant" code requiring deep expertise to parse.

**Non-negotiable requirements**:
- Spanish comments for business logic
- Section separators (`===`) for code organization
- Minimal abstraction - prefer explicit over implicit
- Examples and usage documentation in agent `.md` files

### V. Environment-Based Configuration

**Rule**: All secrets, API keys, and provider selections MUST use environment variables; NEVER hardcode or commit sensitive data.

**Rationale**: Security best practice and practical necessity. Workshop attendees use their own API keys. Environment configuration teaches proper secret management and makes code portable across different environments.

**Non-negotiable requirements**:
- `.env.example` with all required variables documented
- `.env` in `.gitignore`
- Runtime validation of required environment variables
- Clear error messages when variables missing

## Technology Stack

**Language**: TypeScript 5.5+ with strict mode  
**Runtime**: Node.js ≥20.0.0  
**AI Providers**: Anthropic Claude SDK, OpenAI SDK (DeepSeek compatible)  
**MCP Implementation**: @modelcontextprotocol/sdk with Zod validation  
**Persistence**: JSON files (notas.json) - no databases for simplicity  
**Testing**: No formal test framework - workshop focuses on concepts  
**Build**: `npx tsc` compiles to ./dist  

**Rationale**: Modern, stable stack with clear separation between AI providers. No testing framework reduces setup complexity for workshop participants. JSON persistence keeps data layer simple and inspectable.

## Development Workflow

### Code Style
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces/types
- **Imports**: External libraries first, then local imports; absolute paths from project root
- **Formatting**: 2-space indentation, consistent with project patterns
- **Async**: async/await preferred over raw Promises; proper rejection handling required

### Agent Development
- Agent loop: Tool-use with state management and timeout handling
- MCP integration via stdio transport
- Each agent must have accompanying `.md` documentation explaining purpose and usage
- npm scripts for running agents with specific providers

### Commit Discipline
- Never attribute code to specific AI assistants as authors
- Commit messages in Spanish, following conventional commits format
- Incremental commits preferred over large batches

## Governance

**Authority**: This constitution supersedes all other development practices and templates. When conflict arises between constitution principles and expedient implementation, principles win.

**Amendments**: Constitution changes require:
1. Documentation of rationale in Sync Impact Report
2. Version bump following semantic versioning (MAJOR for incompatible changes, MINOR for additions, PATCH for clarifications)
3. Propagation of changes to all dependent templates
4. Update of `LAST_AMENDED_DATE`

**Compliance Review**: All feature specifications, implementation plans, and task lists MUST pass a Constitution Check gate before Phase 0 research begins. Re-check after Phase 1 design.

**Versioning Policy**:
- MAJOR (X.0.0): Principle removal, redefinition, or backward-incompatible governance changes
- MINOR (X.Y.0): New principle added, section materially expanded, new mandatory constraint
- PATCH (X.Y.Z): Clarification, wording improvement, typo fix, non-semantic refinement

**Simplicity Justification**: Any complexity not mandated by this constitution MUST be justified in implementation plans with "Complexity Tracking" section showing:
- What violation occurred (e.g., additional abstraction layer)
- Why it's needed (specific problem being solved)
- Why simpler alternatives were rejected (concrete technical reasons)

**Runtime Guidance**: For active development sessions, agents should reference `AGENTS.md` for immediate coding guidelines (commands, style, project rules). Constitution provides overarching governance; AGENTS.md provides tactical guidance.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): needs specification | **Last Amended**: 2024-12-09
