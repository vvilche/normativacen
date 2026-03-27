import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  try {
    // @ts-ignore - listModels exists but may have typing issues in some versions
    const result = await (genAI as any).listModels();
    console.log("Modelos disponibles:");
    (result.models || []).forEach((m: any) => console.log(` - ${m.name}`));
  } catch (error: any) {
    console.error("Error listando modelos:", error.message);
  }
}

listModels();
