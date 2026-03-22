import clientPromise from "./mongoClient";

/**
 * ==========================================
 * RAG RETRIEVER (MongoDB Text Search)
 * ==========================================
 * Versión estabilizada: Utiliza búsqueda por texto de MongoDB 
 * para evitar depender de modelos de embeddings externos (Error 404).
 */

export async function getRetriever() {
  const client = await clientPromise;
  const collection = client.db("normativacen").collection("knowledge_base");

  // Implementamos una interfaz similar a la de LangChain para no romper el orquestador
  return {
    invoke: async (query: string) => {
      console.log(`🔍 Buscando contexto para: "${query}"...`);
      
      try {
        // Opción 1: Búsqueda por Texto de MongoDB ($text)
        // Requiere un índice de texto creado en el seed
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
