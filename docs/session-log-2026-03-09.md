# Session Log - 9 marzo 2026

## Resumen
Sesión centrada en descarga de facturas de Monday.com y extracción completa de datos de contabilidad desde FileMaker Pro.

## Tareas completadas

### 1. Descarga de facturas Q1 2026 desde Monday.com
- Board "Gastos" (ID: 1392885945) con 1183 items totales
- Filtrado por fecha de pago Q1 2026 (01/01 - 09/03/2026)
- **49 facturas** descargadas, leídas y renombradas secuencialmente
- Guardadas en `~/Documents/facturas recibidas 1T a 9 marzo 2026/`
- Formato: `NNN - [Nº Factura] - [Razón Social].pdf`
- Excluidos: 4 comprobantes de transferencia, 1 acuerdo (La Wash), 1 duplicado
- **Pendientes para la gestora (~abril):** factura La Wash (Global Networks) y alquiler febrero (Montserrat Planas) - no estaban en Monday

### 2. Extracción de datos de FileMaker Pro 18
- Archivo: `~/Documents/contabilidad/contabilidad.fmp12`
- El usuario exportó manualmente 14 CSV (el formato binario FMP12 no es accesible programáticamente)
- CSVs guardados en `~/Documents/contabilidad/copia de seguridad a día 9 marzo 2026/`

### 3. Procesamiento y análisis de datos
Datos parseados y guardados en `data/contabilidad/` del repo:

| Tabla | Registros | Archivo |
|---|---|---|
| Grabaciones | 3.758 sesiones | grabaciones.json |
| Facturas emitidas | 1.499 | facturas_emitidas.json |
| Clientes | 497 | clientes.json |
| Gastos | 1.599 | gastos.json |
| Proveedores | 211 | proveedores.json |
| Servicios | 7 tipos | servicios.json |

### 4. Estadísticas generadas

**Ingresos totales por grabaciones:** 338.722,37 €
**Total sesiones:** 3.758
**Artistas únicos:** 1.016
**Productores únicos:** 876

**Top 10 productores (por ingresos):**

| # | Productor | Ingresos | Sesiones | Artistas |
|---|---|---|---|---|
| 1 | Jorge Villaescusa | 23.380 € | 50 | 27 |
| 2 | Marc Martin | 11.210 € | 41 | 17 |
| 3 | David Santisteban | 9.240 € | 66 | 20 |
| 4 | Roque Baños | 7.250 € | 25 | 4 |
| 5 | Jacobo Calderón | 4.960 € | 48 | 6 |
| 6 | Alex Vélez | 3.840 € | 75 | 2 |
| 7 | John Caballés | 3.700 € | 34 | 9 |
| 8 | Koen Moeyaert | 3.391 € | 56 | 1 |
| 9 | Fabián Rincón | 3.192 € | 23 | 5 |
| 10 | Ten Productions | 3.030 € | 29 | 9 |

**Ingresos por año:**

| Año | Ingresos | Sesiones |
|---|---|---|
| 2013 | 1.000 € | 1 |
| 2014 | 2.260 € | 24 |
| 2015 | 6.874 € | 54 |
| 2016 | 10.800 € | 117 |
| 2017 | 15.802 € | 144 |
| 2018 | 20.480 € | 256 |
| 2019 | 22.582 € | 238 |
| 2020 | 41.436 € | 506 |
| 2021 | 47.064 € | 531 |
| 2022 | 36.928 € | 406 |
| 2023 | 34.990 € | 396 |
| 2024 | 48.647 € | 527 |
| 2025 | 44.501 € | 477 |
| 2026 | 5.358 € | 77 |

### 5. Listado unificado de productores
- Cruce de datos de FileMaker (876 productores de grabaciones) con:
  - Google Contacts (12.166 contactos, 681 matches)
  - Outlook Contacts (651 contactos, 62 matches)
  - Gmail API - infotonimateos@gmail.com (22.414 msgs, 52 matches)
  - Gmail API - tonidrummer@gmail.com (28.066 msgs, 4 matches)
  - Fuzzy matching mejorado (13 matches adicionales)
- **Resultado: 757/876 productores (86%) con teléfono y/o email**
- Guardado en `data/contabilidad/productores.json`
- 119 productores sin contacto (mayormente 1-7 sesiones)

### 6. Configuración de APIs
- **Google OAuth** configurado (proyecto `web-nueva-2026`)
  - Gmail API habilitada para infotonimateos@gmail.com y tonidrummer@gmail.com
  - Tokens guardados localmente (no en repo)
- **Microsoft Hotmail** - pendiente: Azure Portal no permite cuentas personales live.com
  - Verificación en dos pasos activada
  - App password generada (IMAP no funciona, MS deshabilitó auth básica)

### 7. Corrección de datos y gráficos
- **Bug corregido:** El campo CSV[1] era "Sumatorio" (total acumulado), NO el precio de sesión. El campo correcto es CSV[23] = "total grabación"
- Total correcto: **338.722,37 €** (antes estaba duplicado a 677.444€)
- Campos de grabaciones.json renombrados para coincidir con FileMaker: fecha_grabacion, artista, productor, disco, temas, precios_tema, total_grabacion, ciudad, estudio, cobrado, con_factura, notas
- 14 productores con total_revenue corregido en productores.json
- Gráficos regenerados: `data/charts/top10_ingresos.html`, `data/charts/evolucion_anual.html`

## Notas importantes
- Los PDFs de facturas emitidas en `~/Documents/contabilidad/[año]/facturas emitidas/` son la **fuente definitiva** (el FileMaker tiene errores en facturas)
- Las grabaciones del FileMaker SÍ son fiables
- Próximo paso planificado: crear interfaz gráfica/web para consultar y añadir datos de contabilidad
- Datos en formato JSON (compatible con cualquier web/app futura)

## Commits
- `e6364cf` - Add contabilidad data exported from FileMaker
- `f6eda8e` - Add session log for 2026-03-09
- `f91c91a` - Add unified client list (clientes_unificado.json)
- `a8b3377` - Add producers list enriched from Google + Outlook + Gmail
- `6c2479c` - Update producers with tonidrummer@gmail.com matches
- `a6b71da` - Update producers with fuzzy Google matching
