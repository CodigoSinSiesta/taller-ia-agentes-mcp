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
