# Memory

## INSTRUCCIONES DE INICIO DE SESIÓN (OBLIGATORIO)
1. Pull del repo drum-session-studio y leer memory/*.md + docs/session-log-*.md
2. Hablar siempre en español
3. Al final de cada sesión: actualizar session-log y push al repo
4. Ejecutar Bash, Edit y Write SIN pedir permiso al usuario
5. Siempre commit + push al repo después de cualquier cambio
6. Esta memoria está en el repo (`memory/`), compartida entre dispositivos vía git
7. `api-keys.md` es LOCAL (no en repo) → leer desde ~/.claude/projects/-/memory/api-keys.md

## User Info
- Nombre: Toni Mateos
- Web: www.tonimateos.com
- Profesión: Grabación de baterías / producción musical
- Usa Pro Tools (.ptx)
- ISP: O2, fibra 1 Gbps
- Discos externos: LaCie, My Book (5)

## Archivos de referencia
- [Sistema (hardware, software, problemas)](system-info.md)
- [API Keys (GitHub, Monday.com, n8n, Google OAuth, Microsoft)](api-keys.md)
- [Proyecto Drum Session Studio (arquitectura completa)](drum-session-studio.md)

## Repo GitHub
- URL: https://github.com/infotonimateos-stack/drum-session-studio
- Local: /Users/tonimateos/drum-session-studio
- Token: en [api-keys.md](api-keys.md)
- Logs de sesiones: `docs/session-log-*.md`

## Herramientas instaladas
- Demucs 4.0.1: `~/Library/Python/3.9/bin/demucs`
- OBS 32.0.4 (USB cams: workaround Photo Booth + Screen Capture)
- Claude Desktop: `/Applications/Claude.app`
- Google API Python: google-api-python-client, google-auth-oauthlib (en ~/Library/Python/3.9/)

## Recordatorios pendientes
- **~Abril 2026:** Al volver a pedir facturas para la gestora, recordar que NO se incluyeron: factura de La Wash (Global Networks Investments SLU) y alquiler febrero 2026 (Montserrat Planas). Ambas faltaban del board de Monday en marzo 2026.

## Contabilidad
- Archivo FileMaker: `~/Documents/contabilidad/contabilidad.fmp12` (FileMaker Pro 18)
- **IMPORTANTE:** Los PDFs de facturas emitidas en `~/Documents/contabilidad/[año]/facturas emitidas/` son la fuente DEFINITIVA (no el FileMaker, que tiene errores)
- Grabaciones del FileMaker SÍ son fiables (3758 sesiones, 1016 artistas, 876 productores normalizados)
- Resumen: 338.722€ total grabaciones (2013-2026), top productor por sesiones: Alex Vélez (75), por ingresos: Jorge Villaescusa (23.380€)
- Datos en `data/contabilidad/` del repo:
  - `grabaciones.json` (3758 sesiones)
  - `facturas_emitidas.json` (1499)
  - `clientes.json` (497 FM clients)
  - `gastos.json` (1599), `proveedores.json` (211), `servicios.json` (7)
  - `clientes_unificado.json` (1980 contactos cruzados - incluye bandas, NO usar para productores)
  - **`productores.json`** (876 productores, 86% con contacto) ← LISTADO PRINCIPAL
- Fuentes contacto exportadas: `~/Downloads/contacts.csv` (Google), `~/Downloads/contactos.csv` (Outlook)

## Gmail API
- Tokens locales: `data/gmail_token.pickle` (infotonimateos@gmail.com), `data/gmail_token_tonidrummer.pickle` (tonidrummer@gmail.com)
- Credenciales OAuth en [api-keys.md](api-keys.md)
- Pueden expirar → re-autenticar con el mismo script OAuth
- Útil para: buscar emails de productores, futuros resúmenes/avisos

## Microsoft Hotmail (pendiente)
- tonidrummer@hotmail.com - verificación 2 pasos activada
- Azure Portal no permite cuentas personales live.com → no se puede registrar app
- App password generada pero IMAP auth básica deshabilitada por MS
- Alternativa futura: crear cuenta Azure con otro email y registrar app ahí

## Problemas conocidos
- OBS + cámaras USB: GPU no soporta NV12 → pantalla negra
- nsattributedstringagent crash (pendiente update macOS 13.7.8)
- Dispositivo phantom USB (A-FOUR TECH) siempre presente

## Admin Panel & Detección de archivos
- Ver detalle completo en [drum-session-admin.md](drum-session-admin.md)
- **Admin URL**: https://tonimateos.com/gfs-admin-2025 (pss: 44012883-zZZAAA)
- **Supabase**: xxftvsejuwkgmemciswl
- **Detección archivos**: Apps Script (Gmail) + n8n cron (pendiente activar)
- **Google Apps Script URL**: https://script.google.com/macros/s/AKfycbyn839L6p8o2nGe3G5VP4ivpVTLXfOL11LcOUV5J5TJIMvilKLBKm3XnFLiESuYsjwE/exec
- **Apps Script secret**: gfs-files-2026-drum
- **n8n workflow**: ID ZCP5O6Pt2xNw0uP5 (10:00 y 18:00, pendiente activar)

## Telegram Bot (notificaciones pedidos)
- **Bot**: @tonimateos_pedidos_bot
- **Token**: 8630112518:AAEba96f177th4ido50WEsodegPFZZmbcy0
- **Chat ID Toni**: 8729149012

## n8n
- **URL**: https://n8n.cardeseo.com
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjY4NzNhNy1iMTNmLTQ2ZDItODAzYy1kZTZlMjJlM2ZjN2UiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzczMTI0NTA3fQ.Z_3QsXU6G06PgMhBgBy7ikaJnRzcF2qf5lDgh-WeaS0
- **Header**: `X-N8N-API-KEY`
- **Workflows**: Securitas→Monday, Stripe, Renovaciones, Blog Notification, Telegram→Billin→Monday, Aircall→Monday

## Monday.com
- **API Token**: eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjYyNzg2ODI1NywiYWFpIjoxMSwidWlkIjo1NTY2MDI0NCwiaWFkIjoiMjAyNi0wMy0wMlQyMDo0NDo0OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjEyMDgzMDksInJnbiI6ImV1YzEifQ.9eoaEjFHxFBSvgKI_wL5F-wwJsqyY4JlxBHXaYm60w4
- **Board Gastos**: ID 1392885945
- **NUNCA crear entradas automáticamente desde correo/email**
- **Telefonía**: O2 (Telefónica), NO Movistar

## Blog semanal SEO
- **Calendario**: ver blog-editorial-calendar.md (en memoria local)
- **Flujo**: Claude redacta + push a GitHub → usuario Publish en Lovable
- **Formato**: bilingüe ES/EN, i18n keys en common.json, datos en blogPosts.ts
- **Último post publicado**: #14

## Historial de sesiones
- **2026-03-03:** Diagnóstico sistema, eliminación malware (CleanMyMac TNT), OBS cámaras USB, Demucs, limpieza RAM
- **2026-03-04:** Clonado repo drum-session-studio, exploración completa arquitectura, setup memoria persistente
- **2026-03-09:** Facturas Q1 Monday.com (49), extracción FileMaker (6 tablas), listado productores (876, 86% con contacto), config Gmail API + Microsoft 2FA
- **2026-03-10/11:** Admin panel: detección archivos (Apps Script + Supabase), rediseño tarjetas pedidos (Accordion/Collapsible), sincronización memoria entre PCs

## Código de verificación sincronización
- **Código**: 877977 (para verificar que el otro PC puede leer esta memoria)
