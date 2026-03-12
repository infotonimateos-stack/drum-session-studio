---
name: Always push to repo
description: TODA la memoria debe estar en el repo memory/, NUNCA solo en local de Claude Code
type: feedback
---

SIEMPRE guardar los archivos de memoria en `~/drum-session-studio/memory/` (el repo), NO solo en `~/.claude/projects/*/memory/` (local de Claude Code).

**Why:** Los archivos en la memoria local de Claude Code NO se sincronizan entre dispositivos ni se comparten con el otro PC vía git. Solo el repo es la fuente de verdad compartida.

**How to apply:**
1. Escribir SIEMPRE en `~/drum-session-studio/memory/`
2. Hacer git add + commit + push INMEDIATAMENTE después
3. NUNCA escribir solo en `~/.claude/projects/*/memory/` sin también copiarlo al repo
4. Verificar que el archivo aparece en el repo antes de confirmar al usuario
