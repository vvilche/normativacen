import { MongoClient, Document } from "mongodb";
import clientPromise, { getConnectionStatus, setConnectionFailed } from "./mongoClient";

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

export async function getRetriever() {
  if (getConnectionStatus()) {
    console.log("💡 [MOCK RAG] Saltando intento de conexión (fallo previo registrado).");
    return createMockRetriever();
  }

  let client: MongoClient;
  try {
    // Timeout de 5s para no bloquear el orquestador si MongoDB es inalcanzable
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout conectando a MongoDB")), 5000)
    );
    client = await Promise.race([clientPromise, timeoutPromise]);
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
        /* eslint-disable @typescript-eslint/no-explicit-any */
        // Opción 1: Búsqueda por Texto de MongoDB ($text)
        const cursor = collection.find(
          { $text: { $search: query } } as any,
          { score: { $meta: "textScore" } } as any
        ).sort({ score: { $meta: "textScore" } } as any).limit(3);

        const results = await cursor.toArray();
        
        // Opción 2: Fallback a Regex si no hay resultados por $text
        if (results.length === 0) {
          console.log("💡 Fallback a Regex search...");
          
          // Escapar caracteres especiales para el regex
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          const regexResults = await collection.find({
            $or: [
              { text: { $regex: escapedQuery, $options: "i" } },
              { topic: { $regex: escapedQuery, $options: "i" } }
            ]
          } as any).limit(3).toArray();
          /* eslint-enable @typescript-eslint/no-explicit-any */
          
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
