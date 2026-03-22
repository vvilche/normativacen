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
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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
