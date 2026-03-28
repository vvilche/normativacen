# Plan de Diseño inspirado en Stitch

1. **Tokens y Temas**
   - Paleta "Industrial Midnight" con acentos dorado/eléctrico.
   - Tipografías recomendadas: Space Grotesk (headings) + IBM Plex Sans (body).
   - Definir tokens en `stitches.config.ts`: colors, space, radii, shadows, motion.

2. **Layout del Dossier**
   - Sidebar sticky con gradiente vertical y TOC.
   - Main card flotante con glassmorphism ligero y grilla 12 columnas.
   - Secciones diferenciadas: resumen, métricas, hallazgos, plan de acción, tiempos, capacitación.

3. **Componentes**
   - `MetricCard` con variantes `status`. 
   - `HighlightCard` para hallazgos.
   - `TimingGrid` y `ActionPlanList` basados en tokens.
   - `EducationBlock` para modo guía (preguntas sugeridas + CTA capacitación).

4. **Microinteracciones**
   - Hover con elevación (shadow token), animación sutil en chips.
   - Transiciones suaves (200ms) siguiendo sugerencias de Stitch.

5. **Integración Técnica**
   - Instalar `@stitches/react`, crear `src/styles/stitches.config.ts`.
   - Migrar `documentacion/[slug]/page.tsx` a componentes `styled`.
   - Mantener compatibilidad con Tailwind mientras se migra gradualmente.

6. **Rollout**
   - Fase 1: layout + métricas.
   - Fase 2: plan de acción + bloques educativos.
   - Fase 3: aplicar tokens al dashboard.
