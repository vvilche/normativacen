import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar ambiente ANTES de cualquier importación de módulos de la App
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

async function runValidation() {
  console.log("🛠️  INICIANDO VALIDACIÓN DE ESCENARIOS CRÍTICOS (GOLDEN SAMPLES)");
  console.log("===============================================================");
  console.log(`🔑 MONGODB_URI: ${process.env.MONGODB_URI ? 'Detectada ✅' : 'NO DETECTADA ❌'}`);

  // Importación dinámica para asegurar que process.env esté poblado
  const { buildOrchestratorGraph } = await import('../src/lib/agents/orchestratorGraph');
  const { HumanMessage } = await import("@langchain/core/messages");

  const CRITICAL_SAMPLES = [
    {
      category: "SITR",
      name: "Falla de Sincronismo GPS",
      prompt: "Auditar la integridad de datos de una subestación de transmisión donde el receptor GPS muestra un drift de 500ms respecto al reloj de referencia del CEN."
    },
    {
      category: "BESS",
      name: "Respuesta de Frecuencia Rápida (FFR)",
      prompt: "Evaluar si un sistema BESS de 50MW/100MWh cumple con la NTSyCS al tener un tiempo de respuesta FFR de 350ms ante una caída de frecuencia sub-transitoria."
    },
    {
      category: "CIBERSEG",
      name: "Brecha NERC CIP (TeamViewer)",
      prompt: "Auditar la seguridad de una red SCADA donde se detectaron accesos remotos vía TeamViewer sin el uso de un Electronic Security Perimeter (ESP) certificado."
    }
  ];

  const app = buildOrchestratorGraph();
  const results = [];

  for (const sample of CRITICAL_SAMPLES) {
    console.log(`\n🔍 PROBANDO: [${sample.category}] - ${sample.name}...`);
    
    try {
      const result = (await app.invoke({
        messages: [new HumanMessage(sample.prompt)],
        userProfile: { name: "Auditor Interno", role: "Ingeniero QA", company: "NormativaCEN Test Runner" }
      })) as any;

      const lastMsg = result.messages[result.messages.length - 1];
      const content = lastMsg.content;
      
      const verdict = content.includes("NO CUMPLE") || content.includes("[RECHAZADO]") ? "NO CUMPLE 🔴" : "CUMPLE 🟢";
      
      console.log(`✅ Resultado: ${verdict}`);
      
      results.push({
        ...sample,
        verdict,
        reasoning: content.slice(0, 300) + "..."
      });
    } catch (err: any) {
      console.error(`❌ Fallo en escenario ${sample.name}:`, err.message || err);
    }
  }

  console.log("\n===============================================================");
  console.log("📊 RESUMEN DE VALIDACIÓN FINALIZADO.");
}

runValidation().catch(console.error);
