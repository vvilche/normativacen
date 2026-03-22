"use client";

import React, { useState } from 'react';
import { Cpu, RefreshCcw, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Solicitud Recibida</h2>
            <p className="text-muted-foreground italic">"{installation}"</p>
          </div>
          
          <div className="bg-background/50 rounded-2xl p-4 border border-border text-left space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" /> 
              Diagnóstico Preliminar IA
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Basado en el estándar **NTSyCS 2024**, tu instalación requiere una auditoría física de latencia. Los equipos legacy detectados podrían incumplir con el tiempo de despeje de falla de **200ms**.
            </p>
          </div>

          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3 text-sm font-medium text-primary hover:underline"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <RefreshCcw className="w-3 h-3" /> Programa de Actualización Normativa 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary tracking-tight">
            Modernización de Activos SITR/EDAC
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tus equipos cumplen con la nueva NTSyCS? El Coordinador Eléctrico Nacional exige estándares de ciberseguridad y latencia que los equipos legacy no soportan.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "RTUs & Gateways", desc: "Migración de DNP3 serial a IEC 61850 / Secure Authentication." },
            { icon: ShieldCheck, title: "Ciberseguridad", desc: "Implementación de firewalls industriales según estándar CEN." },
            { icon: RefreshCcw, title: "Redundancia", desc: "Duplicación de canales de comunicación físicos e independientes." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-card/50 border border-border rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Solicitar Diagnóstico de Cumplimiento</h2>
            <p className="text-muted-foreground">Analizamos tu inventario de activos y detectamos brechas normativas.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Instalación / Subestación</label>
                <input 
                  type="text" 
                  required
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Ej: SE Atacama 220kV" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Marca de Equipos Actuales</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Ej: SEL, Siemens, ABB" 
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Solicitar Auditoría de Activos <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ModernizationPage;
