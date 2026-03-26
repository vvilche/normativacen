import { NextResponse } from 'next/server';
import { buildOrchestratorGraph } from '../../../lib/agents/orchestratorGraph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { generateTechnicalReport } from '../../../lib/reportingEngine';
import { resetConnectionStatus } from '../../../lib/rag/mongoClient';

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
    resetConnectionStatus();
    const body = await req.json();
    const { messages, userProfile } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Error: El historial de mensajes es inválido o no se proporcionó.');
      return NextResponse.json({ error: 'El historial de mensajes es inválido' }, { status: 400 });
    }

    if (!userProfile || typeof userProfile !== 'object') {
      console.error('❌ Error: El perfil de usuario es inválido o no se proporcionó.');
      return NextResponse.json({ error: 'El perfil de usuario es inválido' }, { status: 400 });
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
    const fullContent = agentMessages[agentMessages.length - 1].content;
    
    const sources = ["Base RAG CEN", "Norma Técnica Resumen"];
    // El agentType lo tomamos del next_node del estado final
    const agentType = (finalState as any).next_node || "sitrAgent";
    
    // Extracción de metadatos estructurados
    let metricsJson = null;
    let hallazgo = null;
    let seoTags = null;
    let cleanContent = fullContent;
    
    // Parseo [METRICS_JSON]
    // Parseo [METRICS_JSON] - Más robusto (soporta etiquetas sin cierre o mal formadas)
    const metricsMatch = fullContent.match(/\[METRICS_JSON\]([\s\S]*?)(\[\/METRICS_JSON\]|$)/);
    if (metricsMatch && metricsMatch[1].trim()) {
      try {
        metricsJson = JSON.parse(metricsMatch[1].trim());
        cleanContent = cleanContent.replace(metricsMatch[0], '');
      } catch (e) {
        console.warn('⚠️ Error al parsear METRICS_JSON (formato inválido):', e);
      }
    }

    // Parseo [HALLAZGO_HIGHLIGHT]
    const hallazgoMatch = fullContent.match(/\[HALLAZGO_HIGHLIGHT\]([\s\S]*?)(\[\/HALLAZGO_HIGHLIGHT\]|$)/);
    if (hallazgoMatch && hallazgoMatch[1].trim()) {
      hallazgo = hallazgoMatch[1].trim();
      cleanContent = cleanContent.replace(hallazgoMatch[0], '');
    }

    // Parseo [SEO_TAGS]
    const seoMatch = fullContent.match(/\[SEO_TAGS\]([\s\S]*?)(\[\/SEO_TAGS\]|$)/);
    if (seoMatch && seoMatch[1].trim()) {
      seoTags = seoMatch[1].trim().split(',').map((tag: string) => tag.trim());
      cleanContent = cleanContent.replace(seoMatch[0], '');
    }

    cleanContent = cleanContent.trim();

    // 3. Generar Reporte Técnico (Valor Agregado)
    const technicalReport = generateTechnicalReport(
      { content: cleanContent, metrics: metricsJson, hallazgo, seoTags },
      agentType,
      userProfile || {}
    );

    console.log(`✅ Respuesta exitosa: ${agentType} | Metrics: ${!!metricsJson}`);

    return NextResponse.json({
      role: 'assistant',
      content: cleanContent,
      sources,
      resolution: technicalReport, 
      hallazgo,
      seoTags,
      agentType,
      isClosedLoop: true
    });

  } catch (error: any) {
    console.error('❌ Error crítico en API Route:', error);
    return NextResponse.json({ 
      error: 'Error procesando la solicitud del agente',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}
