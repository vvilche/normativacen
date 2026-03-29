import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION_NAME = "xapi_statements";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const { actor, verb, object } = body;

  if (!actor || !verb || !object) {
    return NextResponse.json({ error: "actor, verb y object son obligatorios" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const now = new Date();
    await db.collection(COLLECTION_NAME).insertOne({
      ...body,
      insertedAt: now.toISOString(),
    });
    return NextResponse.json({ ok: true, storedAt: now.toISOString() });
  } catch (error) {
    console.error("Error guardando xAPI", error);
    return NextResponse.json({ error: "No se pudo guardar el statement" }, { status: 500 });
  }
}
