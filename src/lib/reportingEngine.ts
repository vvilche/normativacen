/**
 * ==========================================
 * REPORTING ENGINE: Dossier de Cumplimiento
 * ==========================================
 * Transforma los hallazgos técnicos de los 9 agentes en informes
 * de ingeniería profesional.
 */

export interface ReportMetric {
  label: string;
  value: string;
  status: 'critical' | 'warning' | 'success' | 'info';
}

export interface TechnicalReport {
  id: string;
  title: string;
  date: string;
  coordinado: string;
  agentType: string;
  verdict: string;
  hallazgo: string;
  metrics: ReportMetric[];
  seoTags: string[];
  normativeReferences: string[];
  actionPlan: { id: string; task: string; priority: string }[];
}

/**
 * Genera un reporte basado en la salida estructurada de un agente.
 */
export function generateTechnicalReport(
  agentOutput: { 
    content: string; 
    metrics: { metrics: ReportMetric[] }; 
    hallazgo: string; 
    seoTags: string[] 
  },
  agentType: string,
  userProfile: { company?: string; [key: string]: unknown }
): TechnicalReport {
  const date = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const reportId = `CEN-${agentType.toUpperCase()}-${Date.now().toString().slice(-4)}`;

  return {
    id: reportId,
    title: `Informe Técnico de Cumplimiento: ${agentType.toUpperCase()}`,
    date,
    coordinado: userProfile.company || "Coordinado No Identificado",
    agentType,
    verdict: agentOutput.content.split('\n')[0], // Primera línea como veredicto
    hallazgo: agentOutput.hallazgo || "No se detectaron hallazgos críticos de alto impacto.",
    metrics: agentOutput.metrics?.metrics || [],
    seoTags: agentOutput.seoTags || [],
    normativeReferences: extractNormativeReferences(agentOutput.content),
    actionPlan: extractActionPlan(agentOutput.content)
  };
}

/**
 * Extrae referencias normativas (ej: NTSyCS, SITR, CIP-010) del texto.
 */
function extractNormativeReferences(text: string): string[] {
  const patterns = [
    /NTSyCS\s*[a-zA-Z0-9.\/]*/gi,
    /AT-SITR-[0-9]*/gi,
    /CIP-[0-9]*/gi,
    /CEN-REG-[0-9]*/gi,
    /Procedimiento\s*[A-Z]{2}-[0-9]*/gi
  ];
  
  const results = new Set<string>();
  patterns.forEach(p => {
    const matches = text.match(p);
    if (matches) matches.forEach(m => results.add(m.trim()));
  });
  
  return Array.from(results);
}

/**
 * Extrae pasos de acción del texto si están numerados o con bullets.
 */
function extractActionPlan(text: string): { id: string; task: string; priority: string }[] {
  const lines = text.split('\n');
  const plan: { id: string; task: string; priority: string }[] = [];
  let idCounter = 1;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^[0-9]\.|^[-*]/)) {
      plan.push({
        id: `A${idCounter++}`,
        task: trimmed.replace(/^[0-9]\.|^[-*]/, '').trim(),
        priority: trimmed.toLowerCase().includes('crítico') || trimmed.toLowerCase().includes('urgente') ? 'CRÍTICA' : 'Media'
      });
    }
  });

  return plan.slice(0, 5); // Máximo 5 acciones para el reporte ejecutivo
}
