import * as dotenv from "dotenv";
import { buildOrchestratorGraph } from "../src/lib/agents/orchestratorGraph";
import { HumanMessage } from "@langchain/core/messages";

// Cargar variables de entorno desde .env.local
dotenv.config({ path: ".env.local" });

async function testRealPrompt() {
  console.log("🧪 INICIANDO TEST INTERNO CON PROMPT REAL...\n");

  if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ ERROR: No se encontró GOOGLE_API_KEY en .env.local");
    process.exit(1);
  }

  // 1. Definir una consulta real de ingeniería
  const query = "Necesito el procedimiento técnico para habilitar una planta PMGD de 9MW con medición sincrofasorial (PMU) según la NTSyCS.";
  const userProfile = {
    name: "Victor Vilche",
    role: "Ingeniero Eléctrico",
    company: "Empresa de Pruebas",
    coordinadoType: "Generación_PMGD"
  };

  console.log(`📝 Query: "${query}"`);
  console.log(`👤 Perfil: ${userProfile.coordinadoType}\n`);

  try {
    // 2. Construir el Grafo
    console.log("⚙️  Construyendo Grafo de Orquestación...");
    const app = buildOrchestratorGraph();

    // 3. Invocar
    console.log("🤖 Invocando Agentes Multi-Dominio (Gemini 2.5 Flash + RAG)...");
    const result = await app.invoke({
      messages: [new HumanMessage(query)],
      userProfile: userProfile
    });

    console.log("\n✅ [ÉXITO] Orquestación Completada.");
    console.log("-------------------------------------------");
    
    // Obtener la respuesta final
    const finalMsg = (result as any).messages[(result as any).messages.length - 1];
    console.log("\n📄 RESPUESTA GENERADA:");
    console.log(finalMsg.content.substring(0, 1000) + "...");
    
    console.log("\n🔍 METADATOS:");
    console.log(`NODO FINAL: ${result.lastAgentNode || "undefined"}`);
    console.log(`REVISIONES: ${result.revisionCount || 0}`);
    
    // Verificar si hay métricas
    if (finalMsg.content.includes("[METRICS_JSON]")) {
      console.log("\n📊 MÉTRICAS DETECTADAS: SÍ");
    } else {
      console.warn("\n⚠️ ADVERTENCIA: No se detectaron métricas estructuradas en la respuesta.");
    }
    
    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ ERROR DURANTE LA ORQUESTACIÓN:");
    console.error(err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

testRealPrompt();
