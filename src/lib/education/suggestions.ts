export const GUIDE_SUGGESTIONS: Record<string, string[]> = {
  default: [
    "¿Qué evidencias básicas exige el CEN para auditoría?",
    "¿Cómo programo mi primera actualización PMUS?",
    "¿Dónde encuentro el procedimiento EDAC vigente?"
  ],
  sitrAgent: [
    "¿Qué parámetros monitorea SITR diariamente?",
    "¿Cómo valido la latencia <500ms en mis enlaces?",
    "¿Qué debo reportar al CDC si falla la telemetría?"
  ],
  procedimentalAgent: [
    "¿Cuáles son los plazos SEC para PMUS 2026?",
    "¿Qué documentos debo presentar al CEN para actualizaciones?",
    "¿Cómo documento evidencias para EDAC?"
  ],
  consumoAgent: [
    "¿Qué implicancias tiene un EDAC incompleto?",
    "¿Cómo evidencio mis respuestas ante el CEN?",
    "¿Qué checklist básico debo revisar cada mes?"
  ],
  bessAgent: [
    "¿Qué normas CIP aplican a mi BESS?",
    "¿Cómo monitoreo el FFR en tiempo real?",
    "¿Qué debo reportar al CDC del CEN ante incidentes?"
  ]
};

export function getGuideSuggestions(agentType?: string | null) {
  if (!agentType) {
    return GUIDE_SUGGESTIONS.default;
  }
  const normalized = agentType.trim();
  return GUIDE_SUGGESTIONS[normalized as keyof typeof GUIDE_SUGGESTIONS] || GUIDE_SUGGESTIONS.default;
}
