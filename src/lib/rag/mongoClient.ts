import { MongoClient } from "mongodb";

/**
 * ==========================================
 * MONGODB ATLAS (Asset Profiler & RAG VectorStore)
 * ==========================================
 * Cliente global para conexión a MongoDB.
 * Se reutiliza la misma instancia en funciones serverless.
 */

if (!process.env.MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI no encontrada. El Asset Profiler y el Vector Search están simulados temporalmente.");
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/conecta_mock";
const options = {
  serverSelectionTimeoutMS: 5000, // No esperar más de 5 segundos
  connectTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let isConnectionFailed = false;

export function resetConnectionStatus() {
  isConnectionFailed = false;
}

export function getConnectionStatus() {
  return isConnectionFailed;
}

export function setConnectionFailed() {
  isConnectionFailed = true;
}

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
