# 🐳 DevContainer para Taller IA

Este DevContainer está **optimizado para GitHub Codespaces** y también funciona localmente con Docker.

## 🎯 Objetivo

Proporcionar un entorno de desarrollo preconfigurado para el **Taller de IA: Agentes y MCP Servers** que:

1. **Funcione en GitHub Codespaces** (navegador, sin instalaciones)
2. **Soporte ambos proveedores LLM**: Claude y DeepSeek
3. **Incluya herramientas esenciales**: TypeScript, Node.js, Git, GitHub CLI
4. **Sea seguro**: Las API keys se manejan con GitHub Secrets (Codespaces) o .env (local)

## 🌐 GitHub Codespaces (Recomendado)

### Flujo de Configuración

```
Usuario → GitHub Repository → Codespaces → GitHub Secrets → Entorno Listo
```

**Pasos detallados:**

1. **Crear Codespace:**
   - En tu repositorio GitHub, haz clic en **Code** → **Codespaces**
   - **Create codespace on main**
   - VS Code Online se abrirá automáticamente

2. **Configurar GitHub Secrets:**
   ```
   Settings → Secrets and variables → Codespaces → New repository secret
   ```
   - Añade `ANTHROPIC_API_KEY` (para Claude)
   - Añade `DEEPSEEK_API_KEY` (para DeepSeek)
   - Opcional: `LLM_PROVIDER` ("claude" o "deepseek")

3. **¡Listo!** Las variables se cargan automáticamente en el Codespace.

### Características de Codespaces

✅ **Sin Docker local** - Todo en la nube  
✅ **GitHub Secrets integrado** - Seguridad nativa  
✅ **Hardware escalable** - Más RAM/CPU si es necesario  
✅ **Persistencia automática** - Guarda cambios automáticamente  
✅ **Prebuilds** - Construcción más rápida  

## 💻 DevContainer Local (Alternativa)

### Requisitos
- Docker Desktop instalado
- VS Code con extensión "Dev Containers"
- Git (opcional, para clonar)

### Flujo Local

```
Clonar repo → Abrir en VS Code → Reopen in Container → .env → ¡Listo!
```

**Diferencias clave con Codespaces:**

| Característica | Codespaces | DevContainer Local |
|----------------|------------|-------------------|
| API Keys | GitHub Secrets | Archivo `.env` |
| Hardware | GitHub cloud | Tu máquina local |
| Acceso | Navegador o VS Code | Solo VS Code local |
| SSH/Git | Automático (GitHub) | Configuración manual |

## 🔐 Gestión de API Keys

### Método 1: GitHub Secrets (Codespaces)

```bash
# Las variables se exponen automáticamente como:
# ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, LLM_PROVIDER
```

**Ventajas:**
- Encriptadas por GitHub
- No se escriben en disco en el Codespace
- Fáciles de rotar/actualizar

### Método 2: Archivo `.env` (Local)

```bash
# En la raíz del proyecto:
cp .env.example .env
# Edita .env con tus claves reales
```

**Seguridad:**
- `.env` está en `.gitignore`
- NO se commitea al repositorio
- Persiste entre reconstrucciones del contenedor (montado desde host)

## 🛠️ Configuración Técnica

### Imagen Base
```json
"image": "mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm"
```

**Incluye:**
- Node.js 20 LTS
- TypeScript 5+
- npm 10+
- Git preinstalado
- **OpenCode** (agente AI de línea de comandos)

### Características (Features)
```json
"features": {
  "ghcr.io/devcontainers/features/git:1": {},
  "ghcr.io/devcontainers/features/github-cli:1": {}
}
```

### Personalizaciones VS Code
- **ESLint** y **Prettier** para calidad de código
- **TypeScript Next** para soporte TS más reciente
- **GitHub Copilot** y **Copilot Chat** para asistencia AI
- Configuración de español (`es_ES.UTF-8`)

### Comandos Automáticos
```json
"postCreateCommand": "npm install && npm run build",
"postStartCommand": "echo 'Welcome to Taller IA Codespace'"
```

## 🔄 Migración entre Métodos

### De Local a Codespaces
1. Copia tus claves de `.env` a GitHub Secrets
2. Elimina `.env` local (opcional)
3. Crea un nuevo Codespace

### De Codespaces a Local
1. Crea un archivo `.env` con los valores de tus GitHub Secrets
2. Usa DevContainer local

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY not defined" en Codespaces
1. Verifica que añadiste el Secret en GitHub
2. Los Secrets solo se cargan al CREAR el Codespace
3. Crea un nuevo Codespace después de añadir Secrets

### "Docker not found" en Local
1. Abre Docker Desktop
2. Verifica que está ejecutándose (ícono en bandeja)
3. Reinicia VS Code

### "Extensiones no se instalan"
1. En VS Code, abre la paleta de comandos (`Ctrl+Shift+P`)
2. Ejecuta: `Dev Containers: Rebuild Container`

## 📚 Recursos

- [GitHub Codespaces Docs](https://docs.github.com/es/codespaces)
- [Dev Containers Specification](https://containers.dev/)
- [Taller IA Quickstart](../specs/001-devcontainer-setup/quickstart.md)

---

**Nota:** Este DevContainer está diseñado específicamente para el **Taller de IA**. En el taller usaremos **GitHub Codespaces** como entorno principal.