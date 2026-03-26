import { config } from 'dotenv';
config({ path: '.env.local' });

import { buildOrchestratorGraph } from '../lib/agents/orchestratorGraph';
import { HumanMessage } from '@langchain/core/messages';

async function main() {
  console.log("⚙️  Iniciando Grafo LangGraph...");
  const app = buildOrchestratorGraph();
  
  const initialState = {
    messages: [new HumanMessage("¿Cuál es el tiempo exigido para la operación de un relé EDAC y qué implicaciones tiene fallar en este margen?")],
    userProfile: {
      tipo: "Generación BESS",
      potencia: "50MW",
      nivelTension: "110kV"
    }
  };

  console.log("🚀 Enviando consulta al Orquestador...");
  const finalState = await app.invoke(initialState);
  
  const agentMessages = (finalState as any).messages;
  const fullContent = agentMessages[agentMessages.length - 1].content;
  
  console.log("\\n=== 📄 RAW LLM OUTPUT ===");
  console.log(fullContent);
  console.log("===========================\\n");
}

main().catch(console.error);
