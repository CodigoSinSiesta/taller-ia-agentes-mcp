# Feature Specification: DevContainer Setup para Taller IA

**Feature Branch**: `001-devcontainer-setup`  
**Created**: 2025-12-09  
**Status**: Draft  
**Input**: User description: "Creemos un devcontainer con todo lo necesario para poder trabajar. Poder arrancar los agentes y poder utilizar opencode"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entorno de Desarrollo Funcional (Priority: P1) 🎯 MVP

Un participante del taller abre el proyecto en VS Code con la extensión Dev Containers y obtiene un entorno completamente configurado, listo para ejecutar agentes de IA sin necesidad de instalar nada manualmente.

**Why this priority**: Esta es la funcionalidad fundamental. Sin un entorno de desarrollo funcional, los participantes no pueden comenzar el taller. Elimina los problemas de "funciona en mi máquina" y garantiza consistencia.

**Independent Test**: Abrir el proyecto en VS Code con Dev Containers, esperar a que el contenedor se construya, ejecutar `npm run agente:tareas:claude` - el agente debe ejecutarse correctamente mostrando su funcionalidad.

**Acceptance Scenarios**:

1. **Given** un clon nuevo del repositorio, **When** el usuario lo abre en VS Code con la extensión Dev Containers, **Then** el contenedor se construye automáticamente y todas las dependencias se instalan
2. **Given** el devcontainer está en ejecución, **When** el usuario ejecuta `npm run agente:tareas:claude`, **Then** el agente se ejecuta sin errores de entorno
3. **Given** el devcontainer está en ejecución, **When** el usuario ejecuta `npm run mcp:notas`, **Then** el servidor MCP se inicia correctamente
4. **Given** el devcontainer está en ejecución, **When** el usuario ejecuta `npx tsc`, **Then** TypeScript compila el proyecto exitosamente
5. **Given** el devcontainer está en ejecución, **When** el usuario verifica la versión de Node, **Then** muestra Node.js 20.0.0 o superior

---

### User Story 2 - Integración con OpenCode (Priority: P2)

Un participante del taller utiliza OpenCode (el asistente de IA para código) directamente dentro del entorno devcontainer para interactuar con el código, hacer preguntas y recibir asistencia durante el aprendizaje.

**Why this priority**: OpenCode mejora significativamente la experiencia de aprendizaje al proporcionar asistencia AI durante el taller, pero el entorno debe funcionar primero (depende de P1).

**Independent Test**: Abrir OpenCode en el devcontainer, solicitar que explique un archivo como `agentes/agente-tareas/index.ts` - debe recibir una respuesta precisa y contextual.

**Acceptance Scenarios**:

1. **Given** el devcontainer está en ejecución, **When** el usuario invoca OpenCode, **Then** OpenCode puede acceder y analizar los archivos del proyecto
2. **Given** OpenCode está activo, **When** el usuario pregunta sobre la estructura del código, **Then** las respuestas reflejan la arquitectura real del proyecto
3. **Given** OpenCode está activo, **When** el usuario solicita modificaciones de código, **Then** los cambios se pueden aplicar dentro del contenedor
4. **Given** OpenCode está activo, **When** el usuario solicita ejecutar comandos, **Then** los comandos se ejecutan en el contexto del devcontainer

---

### User Story 3 - Gestión Segura de API Keys (Priority: P3)

Un participante del taller puede configurar fácilmente sus API keys para Claude y DeepSeek sin exponerlas en el código o en la imagen del contenedor, y estas claves persisten entre reconstrucciones del contenedor.

**Why this priority**: La gestión segura de claves es importante pero los participantes pueden configurar variables de entorno manualmente al inicio (P1 funciona sin esto).

**Independent Test**: Agregar API keys a través de configuración de workspace o archivo .env (no committeado), reiniciar el terminal, verificar que los agentes pueden autenticarse correctamente.

**Acceptance Scenarios**:

1. **Given** el usuario tiene API keys, **When** las configura en los settings del devcontainer, **Then** las claves están disponibles como variables de entorno en todas las terminales
2. **Given** las API keys están configuradas, **When** el usuario ejecuta agentes, **Then** la autenticación es exitosa
3. **Given** las API keys están en archivo .env, **When** el usuario hace commit del código, **Then** el archivo .env no se incluye (está en .gitignore)
4. **Given** las API keys están configuradas, **When** el contenedor se reconstruye, **Then** las claves persisten y no necesitan ser reconfiguradas

---

### Edge Cases

- **¿Qué pasa cuando el contenedor se reconstruye?** Las API keys deben persistir vía workspace settings o .env montado desde el host
- **¿Cómo maneja el sistema versiones incorrectas de Node.js?** El devcontainer debe especificar exactamente Node 20+ para evitar incompatibilidades
- **¿Qué pasa cuando hay vulnerabilidades en dependencias npm?** La construcción debe completarse pero mostrar advertencias
- **¿Cómo funciona en diferentes sistemas operativos (Windows/Mac/Linux)?** Debe funcionar consistentemente en todas las plataformas a través de Docker
- **¿Qué pasa si Docker no está instalado?** El README debe incluir instrucciones claras sobre prerequisitos
- **¿Qué pasa si la extensión Dev Containers no está instalada?** VS Code debe sugerir su instalación automáticamente

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El entorno DEBE incluir Node.js versión 20.0.0 o superior
- **FR-002**: El entorno DEBE tener todas las dependencias npm pre-instaladas desde package.json
- **FR-003**: El entorno DEBE incluir el compilador TypeScript (tsc) accesible globalmente
- **FR-004**: El entorno DEBE soportar la ejecución de todos los scripts npm definidos en package.json
- **FR-005**: El entorno DEBE proporcionar tsx para ejecutar archivos TypeScript directamente
- **FR-006**: El entorno DEBE incluir herramientas CLI de OpenCode y su configuración
- **FR-007**: El entorno DEBE preservar las API keys del usuario entre reconstrucciones del contenedor
- **FR-008**: El entorno DEBE incluir git para operaciones de control de versiones
- **FR-009**: El entorno DEBE soportar autenticación con APIs de Claude y DeepSeek
- **FR-010**: El entorno DEBE tener soporte para mensajes de terminal en español
- **FR-011**: El entorno DEBE incluir herramientas de desarrollo útiles (curl, jq) para debugging de MCP servers
- **FR-012**: El entorno DEBE mantener la configuración de VS Code específica del proyecto

### Key Entities

- **DevContainer Configuration**: Define la imagen del contenedor, features, extensiones y configuración del entorno
- **Environment Variables**: API keys (ANTHROPIC_API_KEY, DEEPSEEK_API_KEY) y selección de proveedor (LLM_PROVIDER)
- **VS Code Extensions**: Extensiones que deben instalarse automáticamente en el contenedor
- **Workspace Settings**: Configuración específica de VS Code para el proyecto (formateo, linting, OpenCode)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los participantes del taller pueden abrir el proyecto y tener un entorno funcional dentro de 5 minutos desde que el contenedor termina de construirse
- **SC-002**: Los 6 scripts npm (agente:tareas:claude, agente:tareas:deepseek, agente:investigador:claude, agente:investigador:deepseek, mcp:notas, mcp:utils) se ejecutan exitosamente en el devcontainer
- **SC-003**: La integración con OpenCode funciona sin configuración adicional por parte de los participantes
- **SC-004**: Cero problemas relacionados con el entorno reportados durante sesiones de taller (sin errores de "dependencia faltante" o "versión incorrecta de Node")
- **SC-005**: La construcción del contenedor se completa en menos de 10 minutos con una conexión a internet estándar
- **SC-006**: 100% de los participantes pueden ejecutar al menos un agente exitosamente dentro de 10 minutos de abrir el proyecto
- **SC-007**: Los participantes pueden reconstruir el contenedor sin perder su configuración de API keys

## Assumptions

- Los participantes tienen Docker Desktop instalado y en ejecución
- Los participantes tienen VS Code con la extensión Dev Containers instalada
- Los participantes tienen claves API válidas para al menos un proveedor LLM (Claude o DeepSeek)
- Hay conexión a internet disponible para descarga de imagen del contenedor e instalación de paquetes npm
- La imagen base del devcontainer es Node.js 20+ (se recomienda imagen oficial de Microsoft)
- El proyecto ya tiene un package.json válido con todas las dependencias definidas
- OpenCode es compatible con entornos DevContainer (se asume que sí basado en el request del usuario)
