# Plan de Pruebas NormativaCEN (MVP)

## 1. Objetivos
- Validar que el flujo MVP (Dashboard + Dossier) funciona con y sin la IA real.
- Asegurar que los endpoints críticos (`/api/chat`, `/api/test-infra`, `/api/auth`) responden correctamente.
- Confirmar que el fallback de IA (modo demo) entrega una resolución consistente cuando falta `GOOGLE_API_KEY`.

## 2. Pruebas Manuales Prioritarias

| ID | Caso | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| UI-01 | Consulta operativa | 1. Iniciar sesión. 2. En dashboard modo Operativo, ingresar “Latencia SITR > 500ms”. 3. Presionar “Ejecutar”. | Se genera resolución con KPIs, hallazgo y opción de “Nueva consulta”. |
| UI-02 | Dossier | 1. Tras una resolución, click en “Dossier técnico”. 2. Revisar `/documentacion/dossier?...`. | Página carga hero + contenido markdown, sin errores 404. |
| UI-03 | Exportar PDF | 1. En la vista del dossier, pulsar “Exportar dossier”. 2. Guardar como PDF. | Se abre ventana imprimible con chips, métricas, contenido y plan. |
| UI-04 | Reintento rápido | 1. Repetir UI-01 pero con `fastMode` ON. | Se obtiene respuesta y se lanza auditoría en background (spinner/hint). |
| UI-05 | Flujo sin IA real | 1. Remover `GOOGLE_API_KEY`. 2. Repetir UI-01. | Resolución muestra mensaje “Modo demo” con datos simulados, sin alertas rojas. |
| UI-06 | Cache memoria | 1. Ejecutar UI-01. 2. Repetir la misma consulta. | Segundo intento usa memoria (log “CACHE HIT”), respuesta inmediata. |
| UI-07 | Cache persistente | 1. Ejecutar UI-01. 2. Refrescar dashboard y repetir. | Respuesta se sirve desde Mongo (log “CACHE HIT” repo). |

## 3. Pruebas API

- **API-CHAT-200**: `curl -X POST /api/chat` con payload válido y `GOOGLE_API_KEY` configurado. Verificar `resolution` y `sources`.
- **API-CHAT-DEMO**: Igual que anterior pero sin `GOOGLE_API_KEY`. Debe devolver contenido simulado y `hallazgo` “Modo demo”.
- **API-CHAT-CACHE**: Ejecutar API-CHAT-200 dos veces y comprobar `isCached` en la segunda respuesta/log.
- **API-DOSSIER-200**: `GET /api/dossiers/{resolutionId}` tras UI-01. Debe devolver payload completo.
- **API-TEST-INFRA**: `GET /api/test-infra` → indica cuáles variables están configuradas.
- **API-AUTH-LOGIN**: `POST /api/auth` con email válido → recibe token (revisar Postmark si aplica).

## 4. Scripts / Automatización

Prueba rápida desde terminal (ajusta payload según necesites):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role":"user","content":"El enlace SITR supera 500ms"}
    ],
    "userProfile": {"company": "Demo S.A."},
    "clientMode": "expert"
  }'
```

## 5. Frecuencia
- Antes de cada release a `release-v1`: ejecutar UI-01/02 y API-CHAT-200.
- Semanalmente en `future-lab`: checklist completo.

## 6. Registro
Anotar resultados breves en `docs/DEPLOYMENT.md` (sección “Release checklist”) o en el issue correspondiente.
