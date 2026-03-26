"use client";

import { motion } from "framer-motion";
import { Search, Zap, ChevronRight, ShieldCheck, Database, Server, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { LeadGenModal } from "@/components/LeadGenModal";
import { HarnessMonitor } from "@/components/HarnessMonitor";
import { DashboardView } from "@/components/DashboardView";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WhitePaperCard } from "@/components/WhitePaperCard";
import { whitePapers } from "@/lib/data/whitePapers";
import { getResolutionByQuery } from "@/lib/resolutionEngine";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete">("idle");
  const [resolutionData, setResolutionData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const registered = localStorage.getItem('isRegistered') === 'true';
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

  const handleConsultar = () => {
    if (!isRegistered) {
      setIsModalOpen(true);
    } else {
      startProcessing();
    }
  };

  const startProcessing = async () => {
    setProcessingStatus("processing");
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: query }],
          userProfile
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Mapeo de formato estructurado: metrics[], hallazgo, seoTags
        const metrics = data.resolution?.metrics || [];
        
        // Generar controles desde las métricas Tung (cada métrica es un control)
        const controls = metrics.map((m: any, i: number) => ({
          id: `T.${i + 1}`,
          label: `${m.label}: ${m.value}`,
          status: m.status === "critical" || m.status === "warning" ? "FAIL" : "MET"
        }));

        // Determinar verdict y risk desde las métricas
        const hasCritical = metrics.some((m: any) => m.status === "critical");
        const hasWarning = metrics.some((m: any) => m.status === "warning");
        const verdict = hasCritical ? "NO CUMPLE" : hasWarning ? "CUMPLE PARCIAL" : "CUMPLE";
        const risk = hasCritical ? "Crítico" : hasWarning ? "Alto" : "Bajo";
        const score = hasCritical ? 40 : hasWarning ? 72 : 95;

        setResolutionData({
          id: `RES-${Date.now()}`,
          verdict,
          reasoning: data.content,
          hallazgo: data.hallazgo || null,
          seoTags: data.seoTags || [],
          protocol: "LangGraph-Engineering-Matrix",
          acciones: data.resolution?.actionPlan || [],
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
          ]
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Error en procesamiento IA:", error);
      setResolutionData({
        id: "error",
        verdict: "ERROR",
        reasoning: `Hubo un problema al procesar la solicitud: ${error.message || 'Error de conexión'}. Verifica el Orquestador.`,
        protocol: "Error-Handler",
        controls: [],
        kpis: { score: 0, risk: "Alto", latency: "0s", protocol: "N/A" },
        steps: []
      });
    } finally {
      setProcessingStatus("complete");
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

  // Landing view for unauthenticated users
  if (!isRegistered) {
    return (
      <main className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 pb-12 px-4 sm:px-6 relative overflow-hidden bg-[#0B0F1A] font-sans text-sm">
        {/* Nav for Landing */}
        <nav className="absolute top-0 w-full p-5 flex justify-between items-center z-50 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 font-heading font-black text-lg text-white italic tracking-tighter">
                <div className="w-5 h-5 rounded bg-accent flex items-center justify-center text-white text-[10px]">N</div>
                <span>NormativaCEN</span>
            </div>
            <a href="/login" className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                Login
            </a>
        </nav>

        <div className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center mt-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-[9px] font-black uppercase tracking-[0.25em] text-accent/60 mb-8 backdrop-blur-md"
            >
                <Zap className="w-3 h-3" />
                <span>Agentic Compliance Engine V7</span>
            </motion.div>
            
            <h1 className="font-heading text-6xl md:text-7xl font-black tracking-tighter text-white mb-6 italic leading-[0.9] uppercase">
                Compliance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Intelligence</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-12 font-medium leading-relaxed italic">
                De complejidad normativa a veredictos técnicos accionables. <br />
                Multi-agente. Tiempo real. Precisión industrial.
            </p>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-4 bg-accent rounded-2xl overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(45,108,223,0.4)] active:scale-95"
            >
                <div className="relative flex items-center gap-2 text-white font-black tracking-widest uppercase text-[12px]">
                    Comenzar Análisis <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </button>
        </div>

        <LeadGenModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={(profileData) => {
                setUserProfile(profileData);
                setIsRegistered(true);
                setIsModalOpen(false);
            }} 
        />
        
        <footer className="mt-auto pt-20 text-center text-gray-800 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
            © 2026 NormativaCEN · INDUSTRIAL COMPLIANCE V7.2.4
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
                    />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText className="w-16 h-16 text-accent mx-auto mb-6 opacity-40 animate-pulse" />
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em]">Sincronizando Base Normativa...</span>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed font-medium">
                            La sección de <span className="text-accent underline decoration-accent/20 underline-offset-4">{activeTab}</span> está siendo sincronizada con el motor de inferencia especializado.
                        </p>
                    </div>
                </div>
            )}
        </div>
    </DashboardLayout>
  );
}
