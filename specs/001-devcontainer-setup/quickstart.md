# Guía Rápida: Configuración del DevContainer

**Objetivo**: Configurar tu entorno de desarrollo para el Taller IA en menos de 10 minutos.

---

## 📋 Prerequisitos

Antes de empezar, asegúrate de tener instalado:

### Requerimientos Obligatorios

1. **Docker Desktop** (Windows, macOS, o Linux)
   - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Versión mínima: 4.0.0
   - Verifica: `docker --version`

2. **Visual Studio Code**
   - [Descargar VS Code](https://code.visualstudio.com/)
   - Versión mínima: 1.88.0

3. **Extensión: Dev Containers**
   - Abre VS Code
   - Presiona `Ctrl+Shift+X` (o `Cmd+Shift+X` en Mac)
   - Busca "Dev Containers"
   - Instala la extensión oficial de Microsoft

### Requerimientos Opcionales

- **Git** (para clonar el repositorio)
- **API Keys válidas** para Claude y/o DeepSeek

---

## 🚀 Comenzar (5 minutos)

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

## 🔑 Configurar API Keys

Tienes **3 opciones** para configurar el proveedor LLM. Crea un archivo `.env` en la raíz del proyecto:

### Opción 1: Usar Claude (recomendado para empezar)

```bash
ANTHROPIC_API_KEY="sk-ant-tu-clave-aqui"
LLM_PROVIDER="claude"
```
Obtén tu clave: [console.anthropic.com](https://console.anthropic.com)

### Opción 2: Usar DeepSeek (más económico - ¡también completamente soportado!)

```bash
DEEPSEEK_API_KEY="sk-tu-clave-aqui"
LLM_PROVIDER="deepseek"
```
Obtén tu clave: [platform.deepseek.com](https://platform.deepseek.com)

### Opción 3: Tener ambos configurados (cambiar entre ellos)

```bash
ANTHROPIC_API_KEY="sk-ant-tu-clave-aqui"
DEEPSEEK_API_KEY="sk-tu-clave-aqui"
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

## 🐛 Troubleshooting

**Error: Cannot find Docker**
- Docker Desktop no está ejecutándose. Abrelo desde Aplicaciones.

**Error: ANTHROPIC_API_KEY not defined**
- Verifica que `.env` existe y contiene tus claves
- Reinicia el terminal de VS Code

**Error: Module not found**
```bash
npm install
npm run build
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
```

---

## 🔄 API Key Persistence & Container Rebuilds

Tu archivo `.env` está montado desde tu máquina host, así que tus claves persisten automáticamente entre reconstrucciones del contenedor.

### ¿Qué pasa cuando reconstruyes el DevContainer?

```
Tu Máquina (Host)          Container              Resultado
────────────────           ─────────            ──────────
.env file                  [Old Container]
(con tus claves)    ──────▶ [Stopped]           ✓ .env persiste
                           [Deleted]
                    
                           [New Image Built]
                           [New Container]
                    ◀───── (mount .env)         ✓ Claves disponibles
```

**Resumen:**
1. Reconstruyes el DevContainer → container se elimina
2. Se construye uno nuevo
3. .env se monta automáticamente desde tu máquina
4. Tus claves están disponibles ✅
5. **No necesitas reconfigurar nada**

### Garantías de Seguridad

✅ **Las claves NO están en la imagen Docker**
  - Puedes compartir la imagen sin exponer secretos
  - Puedes hacer push a un registro sin secretos

✅ **Las claves NO se commitean a git**
  - .env está en .gitignore
  - git check-ignore .env debería mostrar ".env"

✅ **Las claves NO aparecen en logs**
  - Los agentes no imprimen claves
  - Inspeccionar contenedor no revela secretos

### Recuperación de Errores

**"ANTHROPIC_API_KEY is not defined"**
```bash
# Solución 1: Crear .env desde ejemplo
cp .env.example .env
# Luego edita .env con tus claves reales

# Solución 2: Verificar que .env existe en la raíz
ls -la .env
# Debe mostrar: -rw-r--r-- 1 user  group  ... .env
```

**Container rechaza montar .env**
```bash
# Verificar permisos
chmod 644 .env

# Verificar que está en el lugar correcto
# Debe estar en: /path/to/taller-ia/.env
# NO en: /path/to/.env.example o /path/to/specs/.env
```

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

