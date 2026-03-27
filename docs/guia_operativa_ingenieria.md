# Guía de Operación: Auditoría y Cumplimiento Normativo (SEN)

Esta guía está diseñada para que el equipo de ingeniería y operaciones del Coordinado pueda extraer el máximo valor de **Agente Normativo**, facilitando la detección temprana de brechas y la mitigación de riesgos regulatorios.

## 1. Protocolo de Auditoría de Activos

Para obtener un veredicto técnico de alta fidelidad, se recomienda seguir el siguiente protocolo de consulta.

### Estructura de Consulta Recomendada
Para auditar un activo, proporcione los siguientes datos en su consulta:
- **Identificación del Activo**: Nombre de la subestación, línea o central (ej: S/E Cordillera).
- **Variable Técnica**: Dato específico a auditar (ej: latencia, jitter, sincronismo, reactiva).
- **Evidencia actual**: Valor medido o condición observada (ej: "reportamos 4.2s de latencia").

## 2. Interpretación de la Matriz de Riesgo

Cada respuesta técnica incluye un veredicto y una clasificación de riesgo. Estos se basan en la severidad del impacto en la estabilidad del sistema y el monto potencial de la multa SEC.

| Nivel de Riesgo | Veredicto | Implicancia | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **CRÍTICO** | 🔴 **NO CUMPLE** | Desconexión inminente o multa máxima (> 5000 UTA). | Intervención técnica inmediata (Emergencia). |
| **ALTO** | 🟡 **CUMPLE PARCIAL** | Brecha normativa detectada en redundancia o protocolos. | Planificar corrección en el próximo mantenimiento. |
| **BAJO / INFO** | 🟢 **CUMPLE** | Operación dentro de márgenes normativos. | Seguimiento preventivo estándar. |

## 3. Gestión del Plan de Acción

El sistema genera automáticamente un **Plan de Acción Priorizado** basado en los hallazgos.

1.  **Hallazgo Maestro**: Resumen ejecutivo del incumplimiento detectado.
2.  **Referencia Normativa**: Cita exacta (Capítulo, Artículo, Norma) que sustenta el hallazgo.
3.  **Trazabilidad**: En el Dashboard, puede ver qué especialista emitió cada parte del informe.
