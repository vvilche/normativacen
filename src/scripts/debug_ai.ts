import { buildOrchestratorGraph } from "../lib/agents/orchestratorGraph";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testAI() {
  console.log("🤖 Iniciando prueba de diagnóstico IA...");
  const query = process.argv[2] || "¿Cuáles son los tiempos de despeje para EDAC?";
  console.log(`❓ Consulta: "${query}"`);

  try {
    const app = buildOrchestratorGraph();
    const initialState = {
      messages: [new HumanMessage(query)],
      userProfile: { company: "Test Co", role: "Auditor", name: "Dev", coordinadoType: "Generadora" }
    };

    console.log("⏳ Invocando LangGraph...");
    const finalState = await app.invoke(initialState);
    
    const messages = (finalState as any).messages;
    const lastMsg = messages[messages.length - 1];
    
    console.log("\n✅ RESPUESTA DEL AGENTE:");
    console.log("------------------------");
    console.log(lastMsg.content);
    console.log("------------------------");
    
    const jsonMatch = lastMsg.content.match(/\[RES_JSON\]([\s\S]*?)\[\/RES_JSON\]/);
    if (jsonMatch) {
        console.log("\n📦 Metadatos Estructurados Detectados:");
        console.log(JSON.parse(jsonMatch[1].trim()));
    } else {
        console.log("\n⚠️ No se detectó bloque [RES_JSON].");
    }

  } catch (error) {
    console.error("❌ Error en la prueba:", error);
  }
}

testAI();
