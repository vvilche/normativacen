import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { buildOrchestratorGraph } from "../lib/agents/orchestratorGraph";
import { HumanMessage } from "@langchain/core/messages";

async function testOrchestrator() {
  const app = buildOrchestratorGraph();
  
  const testQueries = [
    "Necesito validar la latencia de mi enlace SITR en una planta de 50MW",
    "¿Cuáles son los requisitos de NERC CIP para mi subestación?",
    "Mi BESS no está respondiendo a la frecuencia, ¿qué dice la norma?",
    "¿Cómo declaro mis activos PMGD para el despacho?",
  ];

  console.log("🚀 Iniciando Pruebas de Orquestador...\n");

  for (const query of testQueries) {
    console.log(`\n--- 👤 Consulta: "${query}" ---`);
    const state = {
      messages: [new HumanMessage(query)],
      userProfile: {
        coordinadoType: "generacion",
        company: "Test Energy",
        name: "Victor"
      }
    };

    try {
      const result = await app.invoke(state) as { messages: any[], next_node: string };
      const lastMsg = result.messages[result.messages.length - 1];
      console.log(`✅ Agente Destino: ${result.next_node}`);
      console.log(`📄 Respuesta (primeros 200 chars): ${lastMsg.content.substring(0, 200)}...`);
      
      // Verificar bloques Tung
      const hasMetrics = lastMsg.content.includes("[METRICS_JSON]");
      const hasHallazgo = lastMsg.content.includes("[HALLAZGO_HIGHLIGHT]");
      const hasSEO = lastMsg.content.includes("[SEO_TAGS]");
      
      console.log(`📊 Tung Check: Metrics: ${hasMetrics ? '✅' : '❌'} | Hallazgo: ${hasHallazgo ? '✅' : '❌'} | SEO: ${hasSEO ? '✅' : '❌'}`);
    } catch (err) {
      console.error(`❌ Error en query "${query}":`, err);
    }
  }
}

testOrchestrator();
