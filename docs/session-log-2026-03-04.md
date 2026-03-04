# Session Log - 4 Marzo 2026

## Resumen
Continuación de setup y primeras tareas de producción con Claude Code.

---

## 1. Separación de stems con Demucs - "Something in the Air" (Sophia)

### Input:
- **Archivo:** `/Users/tonimateos/Downloads/sophia/SOMETHINGINTHEAIR.wav`
- **Formato:** WAV estéreo, 48 kHz, 71 MB

### Ejecución:
```bash
~/Library/Python/3.9/bin/demucs --two-stems=drums -o "OUTPUT_DIR" "INPUT_FILE"
```
- **Modelo:** htdemucs (default)
- **Tiempo:** ~6 minutos en i5-4570

### Output:
- `/Users/tonimateos/Downloads/sophia/demucs_output/htdemucs/SOMETHINGINTHEAIR/no_drums.wav` — canción sin batería
- `/Users/tonimateos/Downloads/sophia/demucs_output/htdemucs/SOMETHINGINTHEAIR/drums.wav` — solo batería

### Nota:
- Warning de NumPy 2.x vs 1.x (no afecta al resultado, pero conviene hacer `pip3 install 'numpy<2'` si da problemas en el futuro)

---

## 2. Renombrado masivo de archivos de sesión - "En Otra Vida - Take 1"

### Problema:
Los archivos exportados de Pro Tools tenían sufijo numérico (`_02`) tras el último guión bajo:
```
BD OUT BETA 52_02.wav → BD OUT BETA 52.wav
SN TOP 1_02.wav → SN TOP 1.wav
OH_COLES_L_02.wav → OH_COLES_L.wav
(19 archivos en total)
```

### Script AppleScript original (no funcionaba):
El usuario tenía un AppleScript que separaba el nombre por `"."` y re-añadía `.wav`. El problema es que eso devolvía el mismo nombre (`BD OUT BETA 52_02.wav` → `BD OUT BETA 52_02` + `.wav`), sin quitar el `_02`. La condición `if not (exists file newPath)` lo saltaba porque el archivo ya existía con ese nombre. Además, el `on error` silenciaba todos los errores.

### Solución aplicada (bash):
```bash
for f in "$DIR"/*.wav; do
  base=$(basename "$f")
  newname=$(echo "$base" | sed -E 's/_[0-9]+\.wav$/.wav/')
  if [ "$base" != "$newname" ]; then
    mv "$f" "$DIR/$newname"
  fi
done
```

### Script AppleScript corregido:
```applescript
tell application "Finder"
    set theFolder to choose folder with prompt "Selecciona la carpeta:"
    set fileList to every file of theFolder
    repeat with aFile in fileList
        set oldName to name of aFile
        if oldName contains "112" or oldName contains "audix" or oldName contains "91" or oldName contains "telefunken" then
            move aFile to trash
        else if oldName ends with ".wav" then
            set baseName to text 1 thru -5 of oldName
            set lastUnderscore to 0
            repeat with i from (length of baseName) to 1 by -1
                if character i of baseName is "_" then
                    set lastUnderscore to i
                    exit repeat
                end if
            end repeat
            if lastUnderscore > 0 then
                set suffix to text (lastUnderscore + 1) thru -1 of baseName
                try
                    set testNum to suffix as number
                    set cleanName to text 1 thru (lastUnderscore - 1) of baseName & ".wav"
                    set name of aFile to cleanName
                on error
                    -- No es número, no tocar
                end try
            end if
        end if
    end repeat
end tell
```

### Resultado:
- 19 archivos renombrados correctamente en take 1
- Pendiente: aplicar lo mismo a take 2

---

## 3. Setup memoria persistente y repo

- Exploración completa del repo `drum-session-studio`
- Configuración de memoria compartida entre sesiones (terminal, VSCode, cualquier dispositivo)
- Archivos de memoria: MEMORY.md, system-info.md, api-keys.md, drum-session-studio.md

---

## Tareas pendientes
- [ ] Renombrar archivos de "En Otra Vida - Take 2"
- [ ] Aplicar actualización macOS Ventura 13.7.8
- [ ] Solución definitiva OBS + cámaras USB
- [ ] Mover ffmpeg de /tmp a ubicación permanente
- [ ] Considerar downgrade numpy: `pip3 install 'numpy<2'`
