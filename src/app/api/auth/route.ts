import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import * as postmark from 'postmark';

function getPostmarkClient() {
  const token = process.env.POSTMARK_API_TOKEN || '';
  if (!token) {
    console.warn('⚠️ POSTMARK_API_TOKEN no configurada. El sistema operará en modo de simulación de correo.');
    return null;
  }
  return new postmark.ServerClient(token);
}

const POSTMARK_SENDER = process.env.POSTMARK_SENDER || 'admin@normativacen.cl';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const db = await dbConnect();
    const { action, email, password, code, role } = await req.json();
    console.log(`📡 [AUTH] Action: ${action} | Email: ${email}`);

    // Enhanced Mock Mode fallback (Disconnected / Incomplete Setup)
    if (!db || !process.env.MONGODB_URI) {
      console.log(`⚠️  [MODO RESILIENCIA ACTIVO] - Sin conexión a DB para acción: ${action}`);
      if (action === 'register') {
         return NextResponse.json({ 
           message: '🔄 Simulación: Registro técnica/Mock (Infraestructura Offline)', 
           email 
         });
      }
      if (action === 'verify') {
         return NextResponse.json({ message: '🔄 Simulación: Verificado correctamente (Mock)', token: 'mock-token-verify' });
      }
      if (action === 'login') {
         return NextResponse.json({ message: '🔄 Simulación: Login exitoso (Mock)', token: 'mock-token-login' });
      }
    }

    if (action === 'register') {
      console.log(`📝 [AUTH] Registrando usuario: ${email}`);
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.isVerified) {
          return NextResponse.json({ message: 'El usuario ya existe y está verificado.' }, { status: 400 });
        }
        // If not verified, update OTP and resend
        existingUser.otp = {
          code: otpCode,
          expiresAt: otpExpiry
        };
        await existingUser.save();
        console.log(`[AUTH] Resending OTP for unverified user: ${email}`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
          email,
          password: hashedPassword,
          role: role || 'coordinado',
          otp: {
            code: otpCode,
            expiresAt: otpExpiry
          }
        });
        console.log(`[AUTH] Creating new user and sending OTP: ${email}`);
      }

      console.log(`[POSTMARK] Sending OTP to: ${email} (Code: ${otpCode})`);
      
      try {
        const client = getPostmarkClient();
        if (client) {
          const response = await client.sendEmail({
            From: `NormativaCEN <${POSTMARK_SENDER}>`,
            To: email,
            Subject: "Código de Verificación - NormativaCEN",
            HtmlBody: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">NormativaCEN</h2>
                <p>Hola,</p>
                <p>Has iniciado el proceso de acceso en nuestra plataforma de cumplimiento normativo. Tu código de verificación es:</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
                  ${otpCode}
                </div>
                <p style="font-size: 14px; color: #6b7280;">Este código expirará en 10 minutos. Si no solicitaste este código, puedes ignorar este mensaje.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2026 NormativaCEN.cl - Santiago, Chile</p>
              </div>
            `,
            TextBody: `Tu código de verificación para NormativaCEN es: ${otpCode}. Expira en 10 minutos.`,
            MessageStream: "outbound"
          });
          console.log(`[POSTMARK] Email sent successfully. ID: ${response.MessageID}`);
        } else {
          console.log(`[AUTH-SIM] Simulación de envío de OTP para ${email}: ${otpCode}`);
        }
      } catch (postmarkError: any) {
        console.error("Error sending via Postmark:", postmarkError.message);
        // Fallback log for development
        console.log(`[DEVELOPMENT FALLBACK] OTP Code: ${otpCode}`);
      }

      return NextResponse.json({ 
        message: 'Código enviado. Revisa tu correo (y carpeta de Spam).', 
        email 
      });
    }

    if (action === 'verify') {
      const user = await User.findOne({ email });

      if (!user || user.otp?.code !== code) {
        return NextResponse.json({ message: 'Código inválido.' }, { status: 400 });
      }

      if (new Date() > user.otp?.expiresAt) {
        return NextResponse.json({ message: 'El código ha expirado.' }, { status: 400 });
      }

      user.isVerified = true;
      user.otp = undefined; // Clear OTP after verification
      await user.save();
        
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '5d' });
      const response = NextResponse.json({ message: 'Verificado correctamente', token });
      // Set httpOnly: false so client-side React can detect the session to unlock the UI
      response.cookies.set('auth_token', token, { 
        httpOnly: false, 
        secure: true, 
        maxAge: 432000,
        path: '/' 
      });
      return response;
    }

    if (action === 'login') {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
      }

      if (!user.isVerified) {
        // Generar nuevo OTP para que el usuario pueda completar la verificación
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        user.otp = { code: otpCode, expiresAt: otpExpiry };
        await user.save();
        
        console.log(`[AUTH] Resending OTP during login for unverified user: ${email}`);
        
        // Versión simplificada del envío (reutilizando la lógica de arriba sería mejor refactorizar, pero para rapidez lo pondré aquí)
        try {
          const client = getPostmarkClient();
          if (client) {
            await client.sendEmail({
              From: `NormativaCEN <${POSTMARK_SENDER}>`,
              To: email,
              Subject: "Nuevo Código de Verificación - NormativaCEN",
              HtmlBody: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #2563eb; text-align: center;">NormativaCEN</h2>
                  <p>Tu cuenta aún no ha sido verificada. Usa este nuevo código para ingresar:</p>
                  <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
                    ${otpCode}
                  </div>
                  <p style="font-size: 14px; color: #6b7280;">Este código expirará en 10 minutos.</p>
                </div>
              `,
              TextBody: `Tu código de verificación para NormativaCEN es: ${otpCode}`,
              MessageStream: "outbound"
            });
          } else {
             console.log(`[AUTH-SIM-LOGIN] Simulación de envío de OTP para ${email}: ${otpCode}`);
          }
        } catch (e) {
          console.log(`[DEVELOPMENT FALLBACK] OTP Code: ${otpCode}`);
        }

        return NextResponse.json({ 
          message: 'Cuenta no verificada. Se ha enviado un nuevo código.', 
          unverified: true 
        }, { status: 403 });
      }

      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '5d' });
      const response = NextResponse.json({ message: 'Login exitoso', token });
      response.cookies.set('auth_token', token, { 
        httpOnly: false, 
        secure: true, 
        maxAge: 432000,
        path: '/' 
      });
      return response;
    }

    return NextResponse.json({ message: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    const errorMsg = error.message || 'Error Desconocido en el Driver de Base de Datos';
    console.error('❌ [AUTH CRASH]:', errorMsg, error.stack);
    
    return NextResponse.json({ 
      message: `Error Técnico: ${errorMsg}`,
      status: 500,
      debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
