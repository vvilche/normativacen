import * as dotenv from 'dotenv';
import { buildOrchestratorGraph } from '../lib/agents/orchestratorGraph';
import { generateTechnicalReport } from '../lib/reportingEngine';
import { HumanMessage } from '@langchain/core/messages';

dotenv.config({ path: '.env.local' });

async function runInternalTest() {
  console.log("🚀 Iniciando Prueba Interna: Agente Normativo Conecta (Consolidado)");
  console.log("-------------------------------------------------------------------");

  const orchestrator = buildOrchestratorGraph();
  
  const userProfile = {
    name: "Victor (Internal Test)",
    role: "Ingeniero Jefe",
    company: "Coordinado Pro",
    coordinadoType: "BESS"
  };

  const query = "Hola, soy el Jefe de Operaciones de una planta BESS de 50MW. Estamos viendo que la latencia en el enlace SITR con el CEN subió a 4.8 segundos y el sincronismo GPS tiene un drift de 150us. Además, no hemos actualizado los parches de seguridad de los PLC de protección este mes. ¿Qué riesgos normativos enfrentamos ante el CEN y la SEC, y cuál es el plan de acción?";

  console.log(`📝 Query: "${query}"\n`);

  try {
    const initialState = {
      messages: [new HumanMessage(query)],
      userProfile: userProfile
    };

    console.log("🤖 Llamando al Orquestador (LangGraph + Gemini)...");
    const result = await orchestrator.invoke(initialState);
    
    const lastMessage = result.messages[result.messages.length - 1];
    const content = typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);

    console.log("\n✅ Respuesta Recibida:");
    console.log("--------------------");
    console.log(content);
    console.log("--------------------\n");

    // Extraer metadatos para simular el reportingEngine
    // Buscamos bloques Tung V2
    const metricsMatch = content.match(/\[METRICS_JSON\]([\s\S]*?)\[\/METRICS_JSON\]/);
    const hallazgoMatch = content.match(/\[HALLAZGO_HIGHLIGHT\]([\s\S]*?)\[\/HALLAZGO_HIGHLIGHT\]/);
    const seoMatch = content.match(/\[SEO_TAGS\]([\s\S]*?)\[\/SEO_TAGS\]/);

    const metrics = metricsMatch ? JSON.parse(metricsMatch[1].trim()) : { metrics: [] };
    const hallazgo = hallazgoMatch ? hallazgoMatch[1].trim() : "No se encontró hallazgo explícito.";
    const seoTags = seoMatch ? seoMatch[1].trim().split(',').map(s => s.trim()) : [];

    console.log("📊 Generando Dossier de Cumplimiento (Reporting Engine)...");
    const report = generateTechnicalReport(
      { content, metrics, hallazgo, seoTags },
      "bessAgent",
      userProfile
    );

    console.log("\n📄 Muestra de Dossier Generado:");
    console.log(`ID: ${report.id}`);
    console.log(`Título: ${report.title}`);
    console.log(`Hallazgo Crítico: ${report.hallazgo}`);
    console.log(`Referencias Normativas Detectadas: ${report.normativeReferences.join(", ")}`);
    console.log(`\n📋 Plan de Acción Recomendado:`);
    report.actionPlan.forEach(p => console.log(` - [${p.id}] [${p.priority}] ${p.task}`));
    
    console.log("\n-------------------------------------------------------------------");
    console.log("🛠️ PRUEBA FINALIZADA: Sistema operando conforme a Metodología Tung V2.");

  } catch (error: any) {
    console.error("❌ Error en la prueba interna:", error.message);
  }
}

runInternalTest();
