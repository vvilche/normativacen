import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { ORCHESTRATOR_SYSTEM_PROMPT, SITR_AGENT_PROMPT, EDAC_AGENT_PROMPT } from "./prompts";
import { getRetriever } from "../rag/retriever";

/**
 * ==========================================
 * ESTADO DEL GRAFO (Context Engineering)
 * ==========================================
 * Define la memoria que viaja a través del sistema multi-agente.
 * Mantiene el historial de la conversación y el perfil estático del Coordinado.
 */
export interface AgentState {
  messages: BaseMessage[];
  userProfile: any;
  next_node?: string;
}

// ----------------------------------------------------
// 1. LLM INIT (Mocked without API key for safety initially)
// ----------------------------------------------------
const getLLM = () => {
    return new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0, 
      apiKey: process.env.GOOGLE_API_KEY,
    });
};

/**
 * ==========================================
 * NODOS DEL RAG (Nuestros Agentes Especializados)
 * ==========================================
 */

async function orchestratorRouter(state: AgentState): Promise<Partial<AgentState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const query = typeof lastMessage.content === 'string' ? lastMessage.content.toLowerCase() : "";
  
  // Router determinista (Harness Constraint) ó Router LLM.
  // Por simplicidad y rigidez arquitectónica, usamos ruteo semántico básico.
  if (query.includes("sitr") || query.includes("telemetría") || query.includes("telemetria")) {
    return { next_node: "sitrAgent" };
  }
  if (query.includes("edac") || query.includes("edag") || query.includes("relé") || query.includes("rele") || query.includes("desconexión")) {
    return { next_node: "edacAgent" };
  }
  return { next_node: "generalAgent" };
}

async function sitrAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getLLM();
  let contextText = "No se pudo recuperar contexto normativo adicional en tiempo real.";
  
  try {
    const retriever = await getRetriever();
    const lastUserMsg = state.messages[state.messages.length - 1].content as string;
    // @ts-ignore - Some versions of LangChain VectorStoreRetriever use invoke
    const docs = await retriever.invoke(lastUserMsg);
    if (docs && docs.length > 0) {
      contextText = docs.map((d: any) => d.pageContent).join("\\n\\n");
    }
  } catch (error) {
    console.warn("⚠️ Fallo en RAG Retrieval:", error);
  }

  const profileContext = "\\n\\nPerfil del Coordinado: " + JSON.stringify(state.userProfile);
  const ragContext = "\\n\\nCONTEXTO NORMATIVO RECUPERADO:\\n" + contextText;
  
  const systemMsg = new SystemMessage(SITR_AGENT_PROMPT + profileContext + ragContext);
  
  const response = await llm.invoke([systemMsg, ...state.messages]);
  return { messages: [response] };
}

async function edacAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getLLM();
  let contextText = "No se pudo recuperar contexto normativo adicional en tiempo real.";

  try {
    const retriever = await getRetriever();
    const lastUserMsg = state.messages[state.messages.length - 1].content as string;
    // @ts-ignore - Some versions of LangChain VectorStoreRetriever use invoke
    const docs = await retriever.invoke(lastUserMsg);
    if (docs && docs.length > 0) {
      contextText = docs.map((d: any) => d.pageContent).join("\\n\\n");
    }
  } catch (error) {
    console.warn("⚠️ Fallo en RAG Retrieval:", error);
  }

  const profileContext = "\\n\\nPerfil del Coordinado: " + JSON.stringify(state.userProfile);
  const ragContext = "\\n\\nCONTEXTO NORMATIVO RECUPERADO:\\n" + contextText;

  const systemMsg = new SystemMessage(EDAC_AGENT_PROMPT + profileContext + ragContext);

  const response = await llm.invoke([systemMsg, ...state.messages]);
  return { messages: [response] };
}

async function generalAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const context = "\\n\\nContexto del usuario (Asset Profiler): " + JSON.stringify(state.userProfile);
  const systemMsg = new SystemMessage(ORCHESTRATOR_SYSTEM_PROMPT + context);

  // Invocar LLM Real (Gemini 1.5 Pro)
  const response = await llm.invoke([systemMsg, ...state.messages]);
  return { messages: [response] };
}

/**
 * ==========================================
 * COMPILACIÓN DEL GRAFO (LangGraph)
 * ==========================================
 */
export function buildOrchestratorGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        value: (stateMessages, newMessages) => stateMessages.concat(newMessages),
        default: () => [],
      },
      userProfile: {
        value: (stateProfile, newProfile) => newProfile || stateProfile,
        default: () => ({}),
      },
      next_node: {
        value: (stateNode, newNode) => newNode || stateNode,
        default: () => "generalAgent",
      }
    }
  })
  // @ts-ignore - LangGraph type alignment
  .addNode("router", orchestratorRouter)
  // @ts-ignore
  .addNode("sitrAgent", sitrAgentNode)
  // @ts-ignore
  .addNode("edacAgent", edacAgentNode)
  // @ts-ignore
  .addNode("generalAgent", generalAgentNode)
  // @ts-ignore
  .addEdge(START, "router")
  // @ts-ignore
  .addConditionalEdges("router", 
    (state: AgentState) => state.next_node || "generalAgent",
    {
      "sitrAgent": "sitrAgent",
      "edacAgent": "edacAgent",
      "generalAgent": "generalAgent",
    }
  )
  // @ts-ignore
  .addEdge("sitrAgent", END)
  // @ts-ignore
  .addEdge("edacAgent", END)
  // @ts-ignore
  .addEdge("generalAgent", END);

  return workflow.compile();
}
