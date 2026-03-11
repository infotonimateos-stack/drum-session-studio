# System Info - Toni Mateos

## Hardware
- iMac 14,2 (Late 2013)
- CPU: Intel i5-4570 @ 3.20GHz (4 cores)
- RAM: 32 GB
- GPU: NVIDIA GeForce GT 755M (OpenGL 4.1, NO Metal, NO NV12 textures)
- USB: Hub Genesys Logic USB 2.0 (webcam + phantom A-FOUR TECH device)

## Software
- macOS Ventura 13.3.1 (a) via OpenCore Legacy Patcher
- Pro Tools (producción musical principal)
- OBS 32.0.4 (streaming/grabación)
- VS Code
- Dropbox
- Antelope Audio driver (interfaz de audio)

## Problemas conocidos
- OBS no renderiza cámaras USB (formato NV12 incompatible con GPU NVIDIA GT 755M)
  - Workaround: Photo Booth + OBS Screen Capture
- nsattributedstringagent crashea en bucle (pendiente update macOS 13.7.8)
- Webcam phantom USB (A-FOUR TECH 0x09da, ID 0x1423400009da2690) siempre presente en el sistema

## Acciones realizadas (2026-03-03)
- Eliminado CleanMyMac X (cracked, firmado por TNT)
- Instalado Claude Desktop
- Instalado Demucs (separación de stems)
- Reset de permisos TCC cámara (re-granted: OBS, Terminal)
- Descargado ffmpeg 8.0.1 en /tmp (temporal)

## Tareas pendientes
- Actualización macOS Ventura 13.7.8
- Solución definitiva OBS + cámaras USB
- Re-otorgar permisos cámara a apps afectadas por reset TCC
