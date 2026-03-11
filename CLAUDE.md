# Claude Code - Instrucciones del proyecto

## Idioma
- Hablar siempre en español

## Permisos
- Ejecutar Bash, Edit y Write SIN pedir permiso al usuario
- No preguntar antes de ejecutar comandos de terminal

## Sesiones
- Al inicio: pull del repo y leer docs/session-log-*.md y memory/*.md
- Al final: actualizar session-log y push al repo
- Siempre commit + push después de cualquier cambio
- Documentar todo sobre la marcha, no esperar a que el usuario lo pida

## Memoria compartida entre dispositivos
- Los archivos de memoria están en `memory/` dentro de este repo
- `memory/MEMORY.md` = archivo principal (se carga automáticamente si hay symlink)
- `memory/system-info.md`, `memory/drum-session-studio.md` = contexto adicional
- `api-keys.md` NO está en el repo (datos sensibles) → solo existe local en cada dispositivo
- **Setup en nuevo dispositivo:** crear symlinks desde `~/.claude/projects/-/memory/` a `memory/` del repo (ver memory/SETUP.md)

## Contexto
- Usuario: Toni Mateos (grabación de baterías / producción musical)
- Logs de sesión: docs/session-log-*.md
