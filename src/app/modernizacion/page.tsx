"use client";

import React, { useState } from 'react';
import { Cpu, RefreshCcw, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { IndustrialBackground } from '@/components/IndustrialBackground';

const ModernizationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [installation, setInstallation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!installation.trim()) return;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="max-w-md w-full bg-[#0B0F1A]/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
          
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-gold">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-heading font-black text-white italic uppercase tracking-tighter">Solicitud Procesada</h2>
            <p className="text-gold text-xs font-black uppercase tracking-widest italic">"{installation}"</p>
          </div>
          
          <div className="bg-black/40 rounded-3xl p-6 border border-white/5 text-left space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gold">
              <AlertCircle className="w-3.5 h-3.5" /> 
              DIAGNÓSTICO PRELIMINAR IA
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Basado en el estándar <span className="text-white">NTSyCS 2025</span>, tu instalación requiere una auditoría física de latencia. Los equipos detectados podrían incumplir con el tiempo de despeje de falla de <span className="text-white">200ms</span>.
            </p>
          </div>

          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full py-4 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
          >
            Nueva Consulta Técnica
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 selection:bg-gold/30 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10 p-8 md:p-16">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/5 border border-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl mb-4">
            <RefreshCcw className="w-3.5 h-3.5 animate-spin-slow" /> Programa de Modernización 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter italic uppercase">
            Actualización de Activos <span className="text-gold">SITR/EDAC</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            ¿Tus equipos cumplen con la nueva NTSyCS? El Coordinador Eléctrico Nacional exige estándares de ciberseguridad y latencia críticos.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "RTUs & Gateways", desc: "Migración de DNP3 serial a IEC 61850 / Secure Authentication." },
            { icon: ShieldCheck, title: "Ciberseguridad", desc: "Implementación de firewalls industriales según estándar CEN." },
            { icon: RefreshCcw, title: "Redundancia", desc: "Duplicación de canales de comunicación físicos e independientes." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-gold/30 transition-all group">
              <feature.icon className="w-8 h-8 text-gold mb-6 opacity-60 group-hover:opacity-100 transition-opacity shadow-gold" />
              <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-3">{feature.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 md:p-16 space-y-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
          
          <div className="text-center space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Solicitar Diagnóstico Técnico</h2>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Analizamos brechas normativas en tu inventario de activos.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Instalación / Subestación</label>
                <input 
                  type="text" 
                  required
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-gold/50 outline-none transition-all placeholder:text-slate-500 text-white font-medium" 
                  placeholder="Ej: SE Atacama 220kV" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Marca de Equipos Actuales</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-gold/50 outline-none transition-all placeholder:text-slate-500 text-white font-medium" 
                  placeholder="Ej: SEL, Siemens, ABB" 
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gold text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-gold text-[12px]"
            >
              Iniciar Auditoría de Activos <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ModernizationPage;
