#!/bin/bash
# Setup de memoria compartida para Claude Code
# Ejecutar desde la raíz del repo: bash memory/setup.sh

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MEMORY_DIR="$HOME/.claude/projects/-/memory"

echo "=== Setup de memoria compartida de Claude Code ==="
echo "Repo: $REPO_DIR"
echo "Memory dir: $MEMORY_DIR"
echo ""

# Crear directorio si no existe
mkdir -p "$MEMORY_DIR"

# Crear symlinks
for file in MEMORY.md system-info.md drum-session-studio.md; do
    if [ -L "$MEMORY_DIR/$file" ]; then
        echo "✓ $file ya es symlink → $(readlink "$MEMORY_DIR/$file")"
    elif [ -f "$MEMORY_DIR/$file" ]; then
        echo "⚠ $file existe como archivo local. Haciendo backup y creando symlink..."
        mv "$MEMORY_DIR/$file" "$MEMORY_DIR/$file.backup"
        ln -sf "$REPO_DIR/memory/$file" "$MEMORY_DIR/$file"
        echo "  → Backup en $file.backup, symlink creado"
    else
        ln -sf "$REPO_DIR/memory/$file" "$MEMORY_DIR/$file"
        echo "✓ $file → symlink creado"
    fi
done

echo ""
if [ -f "$MEMORY_DIR/api-keys.md" ]; then
    echo "✓ api-keys.md existe localmente"
else
    echo "⚠ api-keys.md NO existe. Créalo manualmente en:"
    echo "  $MEMORY_DIR/api-keys.md"
fi

echo ""
echo "=== Setup completado ==="
