import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/rag/mongoClient";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params || {};
  if (!id) {
    return NextResponse.json({ error: "Falta el identificador del dossier" }, { status: 400 });
  }

  try {
    const client = await clientPromise();
    const doc = await client
      .db("normativacen")
      .collection("technical_resolutions")
      .findOne({ queryHash: id });

    if (!doc) {
      return NextResponse.json({ error: "Dossier no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id,
      resolutionId: id,
      data: doc.payload,
      createdAt: doc.createdAt,
    });
  } catch (error: any) {
    console.error("❌ Error recuperando dossier:", error);
    return NextResponse.json(
      { error: "No se pudo recuperar el dossier solicitado" },
      { status: 500 }
    );
  }
}
