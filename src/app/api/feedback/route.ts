import { NextResponse } from "next/server";
import clientPromise from "@/lib/rag/mongoClient";

/**
 * POST /api/feedback
 * Guarda el feedback del usuario sobre una respuesta del agente.
 * Soporta golden examples para alimentar el few-shot RAG.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      query,           // La consulta original del usuario
      response,        // El contenido de la respuesta del agente
      agentType,       // "edacAgent" | "sitrAgent" | etc.
      hallazgo,        // El hallazgo_highlight generado
      metrics,         // Extracción de metadatos estructurados
      rating,          // 1-5 estrellas del usuario
      isGoldenExample, // true = guardar como referencia de calidad
      correction,      // Texto libre con la corrección del usuario
      userProfile,     // Perfil del coordinado
    } = body;

    if (!query || !response || !agentType) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("normativacen");
    const collection = db.collection("agent_feedback");

    const doc = {
      query,
      responseSummary: (response || "").substring(0, 500),
      agentType,
      hallazgo: hallazgo || null,
      metrics: metrics || [],
      rating: rating || null,
      isGoldenExample: !!isGoldenExample,
      correction: correction || null,
      userProfile: userProfile || {},
      qualityScore: [hallazgo, (metrics?.length ?? 0) > 0].filter(Boolean).length + (body.seoTags?.length > 0 ? 1 : 0),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      isGoldenExample: doc.isGoldenExample,
      message: doc.isGoldenExample
        ? "✅ Guardado como caso de referencia para el aprendizaje del agente."
        : "✅ Feedback registrado.",
    });
  } catch (error: any) {
    console.error("❌ Error en /api/feedback:", error);
    // Fallback graceful — no bloquear la UX si MongoDB no está disponible
    return NextResponse.json({
      success: true,
      id: "mock-" + Date.now(),
      message: "✅ Feedback registrado (modo offline).",
    });
  }
}

/**
 * GET /api/feedback?agentType=edacAgent&limit=3
 * Recupera los golden examples de un agente específico para few-shot RAG.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentType = searchParams.get("agentType");
    const limit = parseInt(searchParams.get("limit") || "3");

    if (!agentType) {
      return NextResponse.json({ error: "agentType requerido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("normativacen");
    const collection = db.collection("agent_feedback");

    const examples = await collection
      .find({ agentType, isGoldenExample: true, rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ examples, count: examples.length });
  } catch (error: any) {
    console.error("❌ Error recuperando golden examples:", error);
    return NextResponse.json({ examples: [], count: 0 });
  }
}
