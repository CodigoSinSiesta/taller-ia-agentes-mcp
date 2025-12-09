---
description: "Task list for DevContainer setup implementation"
---

# Tasks: DevContainer Setup para Taller IA

**Input**: Design documents from `/specs/001-devcontainer-setup/`  
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: No test tasks included - validation is manual per project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **DevContainer config**: `.devcontainer/` at repository root
- **VS Code settings**: `.vscode/` at repository root
- **Documentation**: `specs/001-devcontainer-setup/` and root `README.md`
- Existing code structure remains unchanged

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create DevContainer configuration structure and documentation foundation

- [ ] T001 Create .devcontainer directory at repository root
- [ ] T002 [P] Create .vscode directory at repository root (if not exists)
- [ ] T003 [P] Create specs/001-devcontainer-setup/quickstart.md documentation file
- [ ] T004 [P] Create specs/001-devcontainer-setup/research.md for decisions tracking

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core DevContainer configuration that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Research and document DevContainer base image selection in specs/001-devcontainer-setup/research.md
- [ ] T006 [P] Research OpenCode integration requirements in specs/001-devcontainer-setup/research.md
- [ ] T007 [P] Research API key persistence strategies in specs/001-devcontainer-setup/research.md
- [ ] T008 Create base devcontainer.json in .devcontainer/ with Node.js 20 image reference
- [ ] T009 Configure Node.js version and npm in .devcontainer/devcontainer.json features
- [ ] T010 Add TypeScript and tsx to .devcontainer/devcontainer.json features or postCreateCommand

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Entorno de Desarrollo Funcional (Priority: P1) 🎯 MVP

**Goal**: Participantes pueden abrir el proyecto en VS Code y tener un entorno completamente funcional para ejecutar agentes IA

**Independent Test**: Abrir proyecto en VS Code con Dev Containers → esperar construcción → ejecutar `npm run agente:tareas:claude` → debe ejecutarse sin errores

### Implementation for User Story 1

- [ ] T011 [US1] Configure npm install in .devcontainer/devcontainer.json postCreateCommand
- [ ] T012 [US1] Add git feature to .devcontainer/devcontainer.json features section
- [ ] T013 [US1] Configure Spanish locale (LANG=es_ES.UTF-8) in .devcontainer/devcontainer.json containerEnv
- [ ] T014 [US1] Add curl and jq tools to .devcontainer/devcontainer.json features for MCP debugging
- [ ] T015 [US1] Configure remoteEnv section in .devcontainer/devcontainer.json for environment variables
- [ ] T016 [US1] Add workspace mount configuration in .devcontainer/devcontainer.json to preserve node_modules
- [ ] T017 [US1] Document container build and usage in specs/001-devcontainer-setup/quickstart.md
- [ ] T018 [US1] Update root README.md with DevContainer setup section and prerequisites
- [ ] T019 [US1] Add troubleshooting section to specs/001-devcontainer-setup/quickstart.md
- [ ] T020 [US1] Validate all 6 npm scripts execute correctly in devcontainer (manual test)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - participants can run agents

---

## Phase 4: User Story 2 - Integración con OpenCode (Priority: P2)

**Goal**: Participantes pueden usar OpenCode dentro del devcontainer para asistencia AI durante el aprendizaje

**Independent Test**: Invocar OpenCode en devcontainer → preguntar sobre `agentes/agente-tareas/index.ts` → recibir respuesta contextual

### Implementation for User Story 2

- [ ] T021 [P] [US2] Research OpenCode required extensions and document in specs/001-devcontainer-setup/research.md
- [ ] T022 [P] [US2] Research OpenCode workspace settings requirements in specs/001-devcontainer-setup/research.md
- [ ] T023 [US2] Add OpenCode extension to .devcontainer/devcontainer.json customizations.vscode.extensions
- [ ] T024 [US2] Create .vscode/settings.json with OpenCode configuration
- [ ] T025 [US2] Add OpenCode environment variables to .devcontainer/devcontainer.json remoteEnv section
- [ ] T026 [US2] Document OpenCode usage in specs/001-devcontainer-setup/quickstart.md
- [ ] T027 [US2] Add OpenCode troubleshooting to specs/001-devcontainer-setup/quickstart.md
- [ ] T028 [US2] Validate OpenCode can access project files and provide contextual responses (manual test)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - participants can run agents and get AI assistance

---

## Phase 5: User Story 3 - Gestión Segura de API Keys (Priority: P3)

**Goal**: Participantes pueden configurar API keys de forma segura y estas persisten entre reconstrucciones

**Independent Test**: Configurar API keys → reconstruir contenedor → verificar que keys persisten y agentes autentican correctamente

### Implementation for User Story 3

- [ ] T029 [P] [US3] Research best practices for secrets in DevContainers in specs/001-devcontainer-setup/research.md
- [ ] T030 [US3] Update .env.example with all required API key variables and comments
- [ ] T031 [US3] Configure .env file mounting in .devcontainer/devcontainer.json mounts section
- [ ] T032 [US3] Add documentation about .env file to specs/001-devcontainer-setup/quickstart.md
- [ ] T033 [US3] Document API key configuration methods in specs/001-devcontainer-setup/quickstart.md (workspace secrets vs .env)
- [ ] T034 [US3] Add warning about not committing .env to specs/001-devcontainer-setup/quickstart.md
- [ ] T035 [US3] Verify .env is in .gitignore at repository root
- [ ] T036 [US3] Document API key persistence validation process in specs/001-devcontainer-setup/quickstart.md
- [ ] T037 [US3] Validate API keys persist across container rebuild (manual test)

**Checkpoint**: All user stories should now be independently functional - complete DevContainer experience

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T038 [P] Add recommended VS Code extensions to .vscode/extensions.json
- [ ] T039 [P] Add VS Code workspace settings for TypeScript in .vscode/settings.json
- [ ] T040 [P] Add VS Code workspace settings for formatting (2 spaces) in .vscode/settings.json
- [ ] T041 Document complete feature in root README.md (DevContainer section)
- [ ] T042 Add badge or note about DevContainer support to root README.md
- [ ] T043 Validate container build time < 10 minutes (manual test)
- [ ] T044 Validate environment ready time < 5 minutes post-build (manual test)
- [ ] T045 Create container rebuild test checklist in specs/001-devcontainer-setup/quickstart.md
- [ ] T046 Final validation: Complete workshop participant journey simulation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent from US1 but builds on it
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent but enhances US1

### Within Each User Story

- Configuration tasks before documentation tasks
- Research tasks must complete before implementation
- Manual validation after implementation complete
- Documentation updates after features work

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational research tasks marked [P] can run in parallel (T006, T007)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within US2: Research tasks (T021, T022) can run in parallel
- Within US3: Research task (T029) and .env.example update (T030) can run in parallel
- All Polish phase tasks marked [P] can run in parallel (T038, T039, T040)

---

## Parallel Example: User Story 2

```bash
# Launch research tasks for User Story 2 together:
Task: "Research OpenCode required extensions in specs/001-devcontainer-setup/research.md"
Task: "Research OpenCode workspace settings in specs/001-devcontainer-setup/research.md"

# After research, implementation tasks run sequentially (depend on research)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → T001-T004
2. Complete Phase 2: Foundational → T005-T010 (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 → T011-T020
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Participants can start workshop with functional environment

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T010)
2. Add User Story 1 → Test independently → Workshop-ready! (T011-T020)
3. Add User Story 2 → Test independently → Enhanced with AI assistance (T021-T028)
4. Add User Story 3 → Test independently → Complete professional experience (T029-T037)
5. Polish → Production-ready (T038-T046)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T010)
2. Once Foundational is done:
   - Developer A: User Story 1 (T011-T020)
   - Developer B: User Story 2 research (T021-T022) - waits for A to finish T008-T010
   - Developer C: User Story 3 research (T029) - can start independently
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Validation is manual per project constitution (no automated tests)
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- All file paths are absolute from repository root
- DevContainer conventions: .devcontainer/ for config, .vscode/ for editor settings

---

## Validation Checklist

After implementation, verify:

- [ ] Container builds successfully on all platforms (Windows/Mac/Linux)
- [ ] All 6 npm scripts execute without errors
- [ ] TypeScript compilation works (`npx tsc`)
- [ ] OpenCode integration functional
- [ ] API keys persist across rebuilds
- [ ] Build time < 10 minutes
- [ ] Environment ready < 5 minutes post-build
- [ ] Spanish locale configured correctly
- [ ] Documentation is clear and complete
- [ ] .env file properly gitignored
