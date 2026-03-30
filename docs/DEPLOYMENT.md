# Estrategia de Entornos

## Ramas activas

- `release-v1`: contiene únicamente el MVP (Dashboard + Dossier). Es la rama que debe desplegarse al entorno de producción "NormativaCEN Launch".
- `future-lab`: rama experimental creada desde el commit previo al downsizing (mantiene educación, modernización, etc.). Se despliega en el entorno "NormativaCEN Lab" para pruebas y demos.

## Flujo semanal sugerido

1. **Lunes**
   - Revisar métricas/feedback del sitio Launch.
   - Registrar mejoras o bugs detectados en `docs/UX_BRIEF.md` o issues.
2. **Miércoles**
   - Desarrollar y probar nuevas funciones en `future-lab`.
   - Ejecutar `npm run lint` y `npm run build` antes de abrir PRs.
3. **Viernes**
   - Seleccionar cambios estables y crear PRs desde `future-lab` hacia `release-v1`.
   - Realizar smoke test en el entorno Lab antes de promover a Launch.

## Deploys

| Entorno | Rama | Comando build | Notas |
| --- | --- | --- | --- |
| NormativaCEN Launch | `release-v1` | `npm run build` | Mantener variables de entorno actuales. No activar características beta. |
| NormativaCEN Lab | `future-lab` | `npm run build` | Permite features experimentales, recursos educativos y modernización. |

## Promoción de cambios

1. Abrir PR desde `future-lab` hacia `release-v1` únicamente con los commits que se van a liberar.
2. Tras hacer merge en `release-v1`, ejecutar `npm run lint && npm run build` localmente para validar.
3. Etiquetar el release (ej. `v1.0.x`) y desplegar.
4. Si algo falla, revertir en `release-v1` sin bloquear el trabajo en `future-lab`.

## Herramientas de soporte

- `npm run ux:brief`: breve interactivo para definir objetivos de cada feature antes de desarrollarla.
- `docs/UX_BRIEF.md`: describe el uso del asistente y sirve como histórico de decisions de diseño.

Con este esquema mantenemos una versión ligera y estable para clientes y un laboratorio paralelo para seguir innovando semana a semana.
