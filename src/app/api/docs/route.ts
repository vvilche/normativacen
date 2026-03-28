import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'Falta el slug' }, { status: 400 });

  try {
    const candidatePaths = [
      path.join(process.cwd(), 'src', 'content', 'documentacion', `${slug}.md`),
      path.join(process.cwd(), 'docs', `${slug}.md`)
    ];

    const filePath = candidatePaths.find((candidate) => fs.existsSync(candidate));
    if (!filePath) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
