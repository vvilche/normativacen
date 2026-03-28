"use client";

import React from 'react';
import { ShieldCheck, Zap, Terminal, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

const DocumentationPage = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Basic check for auth token in cookies
    const token = document.cookie.includes('auth_token');
    setIsLoggedIn(token);
  }, []);

  return (
    <div className="min-h-screen text-slate-200 selection:bg-gold/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-20 space-y-24 relative z-10">
        {/* Header */}
        <header className="space-y-6 pt-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/5 border border-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl">
            REF: NTSyCS-v2025.01
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white italic">
            Base de Conocimiento <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">Normativa CEN</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mx-auto md:mx-0">
            Documentación técnica oficial sobre los protocolos de cumplimiento para coordinados del Sistema Eléctrico Nacional.
          </p>
        </header>

        {/* Core Pillars */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="group p-8 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-gold/30 transition-all duration-500 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform shadow-gold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tight">Protocolos SITR</h3>
            <div className="text-slate-400 leading-relaxed font-medium">
              La NTSyCS exige redundancia física en canales de comunicación. 
              <span className="block mt-4 text-[11px] font-mono p-4 bg-black/40 rounded-2xl border border-white/5 whitespace-pre text-gold opacity-80">
{`> Latencia: < 50ms (T1/T2)
> Ancho de Banda: 128 kbps mín.
> Disponibilidad: 99.8% anual.`}
              </span>
            </div>
          </div>

          <div className="group p-8 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-gold/30 transition-all duration-500 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform shadow-gold">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tight">Esquema EDAC</h3>
            <div className="text-slate-400 leading-relaxed font-medium">
              El Esquema de Desconexión Automática de Carga requiere precisión en el tiempo real.
              <span className="block mt-4 text-[11px] font-mono p-4 bg-black/40 rounded-2xl border border-white/5 whitespace-pre text-gold opacity-80">
{`> Tiempo de Operación: 200 ms Máx.
> Lógica: UFLS (Baja Frecuencia)
> Supervisión: Estado de Interruptor.`}
              </span>
            </div>
          </div>
        </section>

        {/* Methodology: Harness Engineering */}
        <section className="space-y-12 py-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white italic">
              <div className="h-10 w-2 bg-gold rounded-full shadow-gold" />
              Metodología Harness Engineering
            </h2>
            <p className="text-slate-400 max-w-3xl text-lg font-medium">
              Nuestra arquitectura de IA valida cada palabra contra el marco legal vigente mediante tres capas de seguridad algorítmica sobre **Google Gemini 2.5 Flash**.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { 
                title: "Context Engineering", 
                desc: "Inyectamos el 'Single Source of Truth' de la NTSyCS directamente en la ventana de contexto." 
              },
              { 
                title: "Architectural Constraints", 
                desc: "Reglas rígidas que impiden citar normativas derogadas o estándares no aplicables en Chile." 
              },
              { 
                title: "Entropy Control", 
                desc: "Validación estadística de coherencia técnica para eliminar alucinaciones en datos críticos." 
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01] backdrop-blur-sm space-y-4 hover:border-gold/20 transition-all group">
                <div className="text-gold font-black font-mono text-xs tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">AGENT_STEP_0{i+1}</div>
                <h4 className="font-black text-lg text-white uppercase italic tracking-tighter">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical White Papers Library */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white italic text-left">
                <div className="h-10 w-2 bg-gold rounded-full shadow-gold" />
                Biblioteca de White Papers
              </h2>
              <p className="text-slate-400 max-w-2xl text-lg font-medium">
                Recursos de alta ingeniería para la toma de decisiones críticas. 
                <span className="block text-[10px] font-black text-gold mt-2 uppercase tracking-[0.3em]">Acceso restringido para coordinados verificados.</span>
              </p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["Todos", "SITR", "PMGD", "SSCC", "BESS"].map((cat) => (
                <button key={cat} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${cat === "Todos" ? "bg-gold text-black border-gold shadow-gold" : "bg-white/5 border-white/10 text-slate-500 hover:border-gold/40"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative px-2">
            {!isLoggedIn && (
              <div className="absolute inset-0 z-20 backdrop-blur-2xl bg-[#0B0F1A]/40 rounded-[40px] flex flex-col items-center justify-center border border-white/5 p-12 text-center space-y-8">
                <div className="w-24 h-24 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-gold">
                  <Lock className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Repositorio Protegido</h3>
                  <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
                    Inicia sesión con tu correo corporativo para acceder a los manuales de integración y reportes SITR/EDAC.
                  </p>
                </div>
                <Link href="/login" className="px-12 py-5 rounded-full bg-gold text-black font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-gold">
                  Identificarse vía OTP
                </Link>
              </div>
            )}

            {[
              { 
                id: "sitr-ntsycs-2025",
                cat: "SITR - NTSyCS V2.1", 
                title: "Optimización SITR y Exigencias NTSyCS 2025", 
                desc: "Análisis técnico de protocolos (ICCP/DNP3), sincronización GPS +/- 100us y requisitos de latencia para coordinados.", 
                skills: ["skill_base_sitr", "skill_generacion"],
                status: "red"
              },
              { 
                id: "edac-auditoria",
                cat: "EDAC — Protección", 
                title: "Criterios EDAC y Auditorías de Desconexión", 
                desc: "Parámetros críticos de operación (<= 200 ms), criterios de precisión (80-120%) y reportes de oscilografía post-falla.", 
                skills: ["skill_edac_edag_erag"],
                status: "red"
              },
              { 
                id: "pmus-monitoreo",
                cat: "PMUS / MMF — Norma 2024", 
                title: "Hitos PMUS y Monitoreo Fasorial Estratégico", 
                desc: "Guía de cumplimiento para el hito del 31 de Julio. Requisitos PMU M-Class, ancho de banda y redundancia de red.", 
                skills: ["skill_pmgd_pmg", "skill_sscc"],
                status: "orange"
              }
            ].map((paper, i) => (
              <div key={i} className={`group relative flex flex-col h-full rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-500 hover:border-gold/30 hover:shadow-gold ${!isLoggedIn ? 'opacity-30 pointer-events-none grayscale blur-[2px]' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${paper.status === "red" ? "text-red-500 bg-red-500" : "text-orange-400 bg-orange-400"}`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{paper.cat}</span>
                </div>

                <h4 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-gold transition-colors italic uppercase tracking-tighter">{paper.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-10 flex-grow font-medium">{paper.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  {paper.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[8px] font-mono text-gold uppercase tracking-tighter shadow-inner opacity-60 group-hover:opacity-100 transition-opacity">{s}</span>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  {isLoggedIn ? (
                    <Link href={`/documentacion/${paper.id}`} className="text-[10px] font-black text-gold hover:underline flex items-center gap-2 group/link px-4 py-2 rounded-xl bg-gold/5 border border-gold/10">
                      LEER WHITE PAPER
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="text-[9px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                       CONTENIDO BLOQUEADO <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-500 pb-12 font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
              <Terminal className="w-5 h-5 text-gold/30" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-white/50">CONECTA COMPLIANCE ENGINE</span>
              <span className="block font-mono opacity-50">Build v1.0.4-LTS | Santiago, Chile</span>
            </div>
          </div>
          <p className="">© 2026 NormativaCEN.cl - Industrial Excellence</p>
        </footer>
      </div>
    </div>
  );
};

export default DocumentationPage;
