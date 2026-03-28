const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const NORMATIVA_DATA = [
  {
    topic: "EDAC",
    text: "Los Esquemas de Desconexión de Carga (EDAC) del Sistema Eléctrico Nacional de Chile deben operar en un máximo de 200 milisegundos para asegurar la estabilidad de la red en contingencias extremas.",
    metadata: { source: "NTSyCS 2024, Art. 5.2", agentType: "consumoAgent" }
  },
  {
    topic: "SITR",
    text: "El estándar SITR (Sistema de Información de Tiempo Real) exige una disponibilidad del 99.8% mensual para los enlaces de comunicación entre los Coordinados y el CEN.",
    metadata: { source: "Anexo Técnico SITR v2.1", agentType: "sitrAgent" }
  },
  {
    topic: "SITR",
    text: "Las redundancias en subestaciones SITR deben contar con hardware duplicado y rutas de comunicación físicamente independientes hacia los centros de despacho.",
    metadata: { source: "NTSyCS, Cap. Comunicaciones", agentType: "sitrAgent" }
  },
  {
    topic: "General",
    text: "El Coordinador Eléctrico Nacional (CEN) es el organismo encargado de la operación del sistema eléctrico entre Arica y Chiloé.",
    metadata: { source: "Ley General de Servicios Eléctricos", agentType: "general" }
  }
];

async function seed() {
  console.log("🚀 Iniciando Seed de Texto (RAG Sin Vectores)...");
  
  if (!process.env.MONGODB_URI) {
    console.error("❌ Falta MONGODB_URI en .env.local");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log("✅ Mongo conectado");
    const db = client.db("normativacen");
    const collection = db.collection("knowledge_base");
    
    // Limpiar previo
    await collection.deleteMany({});
    console.log("🧹 Base de datos limpiada.");

    // Insertar datos planos
    await collection.insertMany(NORMATIVA_DATA);
    
    // Crear un índice de texto para búsquedas rápidas si el cluster lo permite
    // (Basta con un índice de texto estándar de Mongo)
    await collection.createIndex({ text: "text", topic: "text" });

    console.log("🎉 SUCCESS: Datos normativos cargados para Búsqueda por Texto.");
  } catch (e) {
    console.error("❌ ERROR durante el seed:", e);
  } finally {
    await client.close();
  }
}

seed();
