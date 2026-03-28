import { MongoClient, Document, Filter } from "mongodb";
import clientPromise, { getConnectionStatus, setConnectionFailed } from "./mongoClient";

const CONNECT_TIMEOUT = Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 12000);

interface RagDocument extends Document {
  text?: string;
  topic?: string;
  metadata?: Record<string, unknown>;
}

/**
 * ==========================================
 * RAG RETRIEVER (MongoDB Text Search)
 * ==========================================
 * Versión estabilizada: Utiliza búsqueda por texto de MongoDB 
 * para evitar depender de modelos de embeddings externos (Error 404).
 */

/**
 * Helper para crear un retriever simulado (Fallback)
 */
function createMockRetriever() {
  return {
    invoke: async (query: string) => {
      console.log("💡 [MOCK RAG] Generando contexto simulado para: " + query);
      return [
        { 
          pageContent: `[REFERENCIA SIMULADA]: Requisitos técnicos generales para ${query}. 
          Según estándares CEN 2025, se debe priorizar la latencia < 500ms y la ciberseguridad industrial.`, 
          metadata: { source: "Simulación de Contingencia" } 
        }
      ];
    }
  };
}

export async function getRetriever(agentType?: string) {
  if (getConnectionStatus()) {
    console.log("💡 [MOCK RAG] Saltando intento de conexión (fallo previo registrado).");
    return createMockRetriever();
  }

  let client: MongoClient;
  try {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Timeout conectando a MongoDB")), CONNECT_TIMEOUT);
    });
    client = await Promise.race([
      clientPromise().then((mongoClient) => {
        clearTimeout(timeoutId);
        return mongoClient;
      }),
      timeoutPromise,
    ]);
  } catch (err) {
    console.warn("⚠️ MongoDB inalcanzable, usando Retriever Simulado:", err);
    setConnectionFailed();
    return createMockRetriever();
  }

  const collection = client.db("normativacen").collection<RagDocument>("knowledge_base");

  // Implementamos una interfaz similar a la de LangChain para no romper el orquestador
  return {
    invoke: async (query: string) => {
      console.log(`🔍 Buscando contexto para: "${query}"...`);
      
      try {
        const buildFilter = (useAgentFilter: boolean): Filter<RagDocument> => {
          const filter: Filter<RagDocument> = { $text: { $search: query } } as Filter<RagDocument>;
          if (useAgentFilter && agentType) {
            filter["metadata.agentType"] = agentType;
          }
          return filter;
        };

        const runTextSearch = async (filter: Filter<RagDocument>) => {
          return collection
            .find(filter, { score: { $meta: "textScore" } } as any)
            .sort({ score: { $meta: "textScore" } } as any)
            .limit(3)
            .toArray();
        };

        let results = await runTextSearch(buildFilter(true));
        if (results.length === 0 && agentType) {
          results = await runTextSearch(buildFilter(false));
        }
        
        // Opción 2: Fallback a Regex si no hay resultados por $text
        if (results.length === 0) {
          console.log("💡 Fallback a Regex search...");
          
          // Escapar caracteres especiales para el regex
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          const buildRegexFilter = (useAgentFilter: boolean): Filter<RagDocument> => {
            const base: Filter<RagDocument> = {
              $or: [
                { text: { $regex: escapedQuery, $options: "i" } },
                { topic: { $regex: escapedQuery, $options: "i" } }
              ]
            };
            if (useAgentFilter && agentType) {
              (base as any)["metadata.agentType"] = agentType;
            }
            return base;
          };

          let regexResults = await collection.find(buildRegexFilter(true)).limit(3).toArray();
          if (regexResults.length === 0 && agentType) {
            regexResults = await collection.find(buildRegexFilter(false)).limit(3).toArray();
          }
          
          return regexResults.map((doc) => ({
            pageContent: doc.text || "",
            metadata: doc.metadata || {}
          }));
        }

        return results.map((doc) => ({
          pageContent: doc.text || "",
          metadata: doc.metadata || {}
        }));
      } catch (error) {
        console.error("❌ Error en Retriever:", error);
        return [];
      }
    }
  };
}
