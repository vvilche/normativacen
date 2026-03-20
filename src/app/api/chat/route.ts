import { NextResponse } from 'next/server';

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

    const lastMessage = messages[messages.length - 1]?.content || "";
    
    // MOCK RESPONSE PARA EL PROTOTIPO (Hasta conectar Pinecone/LLM real)
    let agentResponse = "Estoy consultando la base de datos oficial del CEN...";
    let sources: string[] = [];
    let isClosedLoop = false;

    // Lógica determinista simulada (Mock Router)
    const query = lastMessage.toLowerCase();
    
    if (query.includes("sitr") || query.includes("telemetría") || query.includes("telemetria")) {
      agentResponse = `Entiendo tu requerimiento sobre la telemetría, ${userProfile?.name?.split(' ')[0] || 'coordinado'}. Según el Anexo de Comunicaciones de la NTSyCS vigente para instalaciones de ${userProfile?.coordinadoType}, tu ancho de banda debe ser mínimo 128 kbps con latencias inferiores a 500ms hacia el CEN.`;
      sources = ["NTSyCS Anexo de Comunicaciones", "Estándar Técnico SITR v2025"];
      isClosedLoop = true;
    } else if (query.includes("edac") || query.includes("edag") || query.includes("relé") || query.includes("rele") || query.includes("desconexión")) {
      agentResponse = "Respecto a tus tiempos de desconexión EDAC: debes asegurar que toda la cadena (desde la detección de baja frecuencia hasta la apertura del interruptor) opere en un máximo de 200 milisegundos.";
      sources = ["NTSyCS Capítulo 4", "Resolución Exenta N° 123 (Régimen de Frecuencia)"];
      isClosedLoop = true;
    } else {
      agentResponse = `Hola. Gracias por utilizar ConectaCompliance. Veo que perteneces al sector ${userProfile?.coordinadoType}. Para darte una respuesta certera, por favor especifica si tu duda es técnica (EDAC, SITR) o comercial (Mercado de Corto Plazo).`;
    }

    // Simulando latencia del LLM
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      role: 'assistant',
      content: agentResponse,
      sources,
      isClosedLoop
    });

  } catch (error) {
    console.error('Error en el Orquestador:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud del agente' }, { status: 500 });
  }
}
