import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request) {
  await dbConnect();
  const { slug, action } = await req.json();
  const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];

  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (action === 'download') {
      await User.findByIdAndUpdate(decoded.userId, {
        $push: { downloads: { paperId: slug, downloadedAt: new Date() } }
      });
      return NextResponse.json({ message: 'Descarga registrada' });
    }
    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
