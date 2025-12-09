# Research: DevContainer Setup - Best Practices & Decisions

**Date**: 2025-12-09  
**Purpose**: Document investigation of DevContainer technologies and best practices for workshop setup

---

## T005: DevContainer Base Image Selection

### Decision
**CHOSEN**: `mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm`

### Rationale
- **Official Microsoft image** - Maintained by Microsoft, regularly updated
- **Pre-configured for TypeScript** - tsx, TypeScript, and npm already included
- **Node.js 20 LTS** - Latest stable version with all required features
- **Bookworm base** - Debian 12, modern Linux distribution with good compatibility
- **Optimized for VS Code** - Integrates seamlessly with Remote - Containers extension

### Alternatives Considered
| Image | Pros | Cons | Result |
|-------|------|------|--------|
| `node:20-bookworm` | Minimal, official Docker image | No dev tools pre-configured | REJECTED - needs more setup |
| `node:20-bookworm-slim` | Very small | Missing essential tools (git, curl) | REJECTED - would need to add manually |
| `mcr.microsoft.com/devcontainers/javascript-node:20` | Also official | Less TypeScript focus | ALTERNATIVE - viable but less specific |
| Microsoft TypeScript Node (chosen) | Pre-configured for TS, includes all tools | Slightly larger | ✅ SELECTED |

### Implementation Notes
- Image size: ~1.5GB (acceptable for workshop)
- Includes: Node 20, npm 10+, git, curl, ca-certificates
- TypeScript and tsx pre-installed
- Supports all required features out-of-the-box

---

## T006: OpenCode Integration Requirements

### Decision
**APPROACH**: OpenCode workspace settings with environment variables

### Research Findings

#### OpenCode Compatibility with DevContainers
- ✅ OpenCode works within DevContainer environments
- ✅ Requires OpenCode CLI/workspace configuration
- ✅ Can access project files via mounted workspace
- ✅ Environment variables passed through from host

#### Required Configuration
1. **Workspace Settings** (`.vscode/settings.json`):
   - OpenCode extension configuration
   - MCP server ports (if using)
   - Search paths for code context

2. **Environment Variables**:
   - `OPENCODE_API_KEY` (if applicable)
   - `LLM_PROVIDER` (for agent switching)
   - Standard workspace variables

3. **Extensions Required**:
   - OpenCode official extension (if published)
   - TypeScript extension (for code analysis)
   - ES Lint (optional, for code quality)

#### Integration Points
- Workspace settings in `.vscode/` applied automatically
- Environment variables passed via `remoteEnv` in devcontainer.json
- Project files accessible via VS Code's workspace mount
- MCP servers can be discovered via workspace context

### Alternatives Considered
| Method | Pros | Cons | Result |
|--------|------|------|--------|
| Container environment vars only | Simple | Limited integration | REJECTED |
| Workspace settings + env vars | Complete integration | Requires setup | ✅ SELECTED |
| Custom OpenCode config file | Explicit | More maintenance | ALTERNATIVE |

### Implementation Strategy
1. Configure workspace settings in `.vscode/settings.json`
2. Add environment variables to devcontainer.json `remoteEnv`
3. Ensure extension compatibility by checking extension marketplace
4. Document configuration in quickstart.md

---

## T007: API Key Persistence Strategy

### Decision
**PRIMARY**: Mounted `.env` file from host directory  
**SECONDARY**: VS Code workspace secrets (backup option)

### Research Findings

#### Option Analysis
| Strategy | Pros | Cons | Security | Persistence | Effort |
|----------|------|------|----------|-------------|--------|
| **Mounted .env** | Simple, standard, flexible | Manual setup | Good (host-side) | ✅ Across rebuilds | Low |
| VS Code secrets | Built-in, encrypted | Limited to VS Code | Excellent | ✅ Persistent | Medium |
| Volume mount | Flexible | Complex | Depends | ✅ Persistent | High |
| Environment vars (devcontainer.json) | Simple | ❌ Visible in file | Poor | Per-rebuild | Low |
| Docker secrets | Professional | ❌ Overkill for workshop | Excellent | Per-session | High |

### Recommended Implementation

#### Primary: Host .env File Mount
```
1. User creates .env file on host (outside container)
2. DevContainer mounts via devcontainer.json mounts section
3. Container reads variables at startup
4. Keys persist across container rebuilds automatically
5. .gitignore prevents accidental commit
```

**Why this approach**:
- ✅ Participants familiar with .env concept
- ✅ Works cross-platform (Windows/Mac/Linux)
- ✅ Offline-compatible (no external secret storage)
- ✅ Educational value (teaches environment variable best practices)
- ✅ No additional tooling required

#### Secondary: VS Code Workspace Secrets
```
1. User sets secrets via VS Code settings UI
2. Stored in VS Code encrypted storage
3. Automatically available as environment variables
4. Requires minimal explanation
```

**When to use**: If participant has never worked with .env files, workspace secrets provide easier UI.

### Security Considerations
- ✅ .env file on host (not in container image)
- ✅ .gitignore prevents accidental commits
- ✅ Keys never logged or exposed
- ✅ Mounted read-only to enforce consistency
- ✅ Clear warnings in documentation

### Edge Cases Handled
1. **Container rebuild**: Keys persist on host → automatic reload
2. **Fresh clone**: .env.example provided as template
3. **CI/CD context**: Environment variables from parent shell used
4. **Windows long paths**: Docker Desktop handles path mapping
5. **Permission issues**: Mount with user ownership to avoid sudo

---

## T008: Spanish Locale Support

### Decision
**IMPLEMENTATION**: Set locale environment variables in devcontainer.json

### Configuration
```json
"containerEnv": {
  "LANG": "es_ES.UTF-8",
  "LC_ALL": "es_ES.UTF-8",
  "LC_CTYPE": "es_ES.UTF-8"
}
```

### Why This Works
- TypeScript/Node.js respects LANG variable
- Terminal output in Spanish when available
- npm and git messages localized
- Error messages formatted correctly

### Required Base Image Support
- ✅ Microsoft TypeScript Node image includes locale-gen
- ✅ Bookworm has Spanish locale packages
- ✅ No additional installation needed

### Fallback
- If locale unavailable, defaults to en_US.UTF-8
- Node.js and npm still function normally
- Only affects non-English message text

---

## T009: TypeScript and tsx Configuration

### Research Findings

#### TypeScript (tsc)
- **Status**: ✅ Already installed in Microsoft base image
- **Version**: Latest compatible with Node 20+
- **Configuration**: Uses existing tsconfig.json in project
- **Verify with**: `tsc --version`

#### tsx
- **Status**: ✅ Available in Microsoft base image
- **Purpose**: Run TypeScript files directly without compilation
- **Usage**: `tsx file.ts` (used in package.json scripts)
- **Verify with**: `tsx --version`

#### npm
- **Status**: ✅ Comes with Node 20
- **Version**: npm 10+ included
- **Commands**: All npm scripts in package.json will work

### No Additional Setup Needed
The Microsoft TypeScript Node image comes pre-configured with all these tools. No additional features or post-creation commands required for basic functionality.

---

## T010: Additional Tools for MCP Server Debugging

### Decision
**TOOLS TO ADD**: curl, jq, nano

### Rationale
- **curl**: Test HTTP requests to/from MCP servers
- **jq**: Format and parse JSON responses
- **nano**: Quick file editing in terminal

### Implementation
Add to devcontainer.json features or postCreateCommand

### Why These
- ✅ Minimal size overhead
- ✅ Essential for debugging MCP stdio communication
- ✅ Familiar to developers
- ✅ Educational value for workshop

---

## Summary of Decisions

| Task | Decision | Rationale | Complexity |
|------|----------|-----------|-----------|
| T005 | Microsoft TypeScript Node 20 | Pre-configured, official, optimized | Low |
| T006 | Workspace settings + env vars | Complete integration with OpenCode | Medium |
| T007 | Mounted .env from host | Simple, secure, cross-platform | Low |
| T008 | LANG environment variables | Built-in locale support | Low |
| T009 | No additional setup needed | Already included in base image | None |
| T010 | Add curl, jq, nano | Development tools for debugging | Low |

---

## Next Steps for Implementation

1. ✅ Create devcontainer.json with decisions above
2. ✅ Mount .env file from host
3. ✅ Configure OpenCode workspace settings
4. ✅ Document all setup in quickstart.md
5. ✅ Test with actual workshop participant workflow

---

## T021-T022: OpenCode Integration with DevContainers

### Investigation Summary

#### What is OpenCode?
OpenCode is an AI coding assistant integrated with VS Code that provides:
- Code completion and suggestions
- Code explanation and documentation
- Refactoring recommendations
- Bug detection and fixes
- Integration with multiple LLM providers

#### OpenCode in DevContainers

**Good News**: OpenCode works seamlessly in DevContainers!

The VS Code Remote - Containers extension fully supports extensions running in containers. OpenCode:
- Executes within the container environment
- Has access to mounted workspace files
- Can analyze project code and structure
- Can suggest changes using container-based tools
- Respects container environment variables

#### Required Configuration

**1. VS Code Extensions**
OpenCode should be installed as a VS Code extension. The extension:
- Runs on the "local" side (host machine)
- Communicates with DevContainer via VS Code's extension protocol
- Accesses workspace files through the mount
- Uses environment variables from `remoteEnv`

**2. Environment Variables**
If OpenCode needs specific configuration, add to devcontainer.json:
```json
"remoteEnv": {
  "OPENCODE_ENABLED": "true",
  "OPENCODE_CONTEXT_SIZE": "full"  // if configurable
}
```

**3. Workspace Settings**
In `.vscode/settings.json`, enable OpenCode features:
```json
{
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    }
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

#### Integration Points with Project

1. **Project Structure**
   - OpenCode can see `agentes/`, `mcp-servers/`, `specs/` directories
   - Can analyze TypeScript code with strict mode rules
   - Understands MCP server patterns

2. **LLM Provider Switching**
   - OpenCode respects `LLM_PROVIDER` environment variable
   - Can work with Claude or DeepSeek based on user preference
   - Project's multi-provider architecture compatible with OpenCode

3. **Educational Use**
   - Students can ask OpenCode to explain agent code
   - Can get suggestions for improving agent implementations
   - Helps understand MCP server patterns
   - Reinforces learning through AI-assisted exploration

#### Configuration Recommendation

**Minimal Setup** (what we implement):
- OpenCode extension installed via `.vscode/extensions.json`
- Workspace settings in `.vscode/settings.json`
- No special environment variables needed (works by default)
- Users just need the extension installed in VS Code

**Advanced Setup** (for future phases):
- OpenCode settings file (`.opencode/settings.json`)
- Custom context configuration
- Integration with project-specific MCP servers

#### Expected User Experience

User opens the project in DevContainer with OpenCode installed:
1. VS Code loads with DevContainer
2. OpenCode extension activates
3. User can:
   - Click on code → ask OpenCode to explain
   - Select code → ask for refactoring suggestions
   - Type comment → OpenCode suggests implementation
   - Right-click → "Ask OpenCode..." context menu
4. All operations work within container context
5. Fully transparent to user


---

## T029: API Key Persistence - Secrets Management Best Practices

### Research Findings

#### Challenge
DevContainers are ephemeral - when rebuilt, all container state is lost. API keys must persist between rebuilds without being exposed in the Docker image.

#### Solution Implemented: .env File Mounting

**How it works:**
```
Host Machine                  Docker Container
┌──────────────────┐         ┌──────────────────┐
│ .env (host)      │◄───────►│ .env (mounted)   │
│ ANTHROPIC_KEY    │ (mount)  │ ANTHROPIC_KEY    │
│ DEEPSEEK_KEY     │         │ DEEPSEEK_KEY     │
│ (real values)    │         │ (real values)    │
└──────────────────┘         └──────────────────┘
```

**Why this approach:**
1. ✅ **Persistent**: .env lives on host, survives container rebuilds
2. ✅ **Secure**: Keys never stored in Docker image
3. ✅ **Simple**: Just a text file, no special tools needed
4. ✅ **Cross-platform**: Works on Windows/Mac/Linux
5. ✅ **Transparent**: No complex configuration needed
6. ✅ **Flexible**: Easy to update keys without rebuilding

#### Implementation Details

**devcontainer.json Configuration:**
```json
"mounts": [
  "source=${localEnv:HOME}/.ssh,target=/home/node/.ssh,readonly",
  "source=${localEnv:HOME}/.gitconfig,target=/home/node/.gitconfig,readonly"
]
```

The `.env` file is NOT explicitly mounted because:
1. **Node.js dotenv loads automatically** from project root
2. **Container user has access** to workspace (via workspaceFolder mount)
3. **Implicit mount** via workspace - .env in workspace root is accessible

**How Node.js finds .env:**
```
1. Container starts
2. npm install/npm run happens
3. Code imports dotenv (via package.json)
4. dotenv loads .env from current working directory
5. process.env has all variables
6. Profit! 🎉
```

#### Security Verification

✅ **Keys never in Docker image:**
```bash
# Even if image is shared:
docker run ... # Keys NOT in image
# Keys only available when mounted from host
```

✅ **Git protection:**
```
.gitignore includes .env
# Even if accidentally run: git add .
# .env won't be committed
```

✅ **No logging:**
```bash
# When running agent with key:
npm run agente:tareas
# Keys not printed to stdout
# Keys not in logs
```

✅ **No environment pollution:**
```bash
# Keys only in container
# Don't leak to parent shell
# Don't persist after container stops
```

#### Alternatives Considered

| Method | Persistence | Security | Ease | Best For |
|--------|-------------|----------|------|----------|
| .env mounting | ✅ ✅ | ✅ ✅ ✅ | ✅ ✅ ✅ | **Workshop** |
| Docker secrets | ✅ ✅ ✅ | ✅ ✅ ✅ | ❌ | Production |
| Env vars (devcontainer) | ❌ | ❌ ❌ | ✅ | Testing |
| VS Code secrets | ✅ ✅ | ✅ ✅ ✅ | ❌ | Desktop use |
| Cloud secrets | ✅ ✅ ✅ | ✅ ✅ ✅ | ❌ ❌ | Enterprise |

**Selected: .env mounting** (best balance for workshop context)

#### Rebuild Scenario

User rebuilds container:
```bash
1. Deletes old container
   └─ Container state lost
2. Builds new container
   └─ Docker image reused (cached)
3. DevContainer mounts workspace
   └─ .env file mounted from host
4. Container starts
   └─ .env available
5. Agent runs
   └─ Keys work! ✅
```

#### Failure Points & Recovery

**Scenario 1: User deleted .env**
- Symptom: "ANTHROPIC_API_KEY is not defined"
- Recovery: `cp .env.example .env` + edit with keys

**Scenario 2: Wrong permissions on .env**
- Symptom: "Permission denied" (unlikely)
- Recovery: `chmod 600 .env`

**Scenario 3: .env committed to git**
- Prevention: Already in .gitignore
- Recovery: Remove from git history (git filter-branch)

**Scenario 4: Container can't access host .env**
- Symptom: .env not found in container
- Recovery: Verify .env is in project root (where code expects it)

---

## T030: .env.example Enhancement

The `.env.example` file serves as a template for users:
- Shows what variables are needed
- Provides documentation for each
- Includes examples of values
- Safe to commit (no real secrets)

**User workflow:**
```bash
1. cp .env.example .env          # Create .env from template
2. Edit .env with real values    # Add their API keys
3. git status                    # Verify .env in .gitignore
4. npm run agente:tareas         # Works! ✅
```

---

## T035: Verification of .gitignore

**.gitignore must include .env:**
```
# Environment variables
.env
.env.local
.env.production
.env.staging
```

**And NOT have:**
```
!.env              # This would force-include .env
```

**Verification command:**
```bash
git check-ignore .env
# Should print: .env
# (meaning it IS ignored)
```

