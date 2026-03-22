"use client";

import React from 'react';
import { BookOpen, ShieldCheck, Zap, Terminal, Cpu, ArrowRight, CheckCircle2, Lock, Download } from 'lucide-react';
import Link from 'next/link';

const DocumentationPage = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Basic check for auth token in cookies
    const token = document.cookie.includes('auth_token');
    setIsLoggedIn(token);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-20 space-y-24">
        {/* Header */}
        <header className="space-y-6 pt-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
            REF: NTSyCS-v2024.03
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
            Base de Conocimiento <br /> <span className="text-primary font-bold">Normativa CEN</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed mx-auto md:mx-0">
            Documentación técnica oficial sobre los protocolos de cumplimiento para coordinados del Sistema Eléctrico Nacional.
          </p>
        </header>

        {/* Core Pillars */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="group p-8 rounded-3xl border border-white/5 bg-card/30 backdrop-blur-xl hover:border-primary/50 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Protocolos SITR</h3>
            <div className="text-muted-foreground leading-relaxed">
              La NTSyCS exige redundancia física en canales de comunicación. 
              <span className="block mt-4 text-sm font-mono p-4 bg-background/50 rounded-xl border border-white/5 whitespace-pre">
{`> Latencia: < 50ms (T1/T2)
> Ancho de Banda: 128 kbps mín.
> Disponibilidad: 99.8% anual.`}
              </span>
            </div>
          </div>

          <div className="group p-8 rounded-3xl border border-white/5 bg-card/30 backdrop-blur-xl hover:border-accent/50 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Esquema EDAC</h3>
            <div className="text-muted-foreground leading-relaxed">
              El Esquema de Desconexión Automática de Carga requiere precisión en el tiempo real.
              <span className="block mt-4 text-sm font-mono p-4 bg-background/50 rounded-xl border border-white/5 whitespace-pre">
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
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4 text-white">
              <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              Metodología Harness Engineering
            </h2>
            <p className="text-muted-foreground max-w-3xl text-lg">
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
              <div key={i} className="p-8 rounded-3xl border border-white/5 bg-card/20 backdrop-blur-sm space-y-4 hover:border-primary/20 transition-colors">
                <div className="text-primary font-black font-mono">0{i+1}.</div>
                <h4 className="font-bold text-xl text-white">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical White Papers Library */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold flex items-center gap-4 text-white">
                <div className="h-10 w-2 bg-accent rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]" />
                Biblioteca de White Papers Técnicos
              </h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Recursos de alta ingeniería para la toma de decisiones críticas. 
                <span className="block text-sm font-semibold text-primary mt-1 uppercase tracking-wider">Acceso restringido para coordinados verificados.</span>
              </p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["Todos", "SITR", "PMGD", "SSCC", "BESS"].map((cat) => (
                <button key={cat} className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${cat === "Todos" ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "bg-card/40 border-white/5 text-muted-foreground hover:border-primary/40"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {!isLoggedIn && (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-background/20 rounded-3xl flex flex-col items-center justify-center border border-white/10 p-12 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.1)]">
                  <Lock className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white italic">Repositorio Protegido</h3>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Accede a manuales de integración, reportes de cumplimiento SITR/EDAC y auditorías PMGD. Inicia sesión con tu correo corporativo.
                  </p>
                </div>
                <Link href="/login" className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(var(--primary),0.2)]">
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
              },
              { 
                id: "prs-recuperacion",
                cat: "Resiliencia - NTSyCS V2025", 
                title: "Planes de Recuperación de Servicio (PRS)", 
                desc: "Protocolos de arranque en negro (Black Start), rutas de reposición y análisis de impacto económico por ENS.", 
                skills: ["skill_sscc", "skill_generacion"],
                status: "red"
              },
              { 
                id: "skill_edac_edag_erag",
                cat: "EDAC — Protección", 
                title: "Lógica de Desconexión en Sistemas BESS", 
                desc: "Tiempos de respuesta y coordinación de protecciones en almacenamiento de gran escala.", 
                skills: ["skill_edac_edag_erag"],
                status: "orange"
              },
              { 
                id: "skill_transmision",
                cat: "Transmisión Nacional", 
                title: "Protocolos de Ciberseguridad en RTUs IEC", 
                desc: "Implementación de Secure Authentication según Anexo Técnico de Ciberseguridad 2025.", 
                skills: ["skill_transmision", "skill_base_sitr"],
                status: "red"
              },
              { 
                id: "skill_distribucion_clientes",
                cat: "Distribución — VAD", 
                title: "Exigencias de Calidad para Clientes Libres", 
                desc: "Auditoría de registros de interrupción y penalizaciones bajo el nuevo esquema VAD.", 
                skills: ["skill_distribucion_clientes"],
                status: "blue"
              }
            ].map((paper, i) => (
              <div key={i} className={`group relative flex flex-col h-full rounded-3xl border border-white/10 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl p-8 transition-all duration-500 hover:border-primary/60 hover:shadow-[0_0_50px_rgba(var(--primary),0.1)] ${!isLoggedIn ? 'opacity-30 pointer-events-none grayscale blur-[2px]' : ''}`}>
                {/* Folder Tab Shape */}
                <div className="absolute -top-3 left-8 w-24 h-4 bg-card/40 border-t border-x border-white/10 rounded-t-xl group-hover:bg-primary/20 transition-colors" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_currentColor] ${paper.status === "red" ? "text-red-500 bg-red-500" : paper.status === "blue" ? "text-cyan-400 bg-cyan-400" : "text-orange-400 bg-orange-400"}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{paper.cat}</span>
                </div>

                <h4 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-primary transition-colors">{paper.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-10 flex-grow">{paper.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  {paper.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-background/60 border border-white/5 text-[9px] font-mono text-primary uppercase tracking-tighter shadow-inner opacity-80">{s}</span>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  {isLoggedIn ? (
                    <Link href={`/documentacion/${paper.id}`} className="text-xs font-black text-primary hover:underline flex items-center gap-2 group/link px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
                      LEER WHITE PAPER
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="text-xs font-black text-muted-foreground flex items-center gap-2">
                       CONTENIDO BLOQUEADO <Lock className="w-3 h-3" />
                    </div>
                  )}
                  {isLoggedIn && (
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-white/5">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground pb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Terminal className="w-5 h-5 text-primary/50" />
            </div>
            <div className="space-y-0.5">
              <span className="block font-black text-white/50 tracking-widest text-[10px]">CONECTA COMPLIANCE ENGINE</span>
              <span className="block text-[9px] font-mono opacity-50 uppercase">Build v1.0.4-LTS | Santiago, Chile</span>
            </div>
          </div>
          <p className="font-medium">© 2026 NormativaCEN.cl - Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default DocumentationPage;
