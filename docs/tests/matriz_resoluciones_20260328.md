### Matriz de pruebas internas – 28/03/2026

| Hora aprox | Prompt | Modo | Agente | RAG (ms) | LLM (ms) | Auditor (ms) | Revisiones | Resultado / Notas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 10:05 | Plan de modernización SITR / PMU para subestación 500kV con redundancia IEC 61850/104 | Fast | SITR | 66 | 23625 | — | 0 | Respuesta inmediata (sin auditor). |
| 10:09 | Plan de modernización SITR / PMU para subestación 500kV con redundancia IEC 61850/104 | Full | SITR | 66 | 20010 | 25572 | 0 | Auditoría completa aprobada con observaciones menores. |
| 10:18 | Trámite PMUS 2026 y plazos SEC para PMGD 3MW | Fast | SITR | 67 | 18661 | — | 0 | Enfoque técnico SITR; PMUS referenciado. |
| 10:22 | Trámite PMUS 2026 y plazos SEC para PMGD 3MW | Full | SITR | 67 | 18687 | 19442 | 0 | Auditoría aprobada. |
| 10:31 | Cumplimiento NERC CIP-013 para BESS con cadena de suministro crítica | Fast | BESS | 67 | 13735 | — | 0 | Respuesta sobre cadena suministro y BESS. |
| 10:35 | Cumplimiento NERC CIP-013 para BESS con cadena de suministro crítica | Full | BESS | 66 | 15919 | 14478 | 0 | Auditoría aprobada. |
| 10:43 | Checklist EDAC para cliente libre 50MW con relés de frecuencia | Fast | Consumo (EDAC) | 68 | 18118 | — | 0 | Checklist EDAC entregado. |
| 10:48 | Checklist EDAC para cliente libre 50MW con relés de frecuencia | Full | Consumo (EDAC) | 64 / 124 | 20350 / 24808 | 7984 / 7321 | 1 | Auditoría pidió reintento y terminó en `[RECHAZADO]` por estilo/referencias. |

> Nota: Las horas son aproximadas según la secuencia de ejecución local. Valores de RAG/LLM/Auditor provienen de los logs `⏱️` mostrados por el script de pruebas.
