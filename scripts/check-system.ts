import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

async function runDiagnostic() {
  console.log("🛠️  INICIANDO DIAGNÓSTICO DE INFRAESTRUCTURA - Agente Normativo Conecta\n");

  const results = {
    google_ai: false,
    mongodb: false,
    env_vars: false
  };

  // 1. Verificar Variables de Entorno Críticas
  console.log("📋 1. Verificando Variables de Entorno...");
  const criticalVars = ["GOOGLE_API_KEY", "MONGODB_URI"];
  const missing = criticalVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ ERROR: Faltan variables críticas: ${missing.join(", ")}`);
    results.env_vars = false;
  } else {
    console.log("✅ Variables de entorno presentes.\n");
    results.env_vars = true;
  }

  // 2. Verificar Conectividad con Google Gemini
  if (process.env.GOOGLE_API_KEY) {
    console.log("🤖 2. Probando Conexión con Google Gemini (Cloud Inference)...");
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY,
      });
      await model.invoke("Hola, responde con la palabra 'OK' si este mensaje llega correctamente.");
      console.log("✅ Conexión con Google AI exitosa.\n");
      results.google_ai = true;
    } catch (err: any) {
      console.error(`❌ ERROR en Google AI: ${err.message}\n`);
      results.google_ai = false;
    }
  }

  // 3. Verificar Conectividad con MongoDB (Persistence Layer)
  if (process.env.MONGODB_URI) {
    console.log("🍃 3. Probando Conexión con MongoDB Atlas...");
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("✅ Conexión con MongoDB exitosa.\n");
      results.mongodb = true;
    } catch (err: any) {
      console.error(`❌ ERROR en MongoDB: ${err.message}\n`);
      results.mongodb = false;
    } finally {
      await client.close();
    }
  }

  console.log("-------------------------------------------");
  console.log("📊 RESUMEN DE SALUD DE INFRAESTRUCTURA:");
  console.log(`ENV VARS: ${results.env_vars ? "LÍNEAS OPERATIVAS ✅" : "FALLO CRÍTICO ❌"}`);
  console.log(`GOOGLE AI: ${results.google_ai ? "ACTIVO ✅" : "DESCONECTADO ❌"}`);
  console.log(`MONGODB:   ${results.mongodb ? "ACTIVO ✅" : "DESCONECTADO ❌"}`);
  console.log("-------------------------------------------");

  if (Object.values(results).every(v => v)) {
    console.log("\n🚀 SISTEMA LISTO PARA PRODUCCIÓN.");
  } else {
    console.error("\n⚠️ SE DETECTARON BLOQUEADORES DE INFRAESTRUCTURA. Revisa los mensajes de error arriba.");
    process.exit(1);
  }
}

runDiagnostic();
