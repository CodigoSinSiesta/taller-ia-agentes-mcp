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

## 🔄 API Key Persistence

Tu archivo `.env` está montado desde tu máquina host, así que tus claves persisten automáticamente entre reconstrucciones del contenedor.

---

## ✨ ¡Listo!

Ya tienes tu entorno completamente configurado. Puedes ejecutar agentes IA y servidores MCP sin problemas adicionales.

