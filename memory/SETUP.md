# Setup de memoria compartida en nuevo dispositivo

## Pasos

1. Clonar el repo:
```bash
git clone https://github.com/infotonimateos-stack/drum-session-studio.git ~/drum-session-studio
```

2. Crear directorio de memoria de Claude Code (si no existe):
```bash
mkdir -p ~/.claude/projects/-/memory/
```

3. Crear symlinks:
```bash
ln -sf ~/drum-session-studio/memory/MEMORY.md ~/.claude/projects/-/memory/MEMORY.md
ln -sf ~/drum-session-studio/memory/drum-session-studio.md ~/.claude/projects/-/memory/drum-session-studio.md
ln -sf ~/drum-session-studio/memory/system-info.md ~/.claude/projects/-/memory/system-info.md
```

4. Crear `api-keys.md` manualmente (NO está en el repo por seguridad):
```bash
# Copiar el contenido desde otro dispositivo de forma segura
nano ~/.claude/projects/-/memory/api-keys.md
```

## Notas
- Los symlinks apuntan a archivos del repo, así que `git pull` actualiza la memoria automáticamente
- `api-keys.md` siempre es local (está en .gitignore)
- Al editar memoria desde Claude Code, los cambios se hacen directamente en el repo → hacer commit + push para sincronizar
