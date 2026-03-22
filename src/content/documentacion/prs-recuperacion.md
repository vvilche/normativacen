# White Paper: Planes de Recuperación de Servicio (PRS)

[METRICS_JSON]
{ "SLA Black Start": "< 30 min", "Costo ENS": "US$ 5.0/kWh", "Rutas Críticas": "22", "Riesgo SEC": "ALTO" }

[HALLAZGO_HIGHLIGHT]
El fallo en la sincronización de islas de recuperación es el principal vector de multas sistémicas bajo la NTSyCS 2025.

## 📋 1. MAPEO DE GRAFOS (Relacionalidad Normativa)
La resiliencia del Sistema Eléctrico Nacional (SEN) ante apagones totales o parciales se articula en:
- `[Ley General de Servicios Eléctricos (LGSE)]` → Garantía de continuidad del servicio.
- `[DS 11/2017: Reglamento de Transferencias de Potencia]` → Obligación de disponer de recursos de recuperación.
- `[Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS)]` → Título 7-6 (Plan de Recuperación de Servicio).
- `[Procedimiento CEN: Reposición del Suministro]` → Instrucciones de despacho en Estado de Recuperación.

**Nodo Crítico**: El **SLA de Partida Autónoma (Black Start)**. Una unidad con este servicio debe ser capaz de energizar barras muertas y estabilizar frecuencia en menos de **30 minutos** (según prueba de habilitación).

## 🔗 2. DATA FABRIC AGÉNTICO (Interoperabilidad)
- **Dimensión Legal**: Incumplimiento de tiempos de recuperación activa procesos sancionatorios SEC bajo la figura de "Indisponibilidad Injustificada". [Primaria-Verificada]
- **Dimensión Operativa**: El Coordinador define las **Rutas de Recuperación** prioritarias hacia Cargas Críticas (Hospitales, Minería). [Primaria-Verificada]
- **Dimensión Económica**: La **Energía No Suministrada (ENS)** tiene un costo ponderado de ~**US$ 1.5 - 5.0 por kWh** (dependiendo del sector). Un retraso sistémico se traduce en millones de dólares en pérdidas de productividad nacional. [Sintética-Especulativa]

## 🌪️ 3. SIMULACIÓN DE ESTRÉS (Digital Twin de Fallo)
**Escenario**: Una central hidráulica de pasada con Partida Autónoma falla en su secuencia de arranque durante un Apagón Total del SEN.
- **Fallo Técnico**: El generador diesel de emergencia no arranca por falta de mantenimiento en baterías.
- **Consecuencia Regulatoria**: La "Isla de Recuperación" Norte se retrasa 3 horas. El activo pierde su calificación de Proveedor de Partida Autónoma.
- **Impacto Financiero**: 
    - Pérdida de remuneración por **Servicios Complementarios (SSCC)**.
    - Multas SEC proporcionales a la ENS incremental generada por el retraso.
    - Daño reputacional crítico ante el Coordinador.

## 📂 4. AUDITORÍA DE LINAJE
- `[Primaria-Verificada]`: NTSyCS (Edición Enero 2025), Capítulo 7.
- `[Secundaria-Probable]`: Informe de Autoevaluación de Coordinados (2024).
- `[Sintética-Especulativa]`: Valorización de ENS basada en el "Insumo de Costo de Falla" de la CNE.

---
*© 2026 NORMATIVACEN.CL - Framework: Metodología Tung Alpha*
