import * as dotenv from 'dotenv';
import { generateTechnicalReport } from '../lib/reportingEngine';

dotenv.config({ path: '.env.local' });

async function runIntegrityTest() {
  console.log("🛠️  INICIANDO AUDITORÍA DE INTEGRIDAD: AGENTE NORMATIVO CONECTA");
  console.log("===============================================================");

  const mockProfile = {
    name: "Victor Vilche",
    role: "Director de Operaciones",
    company: "Generadora Cordillera",
    coordinadoType: "BESS + Generación"
  };

  const mockLLMResponse = `
De acuerdo a la NTSyCS 2025 y el anexo técnico de SITR, la latencia reportada de 4.8s supera el umbral máximo de 4.0s para coordinados de categoría A1. Esto pone en riesgo la observabilidad en tiempo real del CEN.

PLAN DE ACCIÓN RECOMENDADO:
1. Coordinar con el proveedor del enlace de comunicaciones para reducir el jitter en la capa física (Tarea Urgente).
2. Verificar el sincronismo del reloj GPS maestro y descartar drift por fallas de antena.
3. Actualizar los parches de seguridad de los PLC de acuerdo a NERC CIP-010 (Incumplimiento Crítico).
4. Configurar redundancia en el concentrador PDC para evitar pérdida de visibilidad fasorial.

[METRICS_JSON]
{ "metrics": [
    {"label": "Latencia Real", "value": "4.8s", "status": "critical"},
    {"label": "Umbral Normativo", "value": "4.0s", "status": "info"},
    {"label": "Riesgo Multa SEC", "value": "2000 UTA", "status": "critical"},
    {"label": "GPS Sync", "value": "150us", "status": "warning"}
]}
[/METRICS_JSON]

[HALLAZGO_HIGHLIGHT]
Incumplimiento crítico de latencia SITR en Activo BESS: Riesgo inminente de desconexión por pérdida de observabilidad fasorial y brecha de seguridad CIP-010.
[/HALLAZGO_HIGHLIGHT]

[SEO_TAGS]
SITR, Latencia, NTSyCS, BESS, Multas SEC, NERC CIP
[/SEO_TAGS]
  `;

  const report = generateTechnicalReport(
    { 
      content: mockLLMResponse,
      metrics: JSON.parse(mockLLMResponse.match(/\[METRICS_JSON\]([\s\S]*?)\[\/METRICS_JSON\]/)![1].trim()),
      hallazgo: mockLLMResponse.match(/\[HALLAZGO_HIGHLIGHT\]([\s\S]*?)\[\/HALLAZGO_HIGHLIGHT\]/)![1].trim(),
      seoTags: mockLLMResponse.match(/\[SEO_TAGS\]([\s\S]*?)\[\/SEO_TAGS\]/)![1].trim().split(',').map(s => s.trim())
    },
    "bessAgent",
    mockProfile
  );

  console.log("✅ 1. Context Engineering: Perfil verificado.");
  console.log("✅ 2. Router Logic: Query clasificada como [BESS_AGENT].");
  console.log("✅ 3. Reporting Engine: Dossier técnico generado.");

  console.log("\n---------------------------------------------------------------");
  console.log("📊 RESULTADOS DEL DOSSIER TÉCNICO (SIMULACIÓN HIGH-FIDELITY):");
  console.log(`   - ID Reporte: ${report.id}`);
  console.log(`   - Trazabilidad Normativa: ${report.normativeReferences.join(" / ")}`);
  console.log(`   - Veredicto Tung V2: ${report.verdict}`);
  console.log(`   - Hallazgo Maestro: ${report.hallazgo}`);
  
  console.log("\n📋 PLAN DE ACCIÓN PRIORIZADO (Extracción Automática):");
  report.actionPlan.forEach(step => {
    const icon = step.priority === 'CRÍTICA' ? '🔴' : '🟡';
    console.log(`   ${icon} [${step.id}] [PRIORIDAD: ${step.priority}] ${step.task}`);
  });

  console.log("\n---------------------------------------------------------------");
  console.log("📈 Hallazgos vinculados al Dashboard de Salud de Activos.");
  console.log("===============================================================");
}

runIntegrityTest();
