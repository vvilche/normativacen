import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const googleKey = process.env.GOOGLE_API_KEY ? 'CONFIGURADO ✅' : 'FALTANTE ❌';
  const mongoUri = process.env.MONGODB_URI ? 'CONFIGURADO ✅' : 'FALTANTE ❌';
  const postmarkToken = process.env.POSTMARK_API_TOKEN ? 'CONFIGURADO ✅' : 'FALTANTE ❌';
  
  const isReady = !!(process.env.GOOGLE_API_KEY && process.env.MONGODB_URI);

  return NextResponse.json({
    status: isReady ? 'Sistema Operativo' : 'Configuración Incompleta',
    diagnostics: {
      google_ai: googleKey,
      database: mongoUri,
      messaging: postmarkToken,
    },
    recommendation: isReady 
      ? 'El entorno está listo. Si hay errores, revisa los modelos.' 
      : 'Debes configurar las variables de entorno en el panel de Netlify.'
  });
}
