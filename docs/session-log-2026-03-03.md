# Session Log - 3 Marzo 2026

## Sistema: iMac 14,2 (Late 2013)
- **CPU:** Intel i5-4570 @ 3.20GHz
- **RAM:** 32 GB
- **GPU:** NVIDIA GeForce GT 755M
- **OS:** macOS Ventura 13.3.1 via OpenCore Legacy Patcher
- **Almacenamiento externo:** LaCie, My Book (x5)

---

## 1. Diagnóstico del sistema

### nsattributedstringagent crasheando en bucle
- El proceso `nsattributedstringagent` estaba crasheando repetidamente, relacionado con `SoftwareUpdateNotificationManager`.
- Se detectaron actualizaciones pendientes incluyendo macOS Ventura 13.7.8.
- **Estado:** Pendiente de aplicar actualización de macOS (requiere reinicio y verificar compatibilidad con Pro Tools).

### Procesos innecesarios detectados
- "Install Command Line Developer Tools" abierto sin necesidad.
- Chrome consumiendo ~8 GB de RAM.
- Pro Tools, VS Code, Dropbox funcionando con normalidad.

---

## 2. Instalación de Claude Desktop

- No estaba instalado previamente.
- Homebrew no disponible (requiere sudo interactivo).
- Descarga manual del DMG desde claude.com/download.
- Montaje del DMG, copia a `/Applications/`, desmontaje.
- Aplicación lanzada correctamente.

---

## 3. Escaneo y eliminación de malware

### Escaneo realizado:
- Launch Agents/Daemons: mayormente legítimos
- Crontab: vacío
- Conexiones de red: servicios conocidos
- Login items: solo Dropbox
- Kernel extensions: Antelope Audio, NVIDIA/OpenCore, SoftRAID (normales)
- Perfiles de configuración: ninguno

### Hallazgo: CleanMyMac X firmado por "TNT" (grupo de cracking)
- **No es firma legítima de MacPaw** (Developer ID real: `S8EX82NJP6`).
- `CleanMyMac4.Agent` ejecutándose como helper privilegiado con acceso root.
- Componentes encontrados:
  - `/Applications/CleanMyMac X.app`
  - `/Library/LaunchDaemons/com.macpaw.CleanMyMac4.Agent.plist`
  - `/Library/PrivilegedHelperTools/com.macpaw.CleanMyMac4.Agent`
  - `/Library/PrivilegedHelperTools/com.macpaw.CleanMyMac2.Agent`

### Eliminación:
Se creó y ejecutó script de eliminación (`/tmp/remove_cleanmymac.sh`):
```bash
#!/bin/bash
launchctl bootout system/com.macpaw.CleanMyMac4.Agent 2>/dev/null
killall "CleanMyMac X" 2>/dev/null
rm -f /Library/LaunchDaemons/com.macpaw.CleanMyMac4.Agent.plist
rm -f /Library/PrivilegedHelperTools/com.macpaw.CleanMyMac4.Agent
rm -f /Library/PrivilegedHelperTools/com.macpaw.CleanMyMac2.Agent
rm -rf "/Applications/CleanMyMac X.app"
rm -rf ~/Library/Application\ Support/CleanMyMac\ X
rm -rf ~/Library/Caches/com.macpaw.CleanMyMac4
rm -rf ~/Library/Preferences/com.macpaw.CleanMyMac4.plist
```
- **Resultado:** Todos los componentes eliminados correctamente. Verificado.

---

## 4. OBS Studio - Cámaras USB no se visualizan

### Problema
OBS detecta las cámaras USB externas pero no muestra imagen (pantalla negra).

### Diagnóstico detallado

#### Hardware USB detectado:
| Dispositivo | Vendor | ID único | Puerto |
|---|---|---|---|
| USB Live camera (REAL) | Sonix (0x0c45) | `0x142440000c45637a` | 17 |
| USB Live camera (PHANTOM) | A-FOUR TECH (0x09da) | `0x1423400009da2690` | 15 |
| FaceTime HD Camera | Apple (0x05ac) | `0x1450000005ac8511` | - |

- Ambas cámaras USB están en el mismo hub USB 2.0 (Genesys Logic).
- El dispositivo phantom (A-FOUR TECH) persiste incluso desconectando la webcam real.
- Photo Booth muestra la webcam correctamente → **hardware OK**.

#### Causa raíz identificada:
**La GPU NVIDIA GeForce GT 755M no soporta texturas NV12 en OpenGL.**

```
NV12 texture support not available
P010 texture support not available
```

- Las cámaras USB envían frames en formato `420v` (NV12).
- La FaceTime envía en formato `2vuy` (UYVY) → funciona en OBS.
- OBS no puede renderizar frames NV12 en esta GPU → pantalla negra sin errores.

#### Intentos de solución:
1. ✅ Actualización de OBS 30.1.2 → 32.0.4
2. ✅ Corrección de device ID (apuntaba al dispositivo phantom)
3. ✅ Plugin `macos-avcapture` (nuevo) - funciona con FaceTime, no con USB
4. ✅ Plugin `av_capture_input` (legacy) con preset 640x480
5. ✅ Forzar formato `yuvs` (YUY2) via `input_format: 2037741171`
6. ✅ Forzar formato `2vuy` (UYVY) via `input_format: 846624121`
7. ✅ Cambio ColorFormat: NV12 → BGRA → I420
8. ✅ Reset y re-grant de permisos TCC de cámara
9. ✅ Eliminación de fuente duplicada (dispositivo phantom)

#### Solución temporal implementada:
**Photo Booth + Screen Capture en OBS** (tipo: Application Capture de `com.apple.PhotoBooth`).
- Photo Booth captura la webcam USB correctamente.
- OBS captura la ventana de Photo Booth via Screen Capture.
- Funciona sin problemas de formato NV12.

#### Solución definitiva pendiente:
- Requiere una GPU con soporte NV12 en OpenGL, o una versión de OBS que haga conversión de formato por software para cámaras USB.

### Permisos TCC modificados:
- Se resetearon TODOS los permisos de cámara con `tccutil reset Camera`.
- Se re-otorgaron manualmente via sqlite3:
  - `com.obsproject.obs-studio` → auth_value=2
  - `com.apple.Terminal` → auth_value=2
- **Nota:** Otras apps pueden necesitar re-otorgar permisos de cámara.

---

## 5. Limpieza de RAM

- RAM libre antes: **54 MB**
- Se ejecutó `purge` con privilegios de admin.
- Se eliminó proceso `ffmpeg` colgado.
- RAM libre después: **5,703 MB** (~5.6 GB liberados)

---

## 6. Separación de audio con Demucs (Meta Research)

### Instalación:
```bash
pip3 install demucs
# Instalado en: /Users/tonimateos/Library/Python/3.9/bin/demucs
# Modelo: htdemucs (descargado automáticamente ~80 MB)
```

### Uso:
```bash
/Users/tonimateos/Library/Python/3.9/bin/demucs --two-stems drums -n htdemucs -o "OUTPUT_DIR" "INPUT_FILE"
```

### Primera ejecución:
- **Input:** `/Users/tonimateos/Downloads/sophia/Mama edit.wav` (68 MB, ~4:12)
- **Output:**
  - `no_drums.wav` - canción sin batería (42 MB)
  - `drums.wav` - solo batería aislada (42 MB)
- **Tiempo de procesamiento:** ~9 minutos en i5-4570
- **Resultado:** Satisfactorio

---

## Herramientas instaladas en esta sesión
| Herramienta | Ubicación | Propósito |
|---|---|---|
| Claude Desktop | `/Applications/Claude.app` | Asistente AI |
| OBS Studio 32.0.4 | `/Applications/OBS.app` | Streaming/grabación |
| Demucs 4.0.1 | `~/Library/Python/3.9/bin/demucs` | Separación de stems |
| ffmpeg 8.0.1 | `/tmp/ffmpeg` (temporal) | Procesamiento multimedia |

## Tareas pendientes
- [ ] Aplicar actualización macOS Ventura 13.7.8 (fix nsattributedstringagent)
- [ ] Verificar compatibilidad Pro Tools con la actualización
- [ ] Solución definitiva para OBS + cámaras USB (limitación GPU NVIDIA/NV12)
- [ ] Re-otorgar permisos de cámara a apps que los perdieron tras el reset TCC
- [ ] Mover ffmpeg de /tmp a ubicación permanente si se necesita
