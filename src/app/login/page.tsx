"use client";

import React, { useState } from 'react';
import { Shield, Mail, Lock, Key, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IndustrialBackground } from '@/components/IndustrialBackground';

export default function LoginPage() {
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('isRegistered') === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const action = isRegister ? 'register' : 'login';
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email, password, role: 'coordinado' })
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (data.unverified) setStep('otp');
        throw new Error(data.error || 'Error en la autenticación');
      }

      if (isRegister) {
        setStep('otp');
      } else {
        localStorage.setItem('isRegistered', 'true');
        localStorage.setItem('userProfile', JSON.stringify({ email, company: 'CONECTA', activeAsset: 'GEN/BESS' }));
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código inválido');

      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userProfile', JSON.stringify({ email, company: 'CONECTA', activeAsset: 'GEN/BESS' }));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <IndustrialBackground />
      
      <div className="w-full max-w-md space-y-8 p-10 rounded-3xl border border-white/10 bg-[#0B0F1A]/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 text-gold mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-heading font-black tracking-tighter text-white uppercase italic">
            {step === 'auth' ? (isRegister ? 'Crear Entorno' : 'Acceso Seguro') : 'Verificación OTP'}
          </h2>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
            {step === 'auth' ? 'Ingresa tus credenciales técnicas de Coordinado.' : `Enviamos un código a ${email}`}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {step === 'auth' ? (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="ingeniero@coordinado.cl"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/20 border border-white/5 focus:border-gold/50 outline-none transition-all placeholder:text-gray-700 text-white font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Clave de Acceso</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-gold transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/20 border border-white/5 focus:border-gold/50 outline-none transition-all placeholder:text-gray-700 text-white font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold text-black font-black uppercase tracking-widest text-[12px] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegister ? 'Registrar Activo' : 'Entrar al Harness'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <p className="text-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta registrada?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-gold hover:underline ml-1"
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/20 border border-white/5 focus:border-gold/50 outline-none transition-all text-center tracking-[1em] text-2xl font-mono text-gold font-bold"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold text-black font-black uppercase tracking-widest text-[12px] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar e Ingresar'}
              {!loading && <CheckCircle2 className="w-5 h-5" />}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('auth')}
              className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors"
            >
              ← Volver atrás
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
