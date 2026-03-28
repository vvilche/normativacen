import { NextResponse } from 'next/server';
import { buildOrchestratorGraph } from '../../../lib/agents/orchestratorGraph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { generateTechnicalReport } from '../../../lib/reportingEngine';
import clientPromise, { resetConnectionStatus } from '../../../lib/rag/mongoClient';
import crypto from 'crypto';
import type { Collection, Document } from 'mongodb';

type CachePayload = {
  role: string;
  content: string;
  sources: string[];
  resolution: unknown;
  hallazgo: string | null;
  seoTags: string[] | null;
  agentType: string;
  isClosedLoop: boolean;
};

const MEMORY_CACHE_TTL = 1000 * 60 * 10; // 10 minutos
const memoryCache = new Map<string, { expires: number; payload: CachePayload }>();

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

    const lcMessages = messages.map((m: any) => 
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

    const userQuery = messages.filter((m: any) => m.role === 'user').pop()?.content || "";
    const normalizedQuery = userQuery.trim().toLowerCase();
    const queryHash = crypto.createHash('md5').update(normalizedQuery).digest('hex');

    // 0. Verificar Caché (Repositorio de Resoluciones)
    let cacheCollection: Collection<Document> | null = null;
    try {
      const client = await clientPromise();
      cacheCollection = client.db("normativacen").collection("technical_resolutions");
    } catch (dbErr) {
      console.warn('⚠️ MongoDB no disponible para caché persistente:', dbErr);
    }

    const cacheEntry = memoryCache.get(queryHash);
    if (cacheEntry && cacheEntry.expires > Date.now()) {
      console.log(`🚀 [CACHE HIT - MEM] Sirviendo resolución desde memoria: ${queryHash}`);
      return NextResponse.json({
        ...cacheEntry.payload,
        isCached: true
      });
    }

    if (cacheCollection) {
      const cachedResult = await cacheCollection.findOne({ queryHash });
      if (cachedResult) {
        console.log(`🚀 [CACHE HIT] Sirviendo resolución desde el repositorio para hash: ${queryHash}`);
        memoryCache.set(queryHash, { expires: Date.now() + MEMORY_CACHE_TTL, payload: cachedResult.payload });
        return NextResponse.json({
          ...cachedResult.payload,
          isCached: true
        });
      }
    }

    console.log(`⚙️ [CACHE MISS] Iniciando orquestador para: "${userQuery.substring(0, 50)}..."`);

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

    const responsePayload: CachePayload = {
      role: 'assistant',
      content: cleanContent,
      sources,
      resolution: technicalReport, 
      hallazgo,
      seoTags,
      agentType,
      isClosedLoop: true
    };

    // 4. Persistir en el Repositorio de Resoluciones (Caché)
    try {
      if (cacheCollection) {
        await cacheCollection.updateOne(
          { queryHash },
          { 
            $set: { 
              queryHash,
              originalQuery: normalizedQuery,
              payload: responsePayload,
              createdAt: new Date()
            } 
          },
          { upsert: true }
        );
        console.log(`💾 [CACHE STORE] Resolución guardada en el repositorio: ${queryHash}`);
      }
    } catch (cacheErr) {
      console.warn('⚠️ Error guardando en caché:', cacheErr);
    }

    memoryCache.set(queryHash, {
      expires: Date.now() + MEMORY_CACHE_TTL,
      payload: responsePayload
    });

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('❌ Error crítico en API Route:', error);
    return NextResponse.json({ 
      error: 'Error procesando la solicitud del agente',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}
