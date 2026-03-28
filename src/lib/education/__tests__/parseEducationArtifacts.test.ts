import { describe, it, expect } from "vitest";
import { parseEducationArtifacts } from "@/lib/education/parseArtifacts";

describe("parseEducationArtifacts", () => {
  it("separa microlección, checklist y plan", () => {
    const raw = `## Microlección PMU
Detalles
### Checklist de Autoevaluación
1. Pregunta?
#### Plan de Práctica
- Actividad
**CTA** Completa el curso`;

    const parsed = parseEducationArtifacts(raw);

    expect(parsed.microlesson).toContain("Microlección PMU");
    expect(parsed.checklist).toContain("Checklist de Autoevaluación");
    expect(parsed.practice).toContain("Plan de Práctica");
    expect(parsed.cta).toContain("CTA");
  });

  it("devuelve el bloque completo si no hay títulos reconocidos", () => {
    const raw = "Contenido libre sin encabezados";
    const parsed = parseEducationArtifacts(raw);
    expect(parsed.microlesson).toBe(raw);
    expect(parsed.checklist).toBeUndefined();
  });

  it("maneja entradas vacías sin fallar", () => {
    const parsed = parseEducationArtifacts("");
    expect(parsed.raw).toBe("");
    expect(parsed.microlesson).toBeUndefined();
  });
});
