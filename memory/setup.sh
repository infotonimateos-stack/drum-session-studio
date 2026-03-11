#!/bin/bash
# Setup de memoria compartida para Claude Code
# Ejecutar desde la raíz del repo: bash memory/setup.sh
# Crea symlinks en TODOS los contextos de proyecto posibles

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_DIR="$HOME/.claude/projects"

echo "=== Setup de memoria compartida de Claude Code ==="
echo "Repo: $REPO_DIR"
echo ""

# Lista de directorios de memoria donde crear symlinks:
# 1. El contexto global (-) = cuando Claude se abre desde /
# 2. El contexto del repo = cuando Claude se abre desde ~/drum-session-studio
MEMORY_DIRS=("$CLAUDE_DIR/-/memory")

# Buscar si ya existen otros contextos de proyecto
if [ -d "$CLAUDE_DIR" ]; then
    for dir in "$CLAUDE_DIR"/*/memory; do
        if [ -d "$dir" ]; then
            # Añadir solo si no está ya en la lista
            already=false
            for existing in "${MEMORY_DIRS[@]}"; do
                [ "$existing" = "$dir" ] && already=true
            done
            $already || MEMORY_DIRS+=("$dir")
        fi
    done
fi

# Crear symlinks en cada contexto
for MEMORY_DIR in "${MEMORY_DIRS[@]}"; do
    echo "--- $MEMORY_DIR ---"
    mkdir -p "$MEMORY_DIR"

    for file in MEMORY.md system-info.md drum-session-studio.md; do
        if [ -L "$MEMORY_DIR/$file" ]; then
            target="$(readlink "$MEMORY_DIR/$file")"
            if [ "$target" = "$REPO_DIR/memory/$file" ]; then
                echo "  ✓ $file ya apunta al repo"
            else
                ln -sf "$REPO_DIR/memory/$file" "$MEMORY_DIR/$file"
                echo "  ✓ $file → actualizado symlink"
            fi
        elif [ -f "$MEMORY_DIR/$file" ]; then
            mv "$MEMORY_DIR/$file" "$MEMORY_DIR/$file.backup"
            ln -sf "$REPO_DIR/memory/$file" "$MEMORY_DIR/$file"
            echo "  ✓ $file → backup + symlink creado"
        else
            ln -sf "$REPO_DIR/memory/$file" "$MEMORY_DIR/$file"
            echo "  ✓ $file → symlink creado"
        fi
    done

    if [ -f "$MEMORY_DIR/api-keys.md" ]; then
        echo "  ✓ api-keys.md existe localmente"
    else
        echo "  ⚠ api-keys.md NO existe (crear manualmente)"
    fi
    echo ""
done

echo "=== Setup completado ==="
echo ""
echo "Si abres Claude desde otro directorio y la memoria no se carga,"
echo "ejecuta este script de nuevo para actualizar los symlinks."
