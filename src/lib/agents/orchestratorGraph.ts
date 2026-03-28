import { StateGraph, END, START } from "@langchain/langgraph";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  QUALITY_AUDITOR_PROMPT,
  SITR_AGENT_PROMPT,
  CONSUMO_AGENT_PROMPT as EDAC_AGENT_PROMPT,
  SSCC_AGENT_PROMPT,
  BESS_AGENT_PROMPT,
  CIBERSEG_AGENT_PROMPT,
  PROCEDIMENTAL_AGENT_PROMPT,
  GENERACION_AGENT_PROMPT,
  TRANSMISION_AGENT_PROMPT,
  INFOTECNICA_AGENT_PROMPT
} from "./prompts";
import { getRetriever } from "../rag/retriever";

/**
 * ==========================================
 * ESTADO DEL GRAFO (Context Engineering)
 * ==========================================
 */
export interface AgentState {
  messages: BaseMessage[];
  userProfile: { company?: string; [key: string]: unknown } | null;
  next_node?: string;
  contextText?: string;
  draftResponse?: string;
  revisionCount?: number; // Tracker for self-correction loops
  lastAgentNode?: string; // Remember which agent drafted the response
}

// -------------------------------------------------------
// LLM HELPER - Usando LangChain ChatGoogleGenerativeAI
// -------------------------------------------------------
const MODEL_ID = "gemini-2.5-flash";

async function callGemini(systemPrompt: string, userMessages: BaseMessage[], contextText?: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY_MISSING: No se detectó la clave de API de Google en el entorno. Configúrala en el panel de Netlify.");
  }

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
Tu ÚNICA tarea es identificar cuál de los 9 agentes especializados es el adecuado.
Responde con EXACTAMENTE UNO de estos códigos:
SITR | CONSUMO | SSCC | BESS | CIBERSEG | PROCEDIMENTAL | GENERACION | TRANSMISION | INFOTECNICA

Guía de clasificación:
- SITR: telecomunicaciones, latencia, GPS, protocolos (DNP3, ICCP, 104), SCADA.
- CONSUMO: Clientes Libres, EDAC, calidad de potencia, armónicos, relés de frecuencia.
- SSCC: servicios complementarios, CPF, CSF, habilitación, pagos SSCC.
- BESS: baterías, almacenamiento, GFM, grid-forming, inercia.
- CIBERSEG: NERC CIP, auditoría, firewalls, seguridad OT, accesos.
- PROCEDIMENTAL: trámites CEN, plazos SEC, auditorías administrativas, PES.
- GENERACION: centrales >= 9MW, PMGD, EDAG, ERAG, despacho.
- TRANSMISION: subestaciones, STN, PDC, visibilidad de red.
- INFOTECNICA: fichas técnicas, parámetros eléctricos, impedancia, ampacidad, datos de placa, instalaciones específicas por nombre.

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
    const match = routeCode.match(/(SITR|CONSUMO|SSCC|BESS|CIBERSEG|PROCEDIMENTAL|GENERACION|TRANSMISION|INFOTECNICA)/);
    const validatedCode = match ? match[1] : "SITR";

    const next_node = `${validatedCode.toLowerCase()}Agent`;
    console.log(`🔀 Router LLM → ${next_node}`);
    return { next_node, lastAgentNode: next_node };
  } catch (err) {
    console.warn("⚠️ Router LLM falló, usando fallback SITR:", err);
    return { next_node: "sitrAgent", lastAgentNode: "sitrAgent" };
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
        const docs = await retriever.invoke(lastUserMsg);
    if (docs && docs.length > 0) {
      contextText = docs.map((d: { pageContent: string }) => d.pageContent).join("\n\n");
    }
  } catch (error) {
    console.warn(`⚠️ Fallo en RAG Retrieval para ${agentTypeName}:`, error);
  }

  const profileContext = "\n\nPerfil del Coordinado: " + JSON.stringify(state.userProfile);
  
  // Si esto es un re-intento, incluimos las observaciones del auditor en el prompt
  const isRetry = (state.revisionCount || 0) > 0;
  const retryInstructions = isRetry 
    ? `\n\n[INSTRUCCIÓN DE REVISIÓN]: Tu respuesta preliminar fue rechazada por falta de detalle técnico. 
       OBSERVACIONES: ${state.messages[state.messages.length - 1].content}`
    : "";

  const fullPrompt = systemPrompt + profileContext + retryInstructions;

  const draftResponse = await callGemini(fullPrompt, state.messages, contextText);
  
  return { 
    contextText, 
    draftResponse,
    lastAgentNode: agentTypeName // Guardar quién hizo el último borrador
  };
}

// -------------------------------------------------------
// NODOS DE AGENTES (9 agentes especializados)
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
// NODO ESPECIALIZADO: InfoTécnica (CEN API Integration)
// -------------------------------------------------------
async function infotecnicaAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const query = typeof lastMessage.content === "string" ? lastMessage.content : "";
  
  let techContext = "";
  
  try {
    // Intento de búsqueda proactiva en la API de InfoTécnica
    // Ejemplo: buscar subestaciones si la query parece referirse a una
    const typesToSearch = ["subestaciones", "centrales", "lineas"];
    for (const type of typesToSearch) {
      if (query.toLowerCase().includes(type.slice(0, -1))) {
         const response = await fetch(`https://api-infotecnica.coordinador.cl/v1/${type}/?search=${encodeURIComponent(query)}&format=json`);
         if (response.ok) {
           const data = await response.json();
           const results = Array.isArray(data) ? data : data.results || [];
           if (results.length > 0) {
             techContext += `\n[RESULTADOS EN TIEMPO REAL INFO-TÉCNICA - ${type.toUpperCase()}]:\n${JSON.stringify(results.slice(0, 3), null, 2)}`;
             break;
           }
         }
      }
    }
  } catch (err) {
    console.warn("⚠️ API InfoTécnica no disponible:", err);
  }

  const result = await createAgentNode(INFOTECNICA_AGENT_PROMPT, state, "infotecnicaAgent");
  return {
    ...result,
    contextText: (result.contextText || "") + techContext
  };
}

// -------------------------------------------------------
// NODO: Auditoría de Calidad (Antialucinación)
// -------------------------------------------------------
async function qualityAuditorNode(state: AgentState): Promise<Partial<AgentState>> {
  const currentRevision = state.revisionCount || 0;
  console.log(`🛡️ Quality Auditor → Validando integridad técnica (Revisión #${currentRevision + 1})...`);
  
  const auditorInput = [
    new HumanMessage(`REVISA ESTE BORRADOR:\n\n${state.draftResponse}`)
  ];

  const feedback = await callGemini(QUALITY_AUDITOR_PROMPT, auditorInput, state.contextText);
  
  // Check for REJECTION logic (Limit to 1 revision to prevent timeouts on Netlify)
  if (feedback.includes('[RECHAZADO]') && currentRevision < 1) {
    console.log("❌ Auditoría FALLIDA. Solicitando re-elaboración al especialista...");
    return {
      messages: [new AIMessage(feedback)],
      revisionCount: currentRevision + 1,
      next_node: state.lastAgentNode // Enviar de vuelta al agente que falló
    };
  }

  // Si pasa o alcanzó el límite de reintentos
  console.log("✅ Auditoría APROBADA (o límite de revisiones alcanzado).");
  return { 
    messages: [new AIMessage(feedback)],
    next_node: "end" 
  };
}

// -------------------------------------------------------
// COMPILACIÓN DEL GRAFO
// -------------------------------------------------------
export function buildOrchestratorGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
                value: (prev, next) => prev.concat(next),
        default: () => [],
      },
      userProfile: {
                value: (prev, next) => next || prev,
        default: () => ({}),
      },
      next_node: {
                value: (prev, next) => next || prev,
        default: () => "sitrAgent",
      },
      contextText: {
                value: (prev, next) => next || prev,
        default: () => "",
      },
      draftResponse: {
                value: (prev, next) => next || prev,
        default: () => "",
      },
      revisionCount: {
                value: (prev, next) => next || prev,
        default: () => 0,
      },
      lastAgentNode: {
                value: (prev, next) => next || prev,
        default: () => "",
      },
    },
  })
    .addNode("router", orchestratorRouter)
    .addNode("sitrAgent", sitrAgentNode)
    .addNode("consumoAgent", consumoAgentNode)
    .addNode("ssccAgent", ssccAgentNode)
    .addNode("bessAgent", bessAgentNode)
    .addNode("cibersegAgent", cibersegAgentNode)
  .addNode("procedimentalAgent", procedimentalAgentNode)
    .addNode("generacionAgent", generacionAgentNode)
    .addNode("transmisionAgent", transmisionAgentNode)
    .addNode("infotecnicaAgent", infotecnicaAgentNode)
    .addNode("qualityAuditor", qualityAuditorNode)
    .addEdge(START, "router")
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
      infotecnicaAgent: "infotecnicaAgent",
    }
  )
    .addEdge("sitrAgent", "qualityAuditor")
    .addEdge("consumoAgent", "qualityAuditor")
    .addEdge("ssccAgent", "qualityAuditor")
    .addEdge("bessAgent", "qualityAuditor")
    .addEdge("cibersegAgent", "qualityAuditor")
    .addEdge("procedimentalAgent", "qualityAuditor")
    .addEdge("generacionAgent", "qualityAuditor")
    .addEdge("transmisionAgent", "qualityAuditor")
    .addEdge("infotecnicaAgent", "qualityAuditor")
    .addConditionalEdges("qualityAuditor",
    (state: AgentState) => state.next_node === "end" ? END : (state.next_node || END),
    {
      sitrAgent: "sitrAgent",
      consumoAgent: "consumoAgent",
      ssccAgent: "ssccAgent",
      bessAgent: "bessAgent",
      cibersegAgent: "cibersegAgent",
      procedimentalAgent: "procedimentalAgent",
      generacionAgent: "generacionAgent",
      transmisionAgent: "transmisionAgent",
      infotecnicaAgent: "infotecnicaAgent",
      [END]: END
    }
  );

  return workflow.compile();
}
