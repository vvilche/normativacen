# Sistema de Diseño: NormativaCEN Multi-Agent Compliance Hub
**ID de proyecto:** NCEN-PLATFORM-2026

## 1. Tema visual y atmósfera
- **Modo experto / Industrial Midnight:** Cabina de control densa y de alto contraste para respuesta a incidentes. Superficies obsidianas (#050810–#0B0F1A) con acentos de oro fundido (#EAB308) y capas de vidrio difuso. La tipografía en mayúsculas transmite urgencia y precisión; las sombras suavizadas mantienen el foco en la telemetría.
- **Modo guía / Campus regulatorio:** Espacio didáctico inspirado en centros de entrenamiento. Fondos azul cielo (#F4FAFF) e índigos relajados (#1A237E), paneles redondeados y abundante aire visual. Tono tranquilizador y pedagógico.
- **Filosofía compartida:** Ambos modos priorizan la claridad y el escaneo rápido. Cada panel declara su función (badges, chips, timelines) sin perder sensación de profundidad.

## 2. Paleta de color y roles
| Nombre descriptivo | Hex | Uso |
| --- | --- | --- |
| **Industrial Obsidian** | #050810 / #0B0F1A | Expert backgrounds, glass cards, modal overlays. |
| **Ionized Gold Accent** | #EAB308 | Primary CTAs, status chips, badges, hero glow; limited to 2 per viewport to avoid glare. |
| **Diagnostic Teal Pulse** | #00DAF3 | Secondary signals (timings, telemetry), hover glows on expert widgets. |
| **Risk Amber** | #FFBA38 | Warning banners, verdict badges when risk ≥ MEDIUM. |
| **Success Emerald** | #10B981 | Passing controls, live indicators, network OK states. |
| **Regulatory Indigo Gradient** | #1A237E → #283593 | Guide hero backgrounds, CTA outlines, nav highlights. |
| **Soft Sky Surface** | #F4FAFF / #E7F6FF | Guide cards, background canvases, learning tiles. |
| **Slate Ink Text** | #0D1E25 / #4C616C | Body copy and muted labels in guide mode. |
| **Outline Mist** | rgba(13,30,37,0.08) / #767683 | Dividers, card borders, timeline stems. |

## 3. Reglas tipográficas
- **Titulares:** Space Grotesk en mayúsculas, tracking ajustado (-0.03 a -0.05em). Tamaños: hero experto 32–40px, hero guía 36px, headers de cards 12px uppercase.
- **Cuerpo y etiquetas:** Inter. Copy principal 14px/1.6; textos explicativos guía 16px. Labels de datos entre 9–11px con 0.2–0.4em de letter-spacing.
- **Datos monoespaciados:** JetBrains Mono (números tabulares) para tiempos, IDs y chips de telemetría.
- **Jerarquía:** Modo experto combina color + uppercase; modo guía alterna pesos (700/500) y variaciones de color sutil.

## 4. Estilos de componentes
- **Buttons:**
  - Expert primary: pill rectangles (8px radius) in gold (#EAB308) on dark backgrounds; glow shadow on hover. Secondary: ghost charcoal buttons with gold text/border.
  - Guide primary: solid white on indigo gradient hero; secondary: translucent white/10% with frosted borders.
  - Interactions: 150ms scale + shadow transitions. Disabled states drop opacity to 45%.
- **Cards & Containers:**
  - Expert: `.glass-card` (rgba(22,27,41,0.3), blur 12px) with 1px translucent borders and soft drop shadows. Corners 12px. Use gold accent bars or badges to signal category.
  - Guide: solid surfaces (#E7F6FF/#D4E5EF) with 12px radius, minimal shadow, and outlines (#Outline Mist).
- **Inputs / Forms:**
  - Expert: charcoal wells (#161B29) with 1px gold borders on focus, uppercase placeholder text.
  - Guide: white or surface-container backgrounds with subtle rounded corners; placeholders sentence case.
- **Timelines & Chips:** vertical neon line with status-coded nodes (emerald for OK, amber for caution). Chips are pill-shaped, 10px uppercase text; background and border follow status palette.
- **Scroll Clamps:** long markdown sections use gradient masks (`clamped`) and a “Mostrar más” control outside the masked area so buttons never overlap content.

## 5. Principios de maquetación
- **Grid:** Base grid 12 columns, 24px gutters. Expert dashboards use 5/4/3 column split for summary, controls, metrics. Guide layouts favor 1–3 column modular grids (learning tiles, knowledge cards).
- **Spacing:** Global padding 32px desktop / 24px tablet / 16px mobile. Section spacing 32–40px. Cards maintain 16–20px internal padding (14px text gutters for guide mode).
- **Navigation:** Sticky top bar with mode badge. Sidebar uses uppercase nav items; active item changes background to match mode palette.
- **Mode Switching:** When toggling modes, update body class to `theme-guide` or `theme-expert`, swap background gradients, adjust copy casing, and re-tint cards/inputs. Animate hero background crossfade (300ms) for polish.
- **Required Content Order:** Hero summary → Metrics grid → Learning/Checklist modules → Base de conocimiento (collapsible) → Plan de acción → Footer metadata.

## Guía adicional
- Sanear tareas del plan de acción antes de mostrarlas (quitar “--”, limpiar Markdown) para mantenerlos útiles.
- Limitar acentos dorados/ámbar a CTA primarias y badges de riesgo; usar tonos teal/verde para telemetría.
- Mantener letter-spacing y uppercase coherentes en los labels de ambos modos.
- Controlar bloques largos con `clamped` o paginación para evitar “scroll fatigue”.
