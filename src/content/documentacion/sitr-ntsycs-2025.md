# White Paper: SITR y Exigencias NTSyCS 2025

[METRICS_JSON]
{ "Disponibilidad": ">= 99.5%", "Latencia SITR": "< 100ms", "Sincro GPS": "< 1ms", "Audit Status": "PASS" }

[HALLAZGO_HIGHLIGHT]
La infraestructura de SITR para BESS requiere redundancia galvánica para evitar el desacople del control AGC ante fallos de fibra.

## 📋 1. MAPEO DE GRAFOS (Relacionalidad Normativa)
La infraestructura de comunicaciones para el envío de datos en tiempo real (SITR) se rige por la siguiente jerarquía:
- `[Ley General de Servicios Eléctricos (LGSE)]` → Marco de seguridad y calidad.
- `[DS 125/2017: Reglamento de los Servicios Complementarios]` → Obligación de telemetría para SSCC.
- `[Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS)]` → Título 4-2 (Datos en Tiempo Real).
- `[Anexo Técnico SITR-1 / Procedimiento CEN]` → Especificaciones de protocolos ICCP/DNP3.

**Nodo Crítico**: El incumplimiento del parámetro de **Disponibilidad Mensual >= 99.5%** invalida la participación del activo en el despacho económico y la remuneración de SSCC.

## 🔗 2. DATA FABRIC AGÉNTICO (Interoperabilidad)
- **Dimensión Legal**: Sujeto a fiscalización SEC bajo el Pliego Técnico Normativo de Ciberseguridad (Res. 588), que ahora se extiende a enlaces SITR. [Primaria-Verificada]
- **Dimensión Operativa**: Requiere sincronización GPS con error < 100us para permitir el control AGC (Automatic Generation Control) del CDC del CEN. [Primaria-Verificada]
- **Dimensión Económica**: Una indisponibilidad prolongada del SITR puede forzar al CEN a despachar la unidad como "Indisponible", impactando directamente en los **Ingresos por Suficiencia** y causando desvíos en el Balance de Mercados. [Sintética-Especulativa]

## 🌪️ 3. SIMULACIÓN DE ESTRÉS (Digital Twin de Fallo)
**Escenario**: Fallo de sincronización GPS (+/- 500us) y latencia de datos > 5s por saturación de ancho de banda.
- **Fallo Técnico**: Degradación de la estampa de tiempo; el CEN rechaza los datos por inconsistencia cronológica.
- **Consecuencia Regulatoria**: Inicio de proceso sancionatorio por la SEC (Multas de hasta 10,000 UTA según DS 119).
- **Impacto Financiero**: Suspensión de pagos por **Regulación de Frecuencia (SSCC)** y penalización por "No cumplimiento de orden de despacho" si se utiliza AGC.

## 📂 4. AUDITORÍA DE LINAJE
- `[Primaria-Verificada]`: NTSyCS Título 4-2, Anexo Técnico SITR-1 (Vigente 2025).
- `[Secundaria-Probable]`: Guías de integración de la Plataforma de Monitoreo del CEN.
- `[Sintética-Especulativa]`: Estimación de multas basada en históricos de fallos de telemetría 2023-2024.

---
*© 2026 NORMATIVACEN.CL - Reporte de Cumplimiento Técnico*
