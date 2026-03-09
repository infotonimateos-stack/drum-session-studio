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

**Ingresos totales por grabaciones:** 677.444,74 €
**Total sesiones:** 3.758
**Artistas únicos:** 1.016
**Productores únicos:** 890

**Top 10 productores (por nº sesiones):**

| # | Productor | Sesiones | Importe | Artistas |
|---|---|---|---|---|
| 1 | Alex Vélez | 75 | 7.680 € | 1 |
| 2 | David Santisteban | 66 | 18.480 € | 19 |
| 3 | Koen Moeyaert | 56 | 6.782 € | 1 |
| 4 | Jorge Villaescusa | 50 | 46.760 € | 26 |
| 5 | Jacobo Calderón | 48 | 9.920 € | 5 |
| 6 | Marc Martin | 41 | 22.419 € | 17 |
| 7 | Isma Romero | 38 | 5.040 € | 7 |
| 8 | Santi Ibarretxe | 37 | 5.860 € | 11 |
| 9 | Marc Ferrando | 37 | 5.520 € | 7 |
| 10 | Marc Quintillà | 36 | 5.500 € | 14 |

**Ingresos por año:**

| Año | Ingresos |
|---|---|
| 2013 | 2.000 € |
| 2014 | 4.520 € |
| 2015 | 13.748 € |
| 2016 | 21.600 € |
| 2017 | 31.604 € |
| 2018 | 40.960 € |
| 2019 | 45.164 € |
| 2020 | 82.872 € |
| 2021 | 94.128 € |
| 2022 | 73.856 € |
| 2023 | 69.980 € |
| 2024 | 97.294 € |
| 2025 | 89.001 € |
| 2026 | 10.716 € |

## Notas importantes
- Los PDFs de facturas emitidas en `~/Documents/contabilidad/[año]/facturas emitidas/` son la **fuente definitiva** (el FileMaker tiene errores en facturas)
- Las grabaciones del FileMaker SÍ son fiables
- Próximo paso planificado: crear interfaz gráfica/web para consultar y añadir datos de contabilidad
- Datos en formato JSON (compatible con cualquier web/app futura)

## Commits
- `e6364cf` - Add contabilidad data exported from FileMaker
