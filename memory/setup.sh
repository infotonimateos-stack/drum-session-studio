#!/bin/bash
# Setup de memoria compartida para Claude Code
# Ejecutar desde la raíz del repo: bash memory/setup.sh
# Crea symlinks + configura hooks de auto-sync

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_DIR="$HOME/.claude/projects"
SETTINGS="$HOME/.claude/settings.json"

echo "=== Setup de memoria compartida de Claude Code ==="
echo "Repo: $REPO_DIR"
echo ""

# --- 1. SYMLINKS ---
MEMORY_DIRS=("$CLAUDE_DIR/-/memory")

if [ -d "$CLAUDE_DIR" ]; then
    for dir in "$CLAUDE_DIR"/*/memory; do
        if [ -d "$dir" ]; then
            already=false
            for existing in "${MEMORY_DIRS[@]}"; do
                [ "$existing" = "$dir" ] && already=true
            done
            $already || MEMORY_DIRS+=("$dir")
        fi
    done
fi

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

# --- 2. HOOKS AUTO-SYNC ---
echo "--- Configurando hooks de auto-sync ---"

if [ -f "$SETTINGS" ]; then
    # Check if hooks already configured
    if grep -q "UserPromptSubmit" "$SETTINGS" 2>/dev/null; then
        echo "  ✓ Hooks ya configurados en settings.json"
    else
        echo "  ⚠ settings.json existe pero sin hooks."
        echo "  Copia los hooks de: $REPO_DIR/memory/settings-template.json"
        echo "  O añade manualmente la sección 'hooks' a $SETTINGS"
    fi
else
    echo "  Creando settings.json con hooks..."
    cp "$REPO_DIR/memory/settings-template.json" "$SETTINGS"
    echo "  ✓ settings.json creado con hooks de auto-sync"
fi

echo ""
echo "=== Setup completado ==="
echo ""
echo "Hooks configurados:"
echo "  • UserPromptSubmit → git pull (sincroniza antes de cada petición)"
echo "  • Stop → git push memory/ + docs/ (sincroniza al terminar)"
echo ""
echo "Si abres Claude desde otro directorio, ejecuta este script de nuevo."
