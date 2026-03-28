export interface ParsedEducationArtifacts {
  microlesson?: string;
  checklist?: string;
  practice?: string;
  cta?: string;
  raw: string;
}

export function parseEducationArtifacts(content?: string | null): ParsedEducationArtifacts {
  const normalized = (content || "")
    .replace(/\r/g, "")
    .trim();

  const parsed: ParsedEducationArtifacts = {
    raw: normalized,
  };

  if (!normalized) {
    return parsed;
  }

  const segments = normalized.split(/\n(?=(?:##|###|####|\*\*CTA))/g);

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    if (!parsed.microlesson && /microlecci/i.test(trimmed)) {
      parsed.microlesson = trimmed;
      continue;
    }
    if (!parsed.checklist && /checklist/i.test(trimmed)) {
      parsed.checklist = trimmed;
      continue;
    }
    if (!parsed.practice && /plan de pr[áa]ctica/i.test(trimmed)) {
      parsed.practice = trimmed;
      continue;
    }
    if (!parsed.cta && /cta/i.test(trimmed)) {
      parsed.cta = trimmed;
    }
  }

  if (!parsed.microlesson) {
    parsed.microlesson = normalized;
  }

  return parsed;
}
