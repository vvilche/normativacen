"use client";

import React, { useState, useEffect } from 'react';
import { ComplianceDashboard } from '../../components/ComplianceDashboard';
import { Sparkles, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { IndustrialBackground } from '@/components/IndustrialBackground';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Recuperar perfil de localStorage o sessionStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-gold/30 relative overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center border border-gold/40 group-hover:bg-gold/30 transition-all shadow-gold">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-white italic">Normativa<span className="text-gold">CEN</span></span>
          </Link>

          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Volver al Chat</Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] text-slate-500">Sesión Activa:</p>
                <p className="text-white">{userProfile?.email || "Usuario"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-black shadow-gold">
                {userProfile?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <ShieldCheck className="w-5 h-5 shadow-gold" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Panel de Control Estratégico v9.2.1</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic">Salud de Activos del Coordinado</h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm font-medium">
              Monitoreo en tiempo real de cumplimiento, riesgos regulatorios y exposición económica 
              basado en la matriz de <span className="text-white underline decoration-gold/40 underline-offset-4">9 especialistas de IA</span>.
            </p>
          </div>

          <div className="flex gap-3">
             <button className="px-8 py-3 bg-gold text-black rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-gold hover:scale-105 active:scale-95">
               Descargar Reporte Ejecutivo
             </button>
          </div>
        </div>

        {/* Dashboard Component */}
        <ComplianceDashboard />

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs text-slate-600">
              © 2026 Agente Normativo Conecta | Inteligencia de Cumplimiento para el SEN
            </p>
        </div>
      </footer>
    </div>
  );
}
