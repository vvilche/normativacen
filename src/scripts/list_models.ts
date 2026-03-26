import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function listModels() {
  try {
    console.log("🔍 Fetching models from Google API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();
    
    if (data.models) {
      console.log("✅ MODELOS DISPONIBLES:");
      data.models.forEach((m: any) => console.log(`- ${m.name}`));
    } else {
      console.log("❌ No se pudieron listar los modelos:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("❌ Error de red:", e);
  }
}

listModels();
