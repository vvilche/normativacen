"use client";

import React, { useState, useEffect } from 'react';
import { ComplianceDashboard } from '../../components/ComplianceDashboard';
import { Sparkles, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-accent/30">
      
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/documentacion" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/40 group-hover:bg-accent/30 transition-all">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-white italic">NormativaCEN</span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/documentacion" className="text-slate-400 hover:text-white transition-colors">Volver al Chat</Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Sesión iniciada como</p>
                <p className="text-sm text-white font-bold">{userProfile?.name || "Usuario"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-accent font-bold">
                {userProfile?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Panel de Control Estratégico</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Salud de Activos del Coordinado</h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Monitoreo en tiempo real de cumplimiento, riesgos regulatorios y exposición económica 
              basado en la matriz de 8 especialistas de IA.
            </p>
          </div>

          <div className="flex gap-3">
             <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
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
