import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from "dotenv";
import path from "path";

console.log("🚀 Iniciando script de seed...");

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("🔧 Variables de entorno cargadas");

const NORMATIVA_DATA = [
  {
    topic: "EDAC",
    text: "Los Esquemas de Desconexión de Carga por Baja Frecuencia (EDAC) en el Sistema Eléctrico Nacional de Chile deben operar en escalones definidos. El tiempo máximo de despeje, desde la detección de la frecuencia umbral hasta la apertura efectiva del interruptor, no debe superar los 200 milisegundos (ms). Reservas de corte deben estar geo-distribuidas.",
    metadata: { source: "NTSyCS Capítulo 4", section: "Seguridad Sistémica" }
  },
  {
    topic: "SITR",
    text: "El Estándar Técnico de Sistemas de Información en Tiempo Real (SITR) exige que los enlaces de comunicación entre Coordinados y el CEN tengan una disponibilidad del 99.8%. El ancho de banda mínimo para telemetría SCADA es de 128 kbps, con latencia máxima permitida de 500ms para asegurar la estabilidad del control remoto.",
    metadata: { source: "NTSyCS Anexo de Comunicaciones", section: "Telecomunicaciones" }
  },
  {
    topic: "ROCOF",
    text: "La nueva Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS) exige que los equipos de protección sean capaces de medir la derivada de frecuencia (df/dt o ROCOF). Los relés antiguos que no poseen esta capacidad deben ser modernizados para evitar disparos erráticos durante contingencias severas del sistema.",
    metadata: { source: "NTSyCS 2024 Update", section: "Protecciones" }
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!uri || !apiKey) {
    console.error("❌ Faltan MONGODB_URI o GOOGLE_API_KEY en .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    const db = client.db("normativacen");
    const collection = db.collection("knowledge_base");

    // Limpiar colección previa (opcional, para el demo)
    await collection.deleteMany({});

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: apiKey,
    });

    console.log("⏳ Generando embeddings e insertando datos...");

    for (const item of NORMATIVA_DATA) {
      const vector = await embeddings.embedQuery(item.text);
      await collection.insertOne({
        text: item.text,
        embedding: vector,
        metadata: item.metadata,
        topic: item.topic
      });
    }

    console.log("🎉 ¡Base de conocimientos inyectada con éxito en MongoDB!");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
  } finally {
    await client.close();
  }
}

seed();
