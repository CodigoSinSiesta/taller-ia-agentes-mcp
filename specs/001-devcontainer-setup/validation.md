# Validation & Testing Guide - DevContainer Setup

**Purpose**: Comprehensive validation checklist to ensure DevContainer works correctly on all platforms and configurations.

**Audience**: Developers, maintainers, and workshop coordinators

---

## Phase 1: Environment Setup Validation

### Runtime Requirements Check

```bash
# Inside DevContainer
node --version        # Should be v20.x.x or higher
npm --version        # Should be 10.x.x or higher
tsc --version        # Should be 5.x.x or higher
tsx --version        # Should be 4.x.x or higher
git --version        # Should be 2.x.x or higher
```

**Expected Output:**
```
v20.11.0 or higher
10.5.0 or higher
5.5.0 or higher
4.19.0 or higher
git version 2.40.0 or higher
```

---

## Phase 2: Project Setup Validation

### Installation Check

```bash
# Inside DevContainer
npm install          # Should complete without errors
npm run build        # Should compile TypeScript successfully
```

**Expected Output:**
```
added XXX packages in X.XXs
Successfully compiled X files
```

### Directory Structure Check

```bash
# Verify all essential directories exist
ls -d agentes/
ls -d mcp-servers/
ls -d specs/
ls -d .devcontainer/
ls -d .vscode/
```

**All should exist without errors**

---

## Phase 3: Agent Execution Validation

### Test Each Agent with Claude

```bash
# Test basic agent
npm run agente:tareas:claude

# Expected: Agent starts and shows:
# - "Welcome to Task Agent"
# - Tool list
# - Waiting for input prompt
```

### Test Each Agent with DeepSeek

```bash
# Test with DeepSeek (requires DEEPSEEK_API_KEY in .env)
npm run agente:tareas:deepseek

# Expected: Same behavior as Claude version
```

### Test Investigador Agent

```bash
npm run agente:investigador:claude "¿Cómo funcionan los agentes?"

# Expected:
# - Planning phase completes
# - Investigation executes
# - Synthesis provides answer
```

---

## Phase 4: MCP Server Validation

### Test Notes Server

```bash
# Terminal 1: Start server
npm run mcp:notas

# Terminal 2: Test with command
echo '{"jsonrpc":"2.0","method":"call_tool","params":{"name":"crear_nota","arguments":{"titulo":"Test","contenido":"Hello"}}}' | node -e "..."

# Expected: JSON-RPC response with success
```

### Test Utils Server

```bash
# Terminal 1: Start server
npm run mcp:utils

# Expected: Server listens and shows available tools
```

---

## Phase 5: API Key Configuration Validation

### Test Claude Authentication

```bash
# With ANTHROPIC_API_KEY configured
npm run agente:tareas:claude

# Attempt a simple query
# Expected: Agent responds successfully
```

### Test DeepSeek Authentication

```bash
# With DEEPSEEK_API_KEY configured
npm run agente:tareas:deepseek

# Attempt a simple query
# Expected: Agent responds successfully
```

### Test API Key Switching

```bash
# With both keys configured
npm run agente:tareas:claude      # Works?
npm run agente:tareas:deepseek    # Works?

# Switch in runtime
export LLM_PROVIDER=deepseek
npm run agente:tareas             # Works?
```

---

## Phase 6: Platform-Specific Validation

### Windows (PowerShell/Git Bash)

```bash
# Check line endings
git config core.autocrlf   # Should be "true" or "input"

# Test script execution
npm run build             # Should work
npm run agente:tareas     # Should work

# Verify paths
echo $HOME               # Should show home directory
```

### macOS

```bash
# Check case sensitivity
ls -d ./agentes/ ./Agentes/ ./AGENTES/
# Should only find ./agentes/ (case-sensitive)

# Test performance
time npm run build
# Should complete quickly
```

### Linux

```bash
# Check permissions
ls -l .devcontainer/     # Should be readable
stat .env                # Should show correct ownership

# Test in different shells
bash --version
zsh --version           # If available
sh --version
```

---

## Phase 7: Volume Mount Validation

### .env Persistence

```bash
# Create .env with test value
echo 'TEST_VAR="hello"' >> .env

# Exit container
exit

# Rebuild container
# (From VS Code: Dev Containers: Rebuild Container)

# Re-enter and check
echo $TEST_VAR
# Should show: hello
```

### SSH Keys Access

```bash
# Check SSH mounting (if configured)
ls -la ~/.ssh/
# Should show your host SSH keys (if present)
```

---

## Phase 8: Documentation Validation

### Check All Docs Exist

```bash
# Verify documentation files
ls -l README.md
ls -l specs/001-devcontainer-setup/spec.md
ls -l specs/001-devcontainer-setup/plan.md
ls -l specs/001-devcontainer-setup/tasks.md
ls -l specs/001-devcontainer-setup/research.md
ls -l specs/001-devcontainer-setup/quickstart.md
```

### Verify .env.example

```bash
# Check that .env.example doesn't have secrets
cat .env.example | grep -i "sk-ant\|sk-\*"
# Should NOT match any real keys

# Verify instructions are clear
grep -c "ANTHROPIC_API_KEY\|DEEPSEEK_API_KEY" .env.example
# Should show 2 (one for each provider)
```

---

## Phase 9: Performance Validation

### Build Time

```bash
# Time the first build
time npm run build

# Should complete in < 5 minutes
```

### Container Build Time

```bash
# Time the DevContainer build
# (From VS Code: Dev Containers: Rebuild Container)

# First build: < 10 minutes
# Subsequent builds: < 3 minutes (cached)
```

### Agent Startup Time

```bash
# Time agent startup
time npm run agente:tareas:claude

# Should respond to first input within 5 seconds
```

---

## Phase 10: Error Handling Validation

### Missing .env

```bash
# Temporarily rename .env
mv .env .env.bak

# Try to run agent
npm run agente:tareas:claude

# Expected: Clear error message about ANTHROPIC_API_KEY
# Not: Cryptic Node error
```

### Invalid API Key

```bash
# Set invalid key
export ANTHROPIC_API_KEY="invalid-key"

# Try to run agent
npm run agente:tareas:claude

# Expected: Clear error from Claude API
# Should show: "Invalid API key" or similar
```

### Missing Dependencies

```bash
# Temporarily break a dependency
mv node_modules node_modules.bak

# Try to run
npm run agente:tareas

# Expected: npm run install suggestion
# Or install completes automatically
```

---

## Validation Checklist

### ✅ Before Publishing DevContainer

- [ ] Node.js 20+ working
- [ ] npm install completes successfully
- [ ] npm run build works
- [ ] npm run agente:tareas:claude works
- [ ] npm run agente:tareas:deepseek works
- [ ] npm run agente:investigador:claude works
- [ ] npm run mcp:notas starts
- [ ] npm run mcp:utils starts
- [ ] Claude authentication works
- [ ] DeepSeek authentication works
- [ ] API key switching works
- [ ] .env persists across rebuilds
- [ ] All documentation exists
- [ ] .env.example is clean (no real keys)
- [ ] Error messages are helpful
- [ ] Works on Windows
- [ ] Works on macOS
- [ ] Works on Linux
- [ ] Build time < 10 minutes (first)
- [ ] Build time < 3 minutes (subsequent)

### ✅ Workshop Day Preparation

- [ ] Test on actual laptop (not VM)
- [ ] Test with both API providers
- [ ] Verify network bandwidth sufficient
- [ ] Have offline fallback plan
- [ ] Test troubleshooting solutions
- [ ] Brief organizers on setup process
- [ ] Have IT contact for Docker issues

---

## Troubleshooting During Validation

**Issue: Container build fails**
- Check Docker Desktop is running
- Check internet connection
- Try: `docker system prune -a` and rebuild

**Issue: Agent doesn't authenticate**
- Verify ANTHROPIC_API_KEY is set
- Check key isn't expired
- Test with: `echo $ANTHROPIC_API_KEY`

**Issue: npm install hangs**
- Check internet connection
- Try: `npm cache clean --force`
- Increase Docker memory allocation

**Issue: TypeScript compilation fails**
- Verify Node.js version: v20+
- Try: `npm run build -- --listFilesOnly`
- Check for syntax errors: `tsc --noEmit`

---

## Performance Baselines

| Metric | Target | Acceptable |
|--------|--------|-----------|
| First build time | < 10 min | < 15 min |
| Rebuild time | < 3 min | < 5 min |
| Agent startup | < 5 sec | < 10 sec |
| First prompt response | < 10 sec | < 20 sec |
| npm install | < 2 min | < 5 min |
| npm build | < 30 sec | < 1 min |

---

## Success Criteria (All Must Pass)

1. ✅ Environment check: All versions correct
2. ✅ Project setup: All commands work
3. ✅ Agent execution: All agents respond
4. ✅ MCP servers: Both start successfully
5. ✅ Authentication: Both providers work
6. ✅ Persistence: .env survives rebuild
7. ✅ Documentation: All files present & clear
8. ✅ Performance: Within baselines
9. ✅ Error handling: Messages are helpful
10. ✅ Cross-platform: Works on all OS

