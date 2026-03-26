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
    text: "Los Esquemas de Desconexión de Carga por Baja Frecuencia (EDAC) en el Sistema Eléctrico Nacional de Chile deben operar en escalones definidos. El tiempo máximo de despeje, desde la detección de la frecuencia umbral hasta la apertura efectiva del interruptor, no debe superar los 200 milisegundos (ms). Reservas de corte deben estar geo-distribuidas. El incumplimiento de estos tiempos es una falta gravísima según la SEC.",
    metadata: { source: "NTSyCS Capítulo 4", section: "Seguridad Sistémica" }
  },
  {
    topic: "SITR",
    text: "El Estándar Técnico de Sistemas de Información en Tiempo Real (SITR) exige que los enlaces de comunicación entre Coordinados y el CEN tengan una disponibilidad del 99.8%. El ancho de banda mínimo para telemetría SCADA es de 128 kbps, con latencia máxima permitida de 500ms para asegurar la estabilidad del control remoto. Protocolos admitidos incluyen ICCPv2 e IEC 60870-5-104.",
    metadata: { source: "NTSyCS Anexo de Comunicaciones", section: "Telecomunicaciones" }
  },
  {
    topic: "BESS",
    text: "Los sistemas de almacenamiento de energía mediante baterías (BESS) deben cumplir con la Norma Técnica de Conexión y Operación. Para participar en servicios complementarios, deben garantizar una rampa de subida de potencia de al menos el 10% de su capacidad nominal por segundo y un tiempo de respuesta inferior a 1 segundo para señales de regulación de frecuencia.",
    metadata: { source: "Norma de Almacenamiento 2024", section: "Sistemas Flexibles" }
  },
  {
    topic: "PMGD",
    text: "Los Pequeños Medios de Generación Distribuida (PMGD) tienen requisitos específicos de inyección de potencia reactiva. Según el DS88, deben ser capaces de operar con un factor de potencia entre 0.95 inductivo y 0.95 capacitivo en el punto de conexión. El monitoreo en tiempo real es obligatorio para plantas con capacidad instalada superior a 500 kW.",
    metadata: { source: "Reglamento DS88", section: "Operación Distribuida" }
  },
  {
    topic: "PMU",
    text: "Las Unidades de Medición Fasorial (PMU) deben estar sincronizadas mediante GPS con una precisión superior a 1 microsegundo. La tasa de reporte para el Coordinador Eléctrico Nacional debe ser de al menos 50 cuadros por segundo (fps) para permitir el análisis dinámico de oscilaciones electromecánicas en el SEN.",
    metadata: { source: "Anexo Técnico de Medición Fasorial", section: "WAMS" }
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

    console.log("⏳ Insertando datos de normativa...");

    for (const item of NORMATIVA_DATA) {
      await collection.insertOne({
        text: item.text,
        metadata: item.metadata,
        topic: item.topic
      });
    }

    // CREAR ÍNDICE DE TEXTO PARA BÚSQUEDA RAG
    console.log("🔍 Creando índice de texto en MongoDB...");
    await collection.createIndex({ text: "text", topic: "text" });

    console.log("🎉 ¡Base de conocimientos inyectada con éxito en MongoDB!");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
  } finally {
    await client.close();
  }
}

seed();
