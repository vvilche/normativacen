import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'Falta el slug' }, { status: 400 });

  try {
    // 1. Try internal content first (Priority)
    let filePath = path.join(process.cwd(), 'src', 'content', 'documentacion', `${slug}.md`);
    
    // 2. Fallback to external 'documentos'
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), '..', 'documentos', `${slug}.md`);
    }
    
    // 3. Fallback to external 'skills'
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), '..', 'skills', `${slug}.md`);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
