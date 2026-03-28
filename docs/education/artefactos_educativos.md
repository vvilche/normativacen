# Artefactos Educativos para la Plataforma

## 1. Ruta de Aprendizaje (Exploratorio)
| Módulo | Objetivo | Formato | Duración | Normativa Base |
| --- | --- | --- | --- | --- |
| Introducción al SITR | Comprender qué reporta el SITR y por qué | Microlección con infografías | 10 min | NTSyCS Cap.4, Estándar SITR v2.1 |
| PMUS 2026 en 4 pasos | Explicar el flujo administrativo | Hoja interactiva + checklist | 12 min | PMUS 2026, Anexos SEC |
| EDAC mínimo viable | Preparar evidencias para auditoría | Video corto + quiz de 5 preguntas | 8 min | DS88, Manual EDAC |

## 2. Ruta Operativa (Diagnóstico rápido)
| Escenario | Artefacto | Resultado esperado |
| --- | --- | --- |
| Latencia SITR >500ms | Guía “Plan de Respuesta SITR” + simulación interactiva | Checklist para restablecer enlaces y reporte al CDC |
| PMU sin timestamp | Script de práctica + cuestionario CIP-013 | Lista de consecuencias y plan de mitigación |
| BESS FFR <200ms | Laboratorio guiado (FFR) + gráfico comparativo | Ajustes recomendados y evidencias para el dossier |

## 3. Plantillas incluidas
1. **Microlección Markdown** (`templates/microleccion.md`): título, objetivo, tiempo estimado, bullets, referencia normativa.
2. **Checklist de Autoevaluación** (`templates/checklist.md`): 5 ítems, clave de respuesta y link a glosario.
3. **Plan de Práctica** (`templates/plan_practica.md`): actividades, recursos, métrica de éxito.

## 4. Recomendaciones de despliegue
- Mostrar los artefactos en el panel lateral del dashboard cuando `clientMode='guide'`.
- Enviar los mismos artefactos al dossier para que queden en la documentación exportable.
- Guardar métricas de consumo (por ejemplo, cuántas veces un usuario descarga un módulo) para alimentar futuras mejoras.

## 5. Próximos pasos
- Integrar quizzes xAPI para registrar progreso.
- Habilitar badges de capacitación completada en el dashboard.
- Publicar los recursos en un repositorio accesible (ej. `public/education/`).
