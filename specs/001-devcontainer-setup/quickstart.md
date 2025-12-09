# Guía Rápida: Configuración del Entorno

**Objetivo**: Configurar tu entorno de desarrollo para el Taller IA en menos de 10 minutos usando **GitHub Codespaces**.

---

## 🎯 Dos Opciones: Elige la tuya

### ✅ Opción Recomendada: GitHub Codespaces (En la Nube)

**Ventajas:**
- 🌐 Funciona en cualquier navegador
- ⚡ Sin instalaciones locales necesarias
- 🔐 GitHub Secrets para API keys (más seguro)
- 💻 Hardware potente en la nube
- ✅ Exactamente lo que usaremos en el taller

### 💻 Opción Alternativa: DevContainer Local

**Requisitos:**
- Docker Desktop instalado ([descargar](https://www.docker.com/products/docker-desktop))
- VS Code instalado ([descargar](https://code.visualstudio.com/))
- Extensión Dev Containers

**Nota:** En el taller usaremos GitHub Codespaces, pero esta opción también funciona.

---

## 🌐 Opción 1: GitHub Codespaces (Recomendado)

### Paso 1: Crear Codespace

1. Ve a tu repositorio en GitHub
2. Haz clic en el botón verde **Code**
3. Selecciona la pestaña **Codespaces**
4. Haz clic en **Create codespace on main**

⏳ Espera 2-3 minutos a que se construya. VS Code Online se abrirá automáticamente.

### Paso 2: Configurar GitHub Secrets (API Keys)

Para que tus API keys estén disponibles en Codespaces:

1. **En GitHub** (en tu navegador):
   - Ve a: `Settings` → `Secrets and variables` → `Codespaces`
   - Haz clic en **New repository secret**
   - Añade tus secretos:

   **Para Claude:**
   ```
   Name: ANTHROPIC_API_KEY
   Value: sk-ant-tu-clave-real
   ```

   **Para DeepSeek:**
   ```
   Name: DEEPSEEK_API_KEY
   Value: sk-tu-clave-real
   ```

   **Para elegir proveedor (opcional):**
   ```
   Name: LLM_PROVIDER
   Value: claude
   ```

2. **En Codespaces** (en VS Code Online):
   - Las variables se cargarán automáticamente
   - No necesitas crear `.env` para Codespaces

### Paso 3: Verificar que Funciona

```bash
# En la terminal de Codespaces
npm run agente:tareas:claude
# O con DeepSeek
npm run agente:tareas:deepseek
```

✅ ¡Listo! Ya está configurado completamente en Codespaces.

**OpenCode está incluido**: Ejecuta `opencode` para usar el agente AI de línea de comandos.

---

## 💻 Opción 2: DevContainer Local (Alternativa)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/[usuario]/taller-ia.git
cd taller-ia
```

### Paso 2: Abrir en VS Code

```bash
code .
```

### Paso 3: Abrir en DevContainer

Verás una notificación en la esquina inferior derecha sugiriendo "Reopen in Container". Haz clic en ella.

### Paso 4: Esperar a que se Construya

⏳ La primera vez tarda 5-10 minutos. La próxima vez será mucho más rápida.

---

## 🔑 Configurar API Keys (Paso 5)

### Si estás en Codespaces:
Ya configuraste GitHub Secrets en Pasos 2. **¡No necesitas hacer nada más!**
Las variables se cargan automáticamente en Codespaces.

### Si estás usando DevContainer Local:

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus claves:

#### Opción A: Usar Claude (recomendado para empezar)

```bash
ANTHROPIC_API_KEY="sk-ant-tu-clave-real"
LLM_PROVIDER="claude"
```
Obtén tu clave: [console.anthropic.com](https://console.anthropic.com)

#### Opción B: Usar DeepSeek (más económico)

```bash
DEEPSEEK_API_KEY="sk-tu-clave-real"
LLM_PROVIDER="deepseek"
```
Obtén tu clave: [platform.deepseek.com](https://platform.deepseek.com)

#### Opción C: Tener ambos configurados

```bash
ANTHROPIC_API_KEY="sk-ant-tu-clave-real"
DEEPSEEK_API_KEY="sk-tu-clave-real"
LLM_PROVIDER="claude"  # Por defecto usa Claude
```

**Cambiar entre proveedores en cualquier momento:**
```bash
# Cambiar a DeepSeek
export LLM_PROVIDER=deepseek
npm run agente:tareas

# Volver a Claude
export LLM_PROVIDER=claude
npm run agente:tareas
```

---

## ✅ Verificar que Todo Funciona

En **Codespaces** o **DevContainer Local**, ejecuta:

```bash
# Verifica versiones
node --version
npm --version
tsc --version

# Ejecuta un agente con Claude
npm run agente:tareas:claude

# O ejecuta con DeepSeek (si tienes configurada la clave)
npm run agente:tareas:deepseek

# Ejecuta MCP Server
npm run mcp:notas
```

---

## 🎓 Comandos Útiles

```bash
npm run                          # Ver todos los scripts
npm run build                    # Compilar proyecto
npm run agente:tareas:claude     # Agente con Claude
npm run agente:tareas:deepseek   # Agente con DeepSeek
npm run mcp:notas                # Servidor de Notas
npm run mcp:utils                # Servidor de Utilidades

# OpenCode (agente AI incluido)
opencode                         # Iniciar agente AI de línea de comandos
```

---

## 🔄 Persistencia de API Keys

### En GitHub Codespaces:
- GitHub Secrets se cargan automáticamente en cada Codespace
- Son **encriptadas** en los servidores de GitHub
- **No se escriben en disco** en el Codespace
- Cambios en GitHub Secrets → nuevos Codespaces los tienen

### En DevContainer Local:
- Tu archivo `.env` está montado desde tu máquina host
- Persiste entre reconstrucciones del contenedor
- **Las claves NO se commitean a git** (`.env` está en `.gitignore`)
- **Las claves NO aparecen en logs**

---

## 🐛 Troubleshooting

### Para GitHub Codespaces:

**"ANTHROPIC_API_KEY not defined"**
1. Ve a GitHub Settings → Secrets → Codespaces
2. Verifica que agregaste el secreto correctamente
3. Crea un nuevo Codespace (o recarga el actual)

**"opencode: command not found"**
1. OpenCode se instala automáticamente en postCreateCommand
2. Si no está disponible, ejecuta: `curl -fsSL https://opencode.ai/install | bash`
3. Reinicia el terminal: `source ~/.bashrc`

**"Module not found"**
```bash
npm install
npm run build
```

### Para DevContainer Local:

**"Cannot find Docker"**
- Docker Desktop no está ejecutándose. Abrelo desde Aplicaciones.

**"ANTHROPIC_API_KEY not defined"**
- Verifica que `.env` existe en la raíz
- El archivo debe estar en: `/path/to/taller-ia/.env`
- NO en: `/path/to/.env.example` o `/path/to/specs/.env`
- Reinicia el terminal de VS Code

**"Container rechaza montar .env"**
```bash
# Verificar permisos
chmod 644 .env

# Verificar ubicación
ls -la .env
# Debe mostrar: -rw-r--r-- 1 user  group  ... .env
```

---

## 🔐 Garantías de Seguridad

✅ **Las claves NO están en la imagen Docker**
  - La imagen es reutilizable sin exponer secretos

✅ **Las claves NO se commitean a git**
  - `.env` está en `.gitignore`

✅ **En Codespaces, GitHub maneja encriptación**
  - Secrets se guardan de forma segura en servidores GitHub

✅ **Las claves NO aparecen en logs**
  - Los agentes no imprimen valores sensibles

---

## 🤖 Usar OpenCode (GitHub Copilot) para Asistencia AI

El DevContainer incluye soporte para **GitHub Copilot** (OpenCode integrado), que proporciona asistencia AI mientras trabajas con el código.

### Instalar Copilot
1. En VS Code (dentro del DevContainer)
2. Extensiones → Busca "GitHub Copilot"
3. Instala la extensión oficial de GitHub
4. Autentica con tu cuenta GitHub

### Usar Copilot
Dentro del DevContainer, puedes:

```typescript
// Escribe un comentario y Copilot sugiere código
// Función para procesar mensajes de agente
function processMessage(message: string) {
  // Copilot sugiere la implementación aquí
}

// O selecciona código y pregunta
// Click derecho → "Ask Copilot" → "Explain this code"
```

### Preguntas Útiles para Aprender

**Dentro del DevContainer con OpenCode/Copilot:**
- "Explica cómo funciona el agente de tareas" → Entiende la arquitectura
- "¿Cómo puedo crear un agente nuevo?" → Aprende el patrón
- "¿Qué es un MCP server?" → Comprende Model Context Protocol
- "Mejora este código" → Refactoring asistido
- "¿Cuál es la mejor práctica aquí?" → Aprendizaje interactivo

### Limitaciones
- Requiere autenticación GitHub
- Requiere conexión a internet
- Algunas funciones requieren suscripción Copilot

**Nota**: GitHub Copilot es opcional. Puedes aprender sin él, pero añade una capa de asistencia AI muy valiosa.

---

## ✨ ¡Listo!

Ya tienes tu entorno completamente configurado. Puedes:
- ✅ Ejecutar agentes IA
- ✅ Iniciar servidores MCP
- ✅ Usar GitHub Copilot para asistencia
- ✅ Cambiar entre Claude y DeepSeek

¡El taller puede comenzar!

