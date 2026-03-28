import { MongoClient } from "mongodb";

/**
 * ==========================================
 * MONGODB ATLAS (Asset Profiler & RAG VectorStore)
 * ==========================================
 * Cliente global para conexión a MongoDB.
 * Se reutiliza la misma instancia en funciones serverless.
 */

const options = {
  serverSelectionTimeoutMS: 5000, // No esperar más de 5 segundos
  connectTimeoutMS: 5000,
};

let clientPromise: Promise<MongoClient> | null = null;
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

/**
 * Obtiene la promesa del cliente de MongoDB de forma perezosa (Lazy).
 */
export function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  if (!process.env.MONGODB_URI) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI no encontrada en producción.");
    }
    console.warn("⚠️ MONGODB_URI no encontrada. Usando mock local.");
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/conecta_mock";
  const client = new MongoClient(uri, options);

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  return clientPromise;
}

export default getClientPromise;
