# White Paper: Auditoría de Relés EDAC (NTSyCS)

[METRICS_JSON]
{ "Relés Audit": "142", "T. Operación": "150 ms", "Error Frec.": "0.01 Hz", "Nivel Riesgo": "MEDIO" }

[HALLAZGO_HIGHLIGHT]
La calibración sub-estándar de relés de frecuencia en alimentadores mineros genera un desacople sistémico del plan nacional EDAC.

 Auditorías (Metodología Tung)

## 📋 1. MAPEO DE GRAFOS (Relacionalidad Normativa)
La jerarquía que rige la desconexión automática de carga es:
- `[Ley General de Servicios Eléctricos (LGSE)]` → Deber de seguridad y continuidad.
- `[DS 11/2017: Reglamento de Transferencias de Potencia]` → Obligatoriedad de esquemas de protección.
- `[Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS)]` → Capítulo de Control de Frecuencia.
- `[Procedimiento CEN: Verificación de Activación Óptima EDAC]` → Criterios de evaluación post-evento.

**Nodo Crítico**: El tiempo de actuación **<= 200 ms**. Una demora superior se considera un fallo de control que compromete la estabilidad de la red.

## 🔗 2. DATA FABRIC AGÉNTICO (Interoperabilidad)
- **Dimensión Legal**: Sujeto a auditorías de la SEC según el DS 119. [Primaria-Verificada]
- **Dimensión Operativa**: El Coordinador Eléctrico Nacional (CEN) utiliza el EDAC para recuperar la frecuencia en sub-frecuencia extrema (59.0 Hz). [Primaria-Verificada]
- **Dimensión Económica**: Una actuación incorrecta (0-20% de carga esperada) puede derivar en el pago de **Compensaciones por Indisponibilidad** a usuarios finales y procesos sancionatorios de la SEC. [Sintética-Especulativa]

## 🌪️ 3. SIMULACIÓN DE ESTRÉS (Digital Twin de Fallo)
**Escenario**: Fallo de relé digital UFLS por des-configuración de umbral df/dt.
- **Fallo Técnico**: El relé no detecta la caída de frecuencia a tiempo; la carga no se desconecta.
- **Consecuencia Regulatoria**: El activo es clasificado como **"Incorrecto"** por el CEN. Multas directas de la SEC por poner en riesgo la seguridad nacional.
- **Impacto Financiero**: Costos legales de defensa ante la SEC y posible reclamación de terceros por daños en procesos industriales no protegidos.

## 📂 4. AUDITORÍA DE LINAJE
- `[Primaria-Verificada]`: NTSyCS (Marzo 2025), Informe Técnico EDAC 2025 del CEN.
- `[Secundaria-Probable]`: Manuales técnicos de fabricantes de relés (SEL, Siemens, ABB).
- `[Sintética-Especulativa]`: Proyección de riesgos basada en el apagón de Febrero 2025.

---
*© 2026 NORMATIVACEN.CL - Framework: Metodología Tung Alpha*
