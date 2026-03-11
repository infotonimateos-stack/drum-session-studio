# Drum Session Studio - Admin Panel & File Detection

## Admin Panel
- **URL**: https://tonimateos.com/gfs-admin-2025
- **Password**: 44012883-zZZAAA
- **Supabase project**: xxftvsejuwkgmemciswl
- **Admin API**: https://xxftvsejuwkgmemciswl.supabase.co/functions/v1/admin-api

## Sistema de detección de archivos (implementado 2026-03-10)
- Detecta automáticamente si clientes han enviado archivos a info@tonimateos.com
- Busca: adjuntos, WeTransfer, SwissTransfer, Google Drive, Dropbox
- **Google Apps Script**: desplegado desde cuenta info@tonimateos.com
  - URL: https://script.google.com/macros/s/AKfycbyn839L6p8o2nGe3G5VP4ivpVTLXfOL11LcOUV5J5TJIMvilKLBKm3XnFLiESuYsjwE/exec
  - Secret: gfs-files-2026-drum (en Script Properties como CHECKER_SECRET)
  - Código fuente local: scripts/gmail-file-checker.js
- **Supabase secrets**: GMAIL_CHECKER_URL + GMAIL_CHECKER_SECRET configurados
- **n8n cron workflow**: ID ZCP5O6Pt2xNw0uP5 (pendiente de activar, 10:00 y 18:00)

## Columnas BD añadidas (orders)
- work_status, deadline, work_notes, paypal_payer_info
- files_status, files_detected_at, files_detection_method, files_last_checked_at

## UI Pedidos (OrdersWorkflowTab.tsx)
- Tarjetas con Accordion para equipo (Micros, Previos, Interfaz, Extras)
- Collapsible "Info cliente" (teléfono, dirección, empresa, PayPal)
- Badge archivos: "Archivos recibidos vía [método]" o "Esperando archivos"
- Stat cards: Nuevos, En proceso, Esperando archivos, Entregados
- Botón manual para marcar archivos recibidos/pendientes

## Problema recurrente: Lovable sobrescribe archivos
- Cada vez que se publica en Lovable, puede sobrescribir types.ts y otros archivos
- Solución: hacer git pull --rebase después de que Lovable pushee, resolver conflictos manteniendo nuestros campos
- El usuario debe hacer Cmd+Shift+R para recargar sin caché tras publicar

## Endpoints admin-api
- GET ?action=list → lista pedidos
- POST ?action=update-status → {orderId, status}
- POST ?action=update-work-status → {orderId, workStatus}
- POST ?action=update-deadline → {orderId, deadline}
- POST ?action=update-work-notes → {orderId, notes}
- POST ?action=check-files → comprueba Gmail vía Apps Script
- POST ?action=update-files-status → {orderId, filesStatus} (manual)
- POST ?action=delete → {orderId}
- POST ?action=delete-all → borra todo + reset counter
- POST ?action=reset-counter → reset invoice counter
- GET ?action=invoice&orderId=X → genera factura
