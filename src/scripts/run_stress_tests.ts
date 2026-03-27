import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { buildOrchestratorGraph } from "../lib/agents/orchestratorGraph";
import { HumanMessage } from "@langchain/core/messages";

const STRESS_SCENARIOS = [
  {
    id: "ST-001 (Cyber/EDAC)",
    query: "Mi sistema EDAC está operando sobre una RTU legacy sin cifrado DNP3 SA v5. ¿Qué riesgos NERC CIP críticos identificas y qué multa SEC aproximada aplicaría si esto causa un deslastre erróneo por inyección de tráfico malicioso?"
  },
  {
    id: "ST-002 (BESS/SSCC)",
    query: "Tengo un BESS de 20MW con latencia SITR de 4.5s y jitter en GPS de 200us. ¿Puedo calificar para control de frecuencia (CPF) y cuál es el riesgo de remuneración si el CEN detecta la falta de sincronismo fasorial?"
  },
  {
    id: "ST-003 (Gen/SITR)",
    query: "Mi planta PMGD de 12MW perdió su enlace secundario de comunicaciones por 48 horas. El enlace primario sigue activo pero con pérdida de paquetes del 5%. ¿Hay riesgo de suspensión de despacho según la NTSyCS 2025 y qué plazo tengo para informar?"
  }
];

async function runStressTests() {
  const app = buildOrchestratorGraph();
  console.log("🔥 INICIANDO PRUEBAS DE ESTRÉS - NORMATAIVACEN SaaS 🔥\n");

  for (const scenario of STRESS_SCENARIOS) {
    console.log(`[${scenario.id}] 👤 CONSULTA: ${scenario.query}\n`);
    
    const state = {
      messages: [new HumanMessage(scenario.query)],
      userProfile: { coordinadoType: "test_stress", company: "Industrial Stress Inc." }
    };

    try {
      const result = await app.invoke(state) as { messages: any[], next_node: string };
      const lastMsg = result.messages[result.messages.length - 1];
      console.log(`🤖 AGENTE RESPONSABLE: ${result.next_node}`);
      console.log("--------------------------------------------------");
      console.log(lastMsg.content);
      console.log("--------------------------------------------------\n");
    } catch (err: any) {
      console.error(`❌ Error en escenario ${scenario.id}:`, err.message);
    }
  }
}

runStressTests();
