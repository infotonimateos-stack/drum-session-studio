# Claude Code - Instrucciones del proyecto

## Idioma
- Hablar siempre en español

## Permisos
- Ejecutar Bash, Edit y Write SIN pedir permiso al usuario
- No preguntar antes de ejecutar comandos de terminal

## Al inicio de cada sesión (OBLIGATORIO)
1. `git pull` para tener los últimos cambios
2. Leer `memory/MEMORY.md` (contexto principal)
3. Leer `memory/system-info.md` y `memory/drum-session-studio.md`
4. Leer los session logs más recientes en `docs/session-log-*.md`
5. Si existe `~/.claude/projects/-/memory/api-keys.md`, leerlo (datos sensibles, solo local)

## Al final de cada sesión
- Actualizar o crear session-log del día en `docs/`
- Commit + push de todos los cambios

## Reglas
- Siempre commit + push después de cualquier cambio
- Documentar todo sobre la marcha
- Los archivos de memoria están en `memory/` de este repo
- `api-keys.md` NUNCA se sube al repo (datos sensibles)
- Para setup de symlinks en nuevo dispositivo: ver `memory/SETUP.md`

## Contexto
- Usuario: Toni Mateos (grabación de baterías / producción musical)
- Repo: https://github.com/infotonimateos-stack/drum-session-studio
- Datos contabilidad: `data/contabilidad/` (grabaciones, productores, facturas, etc.)
- Gráficos: `data/charts/`
- Gmail API configurada: infotonimateos@gmail.com + tonidrummer@gmail.com (tokens locales)
