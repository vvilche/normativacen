# Design System: NormativaCEN Multi-Agent Compliance Hub
**Project ID:** NCEN-PLATFORM-2026

## 1. Visual Theme & Atmosphere
- **Expert / Industrial Midnight:** A dense, high-contrast cockpit for incident response. Surfaces are obsidian (#050810–#0B0F1A) with molten gold accents (#EAB308) and diffused glass layers. Typography is punchy and uppercase, evoking urgency and precision. Shadows are whisper-soft to keep focus on telemetry data.
- **Guide / Regulatory Campus:** A bright, instructional workspace inspired by technical training centers. Backgrounds shift to sky blues (#F4FAFF) and calm indigos (#1A237E), with pill-shaped panels and ample white space. Tone is reassuring and pedagogical.
- **Shared Philosophy:** Both modes emphasize clarity, dense information blocks, and quick scanning. Every panel must declare its role (badges, chips, timeline ticks) while preserving a sense of layered depth.

## 2. Color Palette & Roles
| Descriptive Name | Hex | Usage |
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

## 3. Typography Rules
- **Headlines:** Space Grotesk, uppercase, tight tracking (-0.03 to -0.05em). Sizes: Expert hero 32–40px, Guide hero 36px, card headers 12px uppercase.
- **Body & Labels:** Inter. Body copy 14px/1.6, instructional blurbs 16px in guide views. Data labels use 9–11px uppercase with generous letter spacing (0.2–0.4em).
- **Mono Data:** JetBrains Mono / tabular numbers for timings, IDs, telemetry chips.
- **Hierarchy cues:** Expert mode relies on color + uppercase; Guide mode combines weight changes (700 vs 500) with subtle color shifts.

## 4. Component Stylings
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

## 5. Layout Principles
- **Grid:** Base grid 12 columns, 24px gutters. Expert dashboards use 5/4/3 column split for summary, controls, metrics. Guide layouts favor 1–3 column modular grids (learning tiles, knowledge cards).
- **Spacing:** Global padding 32px desktop / 24px tablet / 16px mobile. Section spacing 32–40px. Cards maintain 16–20px internal padding (14px text gutters for guide mode).
- **Navigation:** Sticky top bar with mode badge. Sidebar uses uppercase nav items; active item changes background to match mode palette.
- **Mode Switching:** When toggling modes, update body class to `theme-guide` or `theme-expert`, swap background gradients, adjust copy casing, and re-tint cards/inputs. Animate hero background crossfade (300ms) for polish.
- **Required Content Order:** Hero summary → Metrics grid → Learning/Checklist modules → Base de conocimiento (collapsible) → Plan de acción → Footer metadata.

## Additional Guidance
- Sanitize plan de acción items before render (strip markdown, ignore placeholders) to keep cards meaningful.
- Limit gold/amber highlights to primary CTAs and risk badges; use teal/emerald for telemetry to avoid visual fatigue.
- Preserve consistent letter-spacing and uppercase style in all data labels so both modes feel like parts of the same system.
- Ensure every long-form text block has a scroll clamp or pagination to prevent “scroll fatigue.”
