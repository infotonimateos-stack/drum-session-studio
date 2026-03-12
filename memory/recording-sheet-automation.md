---
name: Recording Sheet Automation
description: Automatización ficha técnica de grabación + entrega WAVs por Google Drive con upsell de pistas extra
type: project
---

## Ficha técnica de grabación automatizada

**Objetivo:** Generar automáticamente una ficha técnica (Recording Sheet) personalizada por cada pedido, con upsell de pistas extra.

### Flujo completo:
1. Cliente hace pedido en la web → Supabase (tabla `orders`, campo `items` JSONB)
2. Toni graba la sesión con TODOS los micros
3. Script lee el pedido de Supabase → genera spreadsheet personalizado en Google Sheets
4. WAVs se suben a Google Drive (tonidrummer@gmail.com, 2TB)
5. Enlace intermedio por tonimateos.com/descargar?id=XXX → registra visita en Supabase → redirige a Drive
6. Cliente recibe email con enlace de descarga + ficha técnica

### Estructura de la ficha:
- **Sección 1:** Micros incluidos en el pedido (los que compró)
- **Sección 2:** Pistas extra disponibles (upsell) con enlace a tonimateos.com/ampliar-pedido
- Datos del cliente: artista, productor, fecha, canción
- Equipamiento: kit, interface, previos según pedido
- Info contacto Toni Mateos

### Decisiones tomadas (2026-03-12):
- Un spreadsheet SEPARADO por cada cliente (no hojas dentro del mismo)
- Google Drive con tonidrummer@gmail.com (2TB, el cliente no ve la cuenta)
- Enlace compartido como "cualquiera con el enlace" (sin necesidad de login Google)
- Enlace intermedio por la web para tracking de visitas (no descarga directa)
- Enlace de ampliar pedido: tonimateos.com/ampliar-pedido (sin parámetros, el cliente pone sus datos)
- WeTransfer API cerrada para nuevos registros → Google Drive es la alternativa

### Spreadsheet plantilla:
- ID: 1d8vxQ4QSU2xJbYxmtYjgPi40RC6L8DyuAvkiYX7SjmE
- GID: 1663095704
- Cuenta: tonidrummer@gmail.com

### Mapeo mic IDs → canales del spreadsheet:
- `beta52-kick` → BD IN SHURE BETA 52
- `d6-kick` → BD IN AUDIX D6
- `d112-kick` → BD IN AKG D112
- `beta91-kick` → BD IN SHURE BETA 91
- `subkick-kick` → BD OUT SUBKICK
- `u47fet-kick` → BD OUT NEUMANN U47 FET
- `re20-kick` → BD OUT EV RE20
- `d12-kick` → BD OUT AKG D12
- `sm57-snare` → SD TOP 1
- `c414-snare` → SD TOP 2
- `unidyne-snare` → SD TOP 3 VINTAGE
- `md441-snare` → SD BOTTOM
- `m160-hihat` → HH_RIBBON
- `km184-hihat` → HH_CONDENSER
- `md421-tom1` → TOM 1 (+ TOM 2, TOM 3 con variantes)
- `coles-oh` → OH_COLES_L + OH_COLES_R
- `c414-oh` → OH_414_L + OH_414_R + OH_414_CENTRAL
- `km184-ride` → RIDE
- `u87-room` → ROOM_L + ROOM_R
- `c12-room` → ROOM TELEFUNKEN C12
- `r88-room` → ROOM AEA R88
- `d19c-room` → (vintage, pendiente mapear)

### Pendiente para implementar:
1. Activar Google Sheets API + Google Drive API en Cloud Console
2. Autenticar tonidrummer@gmail.com con scopes: gmail.readonly + spreadsheets + drive
3. Crear script Python que genere el spreadsheet desde datos de Supabase
4. Crear página tonimateos.com/descargar con tracking en Supabase
5. Email automático de seguimiento si no descarga en X días

**Why:** Automatizar la entrega de pistas + ficha técnica ahorra tiempo y genera upsell automático
**How to apply:** Cuando se implemente la entrega de pedidos, seguir este flujo
