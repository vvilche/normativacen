import { NextResponse } from 'next/server';
import { buildOrchestratorGraph } from '../../../lib/agents/orchestratorGraph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

/**
 * ==========================================
 * API ROUTE: Agente Orquestador (LangGraph)
 * ==========================================
 *
 * Endpoint que recibe la conversación desde el Frontend y el perfil
 * (Asset Profiler / Context Engineering) del Coordinado para derivar
 * las peticiones al Agente RAG correspondiente (SITR, EDAC, etc.).
 */

// Force dynamic execution for API routes
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userProfile } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

    // Convertir mensajes de frontend a LangChain Messages
    const lcMessages = messages.map((m: any) => 
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

    // 1. Initializar el Grafo Multi-Agente
    const app = buildOrchestratorGraph();

    /**
     * AQUÍ SE INICIALIZARÁ LANGGRAPH:
     * 1. StateGraph: Recibe el historial.
     * 2. Orchestrator Node: Lee el userProfile (Sector, Marca de equipo) y el último mensaje,
     *    y decide si enruta al Agente SITR, al Agente EDAC, o responde generalidades.
     * 3. Specialist Node: Corre la consulta en la Base Vectorial (Pinecone).
     *    - Pilar de Harness Engineering: Aplica Architectural Constraints (Linters de Prompts).
     * 4. RAG Retrieval: Extrae *chunks* oficiales del CEN.
     *    - Pilar de Harness Engineering: Entropy Management (verificará vigencia temporal).
     */

    // 2. Invocar LangGraph con el Estado Inicial (Context Engineering)
    const initialState = {
      messages: lcMessages,
      userProfile: userProfile || {}
    };

    const finalState = await app.invoke(initialState);
    
    // Obtener la respuesta generada por el último nodo (SITR, EDAC, o General)
    const agentMessages = (finalState as any).messages;
    const agentResponse = agentMessages[agentMessages.length - 1].content;
    const sources = ["Base RAG CEN", "Norma Técnica Resumen"];
    const isClosedLoop = true; // Activar el Lazo Cerrado (Feedback flow)

    return NextResponse.json({
      role: 'assistant',
      content: agentResponse,
      sources,
      isClosedLoop
    });

  } catch (error: any) {
    console.error('❌ Error en el Orquestador:', error);
    return NextResponse.json({ 
      error: 'Error procesando la solicitud del agente',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}
