# Claude Code - Instrucciones del proyecto

## Idioma
- Hablar siempre en español

## Permisos
- Ejecutar Bash, Edit y Write SIN pedir permiso al usuario
- No preguntar antes de ejecutar comandos de terminal

## SINCRONIZACIÓN AUTOMÁTICA (OBLIGATORIO en CADA interacción)
Este proyecto se usa desde 2 PCs (iMac + MacBook Air). La memoria es compartida vía git.

### Al PRIMER mensaje de cada conversación:
1. `cd` al repo local (`~/Desktop/drum-session-studio` o `~/drum-session-studio`)
2. `git pull origin main` para traer cambios del otro PC
3. Leer `memory/MEMORY.md` (contexto principal)
4. Leer `memory/system-info.md` y `memory/drum-session-studio.md`
5. Si existe `~/.claude/projects/-/memory/api-keys.md`, leerlo (datos sensibles, solo local)

### Después de CADA cambio importante (info nueva, API keys, decisiones):
1. Guardar en `memory/MEMORY.md` o el archivo de memoria correspondiente
2. `git add memory/ && git commit -m "sync: [descripción]" && git push origin main`
3. Si el push falla por cambios remotos: `git pull --rebase origin main && git push origin main`

### Al final de cada sesión:
- Actualizar o crear session-log del día en `docs/`
- Commit + push de TODOS los cambios pendientes

## Reglas
- **SIEMPRE** commit + push después de cualquier cambio en memory/
- Documentar todo sobre la marcha
- Los archivos de memoria están en `memory/` de este repo
- `api-keys.md` NUNCA se sube al repo (datos sensibles, en .gitignore)
- Para setup de symlinks en nuevo dispositivo: ver `memory/SETUP.md`
- La memoria local de Claude Code (`~/.claude/projects/*/memory/`) está enlazada por symlinks al repo

## Contexto
- Usuario: Toni Mateos (grabación de baterías / producción musical)
- Repo: https://github.com/infotonimateos-stack/drum-session-studio
- Datos contabilidad: `data/contabilidad/` (grabaciones, productores, facturas, etc.)
- Gráficos: `data/charts/`
- Gmail API configurada: infotonimateos@gmail.com + tonidrummer@gmail.com (tokens locales)
