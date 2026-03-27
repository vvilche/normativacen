import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const db = await dbConnect();
    const { slug, action } = await req.json();

    // Mock Mode fallback for Development (Disconnected)
    if (!db && process.env.NODE_ENV === 'development') {
       console.warn('⚙️ [MOCK] Tracking simulado exitoso para:', slug);
       return NextResponse.json({ message: 'Tracking simulado' });
    }

    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (action === 'download') {
      await User.findByIdAndUpdate(decoded.userId, {
        $push: { downloads: { paperId: slug, downloadedAt: new Date() } }
      });
      return NextResponse.json({ message: 'Descarga registrada' });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Error en Tracking Route:', error.message);
    return NextResponse.json({ error: 'Error procesando tracking', detail: error.message }, { status: 500 });
  }
}
