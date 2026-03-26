import { config } from 'dotenv';
config({ path: '.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("🔑 API Key cargada:", apiKey ? `${apiKey.substring(0, 15)}...` : "NO ENCONTRADA");

  if (!apiKey) {
    console.error("❌ GOOGLE_API_KEY no encontrada");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Probar listado de modelos disponibles
  const models = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro-preview-03-25"];
  
  for (const modelName of models) {
    try {
      process.stdout.write(`🧪 Probando modelo: ${modelName} ... `);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Di 'OK'");
      const text = result.response.text();
      console.log(`✅ OK → "${text.trim().substring(0, 50)}"`);
    } catch (err: any) {
      console.log(`❌ Error: ${err.status || err.statusCode} - ${err.message?.substring(0, 80)}`);
    }
  }
}

main().catch(console.error);
