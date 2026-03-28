import { describe, it, expect } from "vitest";
import { getGuideSuggestions } from "@/lib/education/suggestions";

describe("getGuideSuggestions", () => {
  it("devuelve una lista específica según el agente", () => {
    const prompts = getGuideSuggestions("sitrAgent");
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts[0]).toContain("SITR");
  });

  it("usa el fallback por defecto cuando no existe el agente", () => {
    const prompts = getGuideSuggestions("inexistente");
    expect(prompts).toEqual(getGuideSuggestions(null));
  });

  it("tolera entradas vacías", () => {
    const prompts = getGuideSuggestions(undefined as any);
    expect(Array.isArray(prompts)).toBe(true);
  });
});
