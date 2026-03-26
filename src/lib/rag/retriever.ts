import clientPromise, { getConnectionStatus, setConnectionFailed } from "./mongoClient";

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

  let client;
  try {
    // Timeout de 5s para no bloquear el orquestador si MongoDB es inalcanzable
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout conectando a MongoDB")), 5000)
    );
    client = await Promise.race([clientPromise, timeoutPromise]) as any;
  } catch (err) {
    console.warn("⚠️ MongoDB inalcanzable, usando Retriever Simulado:", err);
    setConnectionFailed();
    return createMockRetriever();
  }

  const collection = client.db("normativacen").collection("knowledge_base");

  // Implementamos una interfaz similar a la de LangChain para no romper el orquestador
  return {
    invoke: async (query: string) => {
      console.log(`🔍 Buscando contexto para: "${query}"...`);
      
      try {
        // Opción 1: Búsqueda por Texto de MongoDB ($text)
        const cursor = collection.find(
          { $text: { $search: query } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(3);

        const results = await cursor.toArray();
        
        // Opción 2: Fallback a Regex si no hay resultados por $text
        if (results.length === 0) {
          console.log("💡 Fallback a Regex search...");
          const regexResults = await collection.find({
            $or: [
              { text: { $regex: query, $options: "i" } },
              { topic: { $regex: query, $options: "i" } }
            ]
          }).limit(3).toArray();
          
          return regexResults.map(doc => ({
            pageContent: doc.text,
            metadata: doc.metadata
          }));
        }

        return results.map(doc => ({
          pageContent: doc.text,
          metadata: doc.metadata
        }));
      } catch (error) {
        console.error("❌ Error en Retriever:", error);
        return [];
      }
    }
  };
}
