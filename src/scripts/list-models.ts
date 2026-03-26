import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  try {
    const result = await genAI.listModels();
    console.log("Modelos disponibles:");
    result.models.forEach(m => console.log(` - ${m.name}`));
  } catch (error: any) {
    console.error("Error listando modelos:", error.message);
  }
}

listModels();
