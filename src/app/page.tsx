"use client";

import { motion } from "framer-motion";
import { Zap, ChevronRight, ShieldCheck, Database, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { LeadGenModal } from "@/components/LeadGenModal";
import { DashboardView } from "@/components/DashboardView";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WhitePaperCard } from "@/components/WhitePaperCard";
import { whitePapers } from "@/lib/data/whitePapers";
import { ResolutionsView } from "@/components/ResolutionsView";
import { NormsView } from "@/components/NormsView";
import { Cpu, Activity, Layers, Globe, PenTool } from "lucide-react";

interface UserProfile {
  name: string;
  role: string;
  company: string;
  activeAsset?: string;
}

interface DashboardStats {
  globalScore: number;
  totalAssets: number;
  criticalRisks: number;
  totalExposureUTA: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete">("idle");
  const [resolutionData, setResolutionData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | undefined>(undefined);
  const [fastMode, setFastMode] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientMode, setClientMode] = useState<'guide' | 'expert'>('guide');

  useEffect(() => {
    const isTokenInCookie = document.cookie.includes('auth_token');
    const registered = localStorage.getItem('isRegistered') === 'true' || isTokenInCookie;
    const profile = localStorage.getItem('userProfile');
    if (registered && profile) {
      setIsRegistered(true);
      setUserProfile(JSON.parse(profile));
    }

    // Fetch dashboard stats
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setDashboardStats(data))
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

  useEffect(() => {
    const className = clientMode === 'guide' ? 'theme-guide' : 'theme-expert';
    document.body.classList.remove('theme-guide', 'theme-expert');
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove('theme-guide', 'theme-expert');
    };
  }, [clientMode]);

  const handleConsultar = () => {
    if (!isRegistered) {
      setIsModalOpen(true);
    } else {
      startProcessing();
    }
  };

  const buildResolutionFromResponse = (data: any) => {
    const metrics = data.resolution?.metrics || [];
    const controls = metrics.map((m: { label: string; value: string; status: string }, i: number) => ({
      id: `T.${i + 1}`,
      label: `${m.label}: ${m.value}`,
      status: m.status === "critical" || m.status === "warning" ? "FAIL" : "MET"
    }));
    const sanitizedActions = (data.resolution?.actionPlan || []).map((item: any, index: number) => {
      const cleanTask = typeof item.task === "string"
        ? item.task.replace(/[\*`_]/g, "").replace(/\s+/g, " ").trim()
        : '';
      return {
        id: item.id || `A${index + 1}`,
        task: cleanTask,
        priority: item.priority || 'Media',
        deadline: item.deadline || '30 días'
      };
    }).filter((item: any) => item.task && item.task !== '--' && item.task.length < 280);
    const hasCritical = metrics.some((m: { status: string }) => m.status === "critical");
    const hasWarning = metrics.some((m: { status: string }) => m.status === "warning");
    const verdict = hasCritical ? "NO CUMPLE" : hasWarning ? "CUMPLE PARCIAL" : "CUMPLE";
    const risk = hasCritical ? "Crítico" : hasWarning ? "Alto" : "Bajo";
    const score = hasCritical ? 40 : hasWarning ? 72 : 95;

    return {
      id: data.resolutionId || `RES-${Date.now()}`,
      resolutionId: data.resolutionId,
      verdict,
      reasoning: data.content,
      hallazgo: data.hallazgo || null,
      seoTags: data.seoTags || [],
      guideSuggestions: data.guideSuggestions || [],
      protocol: "LangGraph-Engineering-Matrix",
      acciones: sanitizedActions,
      controls,
      kpis: {
        score,
        risk,
        latency: "2.4s",
        protocol: "NTSyCS 2025"
      },
      steps: [
        { id: 1, agent: "Orquestador Tung", action: "Clasificando perfil de Coordinado", status: "complete" },
        { id: 2, agent: "Motor RAG", action: "Explorando base de datos normativa", status: "complete" },
        { id: 3, agent: "Especialista CEN", action: "Analizando evidencia normativa", status: "complete" }
      ],
      timings: data.timings || {}
    };
  };

  const runBackgroundAudit = async (originalQuery: string) => {
    if (!userProfile) return;
    setIsAuditing(true);
    setAuditError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: originalQuery }],
          userProfile,
          fastMode: false,
          backgroundAudit: true,
          clientMode
        })
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({ error: "Auditoría fallida" }));
        throw new Error(errorPayload.error || "Auditoría fallida");
      }

      const auditedData = await response.json();
      setResolutionData(buildResolutionFromResponse(auditedData));
    } catch (err: any) {
      console.error("Error en auditoría de fondo:", err);
      setAuditError(err.message || "Auditoría no disponible");
    } finally {
      setIsAuditing(false);
    }
  };

  const startProcessing = async () => {
    const executionQuery = query.trim();
    if (!executionQuery) return;
    setProcessingStatus("processing");
    setIsAuditing(false);
    setAuditError(null);
    setErrorMessage(null);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: executionQuery }],
          userProfile,
          clientMode,
          fastMode
        })
      });
      
      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            errorData = { error: response.status === 504 ? "TIMEOUT: El proceso de la IA superó el límite de tiempo de Netlify." : "ERROR DE SERVIDOR", details: text.substring(0, 100) };
          }
        } catch {
          errorData = { error: "FALLO FATAL", details: "No se pudo leer la respuesta del servidor." };
        }
        throw new Error(errorData.error || "Fallo en la sincronización del Orquestador");
      }
      
      const data = await response.json();
      
      setResolutionData(buildResolutionFromResponse(data));
      if (fastMode) {
        runBackgroundAudit(executionQuery);
      }
    } catch (error: any) {
      console.error("Error en procesamiento IA:", error);
      const errorMessage = error.message || "Error desconocido en el Orquestador";
      setErrorMessage(errorMessage);
      setResolutionData({
        id: "INFRA-ERROR",
        verdict: `ERROR CRÍTICO: ${errorMessage}`,
        reasoning: `Se detectó un fallo en la infraestructura del Orquestador.\n\n[DETALLE TÉCNICO]: ${errorMessage}\n\n[ACCIÓN]: Si es un TIMEOUT, intenta con una consulta más simple o revisa las variables de entorno en Netlify.`,
        protocol: "System-Diagnostic",
        controls: [],
        kpis: { 
          score: 0, 
          risk: "CRÍTICO", 
          latency: "0s", 
          protocol: "N/A" 
        },
        steps: []
      });
    } finally {
      setProcessingStatus("complete");
    }
  };

  const handleTestSystem = async () => {
    try {
      const res = await fetch('/api/test-infra');
      const data = await res.json();
      alert(`DIAGNÓSTICO DE SISTEMA (v9.2.2):\n\nStatus: ${data.status}\n\nDetalles:\n- Google AI: ${data.diagnostics.google_ai}\n- Database: ${data.diagnostics.database}\n- Messaging: ${data.diagnostics.messaging}\n\nRecomendación: ${data.recommendation}`);
    } catch {
      alert("Error crítico al ejecutar el diagnóstico. El servidor podría estar offline.");
    }
  };

  const getRecommendedPapers = () => {
    const q = query.toLowerCase();
    if (q.includes("pmu")) {
      return whitePapers.filter(p => p.tags.includes("PMU") || p.tags.includes("NTSyCS") || p.category.includes("SITR"));
    }
    if (q.includes("bess") || userProfile?.activeAsset?.toLowerCase().includes("bess")) {
      return whitePapers.filter(p => p.tags.includes("BESS"));
    }
    return whitePapers.slice(0, 3);
  };

  if (!isRegistered) {
    return (
      <main className="flex-1 flex flex-col items-center justify-start min-h-screen bg-[#0B0F1A] font-sans selection:bg-gold/30 selection:text-gold relative overflow-x-hidden">

        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 px-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 font-premium font-black text-xl text-white tracking-widest"
            >
                <div className="w-6 h-6 rounded bg-gold flex items-center justify-center text-black text-[12px] shadow-gold">N</div>
                <span>NORMATIVA<span className="text-gold">CEN</span></span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <a href="/login" className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
                    Acceso Cliente
                </a>
            </motion.div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/5 border border-gold/10 text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-10 backdrop-blur-xl"
            >
                <Zap className="w-3.5 h-3.5 fill-gold" />
                <span>Agentic Compliance Matrix v9.2.0 (Asset-Aware)</span>
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-premium text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 max-w-5xl"
            >
                COMPLIANCE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">INTELLIGENCE</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 max-w-2xl mb-14 font-medium leading-relaxed"
            >
                De complejidad regulatoria a <span className="text-white border-b-2 border-gold/40">veredictos técnicos</span> accionables. <br />
                Multi-agente. Orquestado. Industrial.
            </motion.p>

            <motion.button 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsModalOpen(true)}
                className="group relative px-12 py-5 bg-gold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-gold"
            >
                <div className="relative flex items-center gap-3 text-black font-black tracking-[0.2em] uppercase text-[13px]">
                    Comenzar Análisis Técnico <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </motion.button>
        </section>

        {/* --- FEATURES GRID (The 8 Agents) --- */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
            <div className="text-center mb-16">
                <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">Arquitectura de Inferencia</h2>
                <h3 className="text-3xl text-white font-premium mb-4">9 Agentes Especializados</h3>
                <div className="w-12 h-1 bg-gold mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: ShieldCheck, name: "Agente SITR", desc: "Monitoreo PMU y telemetría crítica." },
                    { icon: Database, name: "InfoTécnica", desc: "Consulta de fichas técnicas y activos del SEN." },
                    { icon: Cpu, name: "Orquestador Tung", desc: "Gobernanza y ruteo semántico entre especialistas." },
                    { icon: ShieldCheck, name: "Ciberseguridad", desc: "Auditoría NERC CIP y seguridad perimetral OT." },
                    { icon: FileText, name: "Económico", desc: "Cálculo de multas UTA y remuneración SSCC." },
                    { icon: Activity, name: "Generación/BESS", desc: "Modelado de inyección reactiva y FFR." },
                    { icon: Layers, name: "Transmisión", desc: "Integridad de red STN y observabilidad." },
                    { icon: Globe, name: "Consumo/EDAC", desc: "Validación de esquemas de desconexión de carga." },
                    { icon: PenTool, name: "Auditor de Calidad", desc: "Refinamiento normativo y reportes ejecutivos." }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5, backgroundColor: "rgba(234, 179, 8, 0.05)" }}
                        className="p-8 rounded-[32px] bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl transition-all group"
                    >
                        <feature.icon className="w-8 h-8 text-gold mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-white font-black text-[13px] uppercase tracking-widest mb-3">{feature.name}</h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed font-medium">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* --- LIVE EVIDENCE (Mockup) --- */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-40 flex flex-col items-center">
             <div className="w-full rounded-[40px] border border-white/5 bg-black/40 p-8 backdrop-blur-2xl shadow-2xl relative group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 blur-[60px] rounded-full animate-pulse" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">In-Line Resolution Preview</span>
                </div>
                
                <div className="space-y-4">
                    <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                    <div className="grid grid-cols-3 gap-4 pt-8">
                        <div className="h-20 rounded-2xl bg-gold/5 border border-gold/10" />
                        <div className="h-20 rounded-2xl bg-white/5 border border-white/10" />
                        <div className="h-20 rounded-2xl bg-white/5 border border-white/10" />
                    </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="px-6 py-3 rounded-full bg-gold text-black font-black uppercase tracking-widest text-[10px] shadow-gold scale-90 group-hover:scale-100 transition-transform">
                        Ver Demo Interactiva
                    </div>
                </div>
             </div>
        </section>

        <LeadGenModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={(profileData) => {
                setUserProfile(profileData);
                setIsRegistered(true);
                setIsModalOpen(false);
            }} 
        />
        
        <footer className="relative z-10 w-full border-t border-white/5 py-20 px-6 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-3 font-premium font-black text-xl text-white tracking-widest">
                    <div className="w-5 h-5 rounded bg-white flex items-center justify-center text-black text-[10px]">N</div>
                    <span>NORMATIVA<span className="text-white">CEN</span></span>
                </div>
                <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-white">
                    <span>Industrial Intelligence</span>
                    <span>Multi-Agent Engine</span>
                    <span>ISO 2025 Compliance</span>
                </div>
                <p className="text-[9px] text-white text-right">© 2026 NormativaCEN · Industrial Excellence</p>
            </div>
        </footer>
      </main>
    );
  }

  // Dashboard view for registered users
  return (
    <DashboardLayout 
        user={userProfile} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
    >
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-[11px] font-black uppercase tracking-[0.3em] px-4 py-3 rounded-xl">
                {errorMessage}
              </div>
            )}
            {activeTab === "Biblioteca" ? (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                        <h2 className="text-3xl font-heading font-black text-white italic">Biblioteca Técnica Premium</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whitePapers.map((paper) => (
                            <WhitePaperCard key={paper.id} paper={paper} />
                        ))}
                    </div>
                </div>
            ) : activeTab === "Resoluciones" ? (
                <ResolutionsView />
            ) : activeTab === "Normas" ? (
                <NormsView />
            ) : activeTab === "Dashboard" ? (
                    <DashboardView 
                        resolution={resolutionData}
                        stats={dashboardStats}
                        processingStatus={processingStatus}
                        recommendedPapers={getRecommendedPapers()}
                        query={query}
                        setQuery={setQuery}
                        onExecute={handleConsultar}
                        onReset={() => {
                            setProcessingStatus("idle");
                            setQuery("");
                            setResolutionData(null);
                        }}
                        onTestSystem={handleTestSystem}
                        fastMode={fastMode}
                        setFastMode={setFastMode}
                        isAuditing={isAuditing}
                        auditError={auditError}
                        clientMode={clientMode}
                        setClientMode={setClientMode}
                    />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="bg-[#161B29]/40 p-16 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group max-w-2xl">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8 shadow-gold">
                            <Activity className="w-10 h-10 text-gold animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-heading font-black text-white italic mb-2 uppercase tracking-tighter">Sincronización en Curso</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium mb-8">
                            El módulo de <span className="text-gold uppercase font-black">{activeTab}</span> está siendo integrado con la matriz de 9 agentes especializados. La base normativa CEN 2025 está en proceso de indexación.
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </DashboardLayout>
  );
}
