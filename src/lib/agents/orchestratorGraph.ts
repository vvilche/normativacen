import { StateGraph, END, START } from "@langchain/langgraph";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  QUALITY_AUDITOR_PROMPT,
  ORCHESTRATOR_SYSTEM_PROMPT,
  SITR_AGENT_PROMPT,
  CONSUMO_AGENT_PROMPT as EDAC_AGENT_PROMPT,
  SSCC_AGENT_PROMPT,
  BESS_AGENT_PROMPT,
  CIBERSEG_AGENT_PROMPT,
  PROCEDIMENTAL_AGENT_PROMPT,
  GENERACION_AGENT_PROMPT,
  TRANSMISION_AGENT_PROMPT
} from "./prompts";
import { getRetriever } from "../rag/retriever";

/**
 * ==========================================
 * ESTADO DEL GRAFO (Context Engineering)
 * ==========================================
 */
export interface AgentState {
  messages: BaseMessage[];
  userProfile: any;
  next_node?: string;
  contextText?: string; // New: Share RAG context with Auditor
  draftResponse?: string; // New: Hold agent draft for revision
}

// -------------------------------------------------------
// LLM HELPER - Usando LangChain ChatGoogleGenerativeAI
// -------------------------------------------------------
const MODEL_ID = "gemini-2.5-flash";

async function callGemini(systemPrompt: string, userMessages: BaseMessage[], contextText?: string): Promise<string> {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_ID,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const finalSystemPrompt = contextText 
    ? `${systemPrompt}\n\n[CONTEXTO NORMATIVO]:\n${contextText}`
    : systemPrompt;

  const response = await model.invoke([
    { role: "system", content: finalSystemPrompt },
    ...userMessages
  ]);

  return typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
}

// -------------------------------------------------------
// ROUTER LLM - Clasificador semántico de intención
// -------------------------------------------------------
const ROUTER_SYSTEM_PROMPT = `Eres un clasificador de intenciones para un sistema de cumplimiento normativo (NormativaCEN).
Tu ÚNICA tarea es identificar cuál de los 8 agentes especializados es el adecuado.
Responde con EXACTAMENTE UNO de estos códigos:
SITR | CONSUMO | SSCC | BESS | CIBERSEG | PROCEDIMENTAL | GENERACION | TRANSMISION

Guía de clasificación:
- SITR: telecomunicaciones, latencia, GPS, protocolos (DNP3, ICCP, 104), SCADA.
- CONSUMO: Clientes Libres, EDAC, calidad de potencia, armónicos, relés de frecuencia.
- SSCC: servicios complementarios, CPF, CSF, habilitación, pagos SSCC.
- BESS: baterías, almacenamiento, GFM, grid-forming, inercia.
- CIBERSEG: NERC CIP, auditoría, firewalls, seguridad OT, accesos.
- PROCEDIMENTAL: trámites CEN, plazos SEC, auditorías administrativas, PES.
- GENERACION: centrales >= 9MW, PMGD, EDAG, ERAG, despacho.
- TRANSMISION: subestaciones, STN, PDC, visibilidad de red.

Responde SOLO el código.`;

async function orchestratorRouter(state: AgentState): Promise<Partial<AgentState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const query = typeof lastMessage.content === "string" ? lastMessage.content : "";

  try {
    const model = new ChatGoogleGenerativeAI({
      model: MODEL_ID,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const response = await model.invoke([
      { role: "system", content: ROUTER_SYSTEM_PROMPT },
      { role: "user", content: query }
    ]);

    const routeCode = (typeof response.content === 'string' ? response.content : "").trim().toUpperCase();
    
    // Extraer solo la palabra clave si el LLM responde con más texto por error
    const match = routeCode.match(/(SITR|CONSUMO|SSCC|BESS|CIBERSEG|PROCEDIMENTAL|GENERACION|TRANSMISION)/);
    const validatedCode = match ? match[1] : "SITR";

    const next_node = `${validatedCode.toLowerCase()}Agent`;
    console.log(`🔀 Router LLM → ${next_node}`);
    return { next_node };
  } catch (err) {
    console.warn("⚠️ Router LLM falló, usando fallback SITR:", err);
    return { next_node: "sitrAgent" };
  }
}

// -------------------------------------------------------
// HELPER: Nodo de agente genérico con RAG
// -------------------------------------------------------
async function createAgentNode(systemPrompt: string, state: AgentState, agentTypeName: string): Promise<Partial<AgentState>> {
  let contextText = "No se pudo recuperar contexto normativo adicional.";
  try {
    const retriever = await getRetriever();
    const lastUserMsg = state.messages[state.messages.length - 1].content as string;
    // @ts-ignore
    const docs = await retriever.invoke(lastUserMsg);
    if (docs && docs.length > 0) {
      contextText = docs.map((d: any) => d.pageContent).join("\n\n");
    }
  } catch (error) {
    console.warn(`⚠️ Fallo en RAG Retrieval para ${agentTypeName}:`, error);
  }

  const profileContext = "\n\nPerfil del Coordinado: " + JSON.stringify(state.userProfile);
  const fullPrompt = systemPrompt + profileContext;

  const draftResponse = await callGemini(fullPrompt, state.messages, contextText);
  
  // Guardamos contexto y borrador para el Auditor
  return { 
    contextText, 
    draftResponse 
  };
}

// -------------------------------------------------------
// NODOS DE AGENTES (8 agentes)
// -------------------------------------------------------
const sitrAgentNode = (s: AgentState) => createAgentNode(SITR_AGENT_PROMPT, s, "sitrAgent");
const consumoAgentNode = (s: AgentState) => createAgentNode(EDAC_AGENT_PROMPT, s, "consumoAgent");
const ssccAgentNode = (s: AgentState) => createAgentNode(SSCC_AGENT_PROMPT, s, "ssccAgent");
const bessAgentNode = (s: AgentState) => createAgentNode(BESS_AGENT_PROMPT, s, "bessAgent");
const cibersegAgentNode = (s: AgentState) => createAgentNode(CIBERSEG_AGENT_PROMPT, s, "cibersegAgent");
const procedimentalAgentNode = (s: AgentState) => createAgentNode(PROCEDIMENTAL_AGENT_PROMPT, s, "procedimentalAgent");
const generacionAgentNode = (s: AgentState) => createAgentNode(GENERACION_AGENT_PROMPT, s, "generacionAgent");
const transmisionAgentNode = (s: AgentState) => createAgentNode(TRANSMISION_AGENT_PROMPT, s, "transmisionAgent");

// -------------------------------------------------------
// NODO: Auditoría de Calidad (Antialucinación)
// -------------------------------------------------------
async function qualityAuditorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("🛡️ Quality Auditor → Validando integridad técnica...");
  
  const auditorInput = [
    new HumanMessage(`REVISA ESTE BORRADOR:\n\n${state.draftResponse}`)
  ];

  const finalResponse = await callGemini(QUALITY_AUDITOR_PROMPT, auditorInput, state.contextText);
  
  return { 
    messages: [new AIMessage(finalResponse)]
  };
}

// -------------------------------------------------------
// COMPILACIÓN DEL GRAFO
// -------------------------------------------------------
export function buildOrchestratorGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        //@ts-ignore
        value: (prev, next) => prev.concat(next),
        default: () => [],
      },
      userProfile: {
        //@ts-ignore
        value: (prev, next) => next || prev,
        default: () => ({}),
      },
      next_node: {
        //@ts-ignore
        value: (prev, next) => next || prev,
        default: () => "sitrAgent",
      },
      contextText: {
        //@ts-ignore
        value: (prev, next) => next || prev,
        default: () => "",
      },
      draftResponse: {
        //@ts-ignore
        value: (prev, next) => next || prev,
        default: () => "",
      },
    },
  })
  // @ts-ignore
  .addNode("router", orchestratorRouter)
  // @ts-ignore
  .addNode("sitrAgent", sitrAgentNode)
  // @ts-ignore
  .addNode("consumoAgent", consumoAgentNode)
  // @ts-ignore
  .addNode("ssccAgent", ssccAgentNode)
  // @ts-ignore
  .addNode("bessAgent", bessAgentNode)
  // @ts-ignore
  .addNode("cibersegAgent", cibersegAgentNode)
  .addNode("procedimentalAgent", procedimentalAgentNode)
  // @ts-ignore
  .addNode("generacionAgent", generacionAgentNode)
  // @ts-ignore
  .addNode("transmisionAgent", transmisionAgentNode)
  // @ts-ignore
  .addNode("qualityAuditor", qualityAuditorNode)
  // @ts-ignore
  .addEdge(START, "router")
  // @ts-ignore
  .addConditionalEdges("router",
    (state: AgentState) => state.next_node || "sitrAgent",
    {
      sitrAgent: "sitrAgent",
      consumoAgent: "consumoAgent",
      ssccAgent: "ssccAgent",
      bessAgent: "bessAgent",
      cibersegAgent: "cibersegAgent",
      procedimentalAgent: "procedimentalAgent",
      generacionAgent: "generacionAgent",
      transmisionAgent: "transmisionAgent",
    }
  )
  // @ts-ignore
  .addEdge("sitrAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("consumoAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("ssccAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("bessAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("cibersegAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("procedimentalAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("generacionAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("transmisionAgent", "qualityAuditor")
  // @ts-ignore
  .addEdge("qualityAuditor", END);

  return workflow.compile();
}
