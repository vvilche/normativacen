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

  useEffect(() => {
    const registered = localStorage.getItem('isRegistered') === 'true';
    const profile = localStorage.getItem('userProfile');
    if (registered && profile) {
      setIsRegistered(true);
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleConsultar = () => {
    if (!isRegistered) {
      setIsModalOpen(true);
    } else {
      startProcessing();
    }
  };

  const startProcessing = () => {
    setProcessingStatus("processing");
    
    // Simulate thinking/orchestration time
    setTimeout(() => {
      const dynamicResolution = getResolutionByQuery(query);
      setResolutionData(dynamicResolution);
      setProcessingStatus("complete");
    }, 4000);
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

  // Content for when logged in & not processing
  const DashboardBody = () => {
    if (activeTab === "Biblioteca") {
        return (
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
        );
    }

    if (activeTab !== "Dashboard") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FileText className="w-16 h-16 text-accent mx-auto mb-6 opacity-40 animate-pulse" />
                    <h2 className="text-2xl font-black text-white mb-3 italic tracking-tight uppercase">Mantenimiento de Nodo</h2>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed font-medium">
                        La sección de <span className="text-accent underline decoration-accent/20 underline-offset-4">{activeTab}</span> está siendo sincronizada con el motor de inferencia <strong>Harness Tung V2.</strong>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {processingStatus === "idle" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-heading font-black text-white italic tracking-tighter leading-none">
                    Bienvenido al <span className="text-accent underline decoration-accent/30 underline-offset-[12px] uppercase">Harness Center</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-medium">
                    Activa el razonamiento multi-agente de cumplimiento para tus activos del SEN.
                    </p>
                </div>
                
                <div className="w-full max-w-2xl relative group">
                        <div className="absolute inset-0 bg-accent/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative bg-[#0B1221]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2.5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex items-center">
                            <div className="pl-5 pr-2 text-accent/50">
                                <Search className="w-7 h-7" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-transparent border-none text-white text-xl focus:outline-none placeholder-gray-600 py-5 font-semibold"
                                placeholder="Consultar requisitos SITR para BESS..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button 
                                onClick={handleConsultar}
                                className="bg-accent hover:bg-accent/90 text-white font-black py-4 px-8 rounded-2xl transition-all flex items-center gap-2 shadow-[0_8px_25px_rgba(45,108,223,0.4)] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
                            >
                                CONSULTAR <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                </div>
                </div>
            )}

            {processingStatus === "processing" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <HarnessMonitor status={processingStatus} />
                </div>
            )}

            {processingStatus === "complete" && resolutionData && (
                <DashboardView 
                    resolutionData={resolutionData}
                    recommendedPapers={getRecommendedPapers()}
                    onReset={() => {
                        setProcessingStatus("idle");
                        setQuery("");
                    }}
                />
            )}
        </div>
    );
  };

  // Landing view for unauthenticated users
  if (!isRegistered) {
    return (
      <main className="flex-1 flex flex-col items-center justify-start min-h-screen pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden bg-[#0B0F1A] font-sans">
        {/* Nav for Landing */}
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-white italic">
                <Zap className="w-6 h-6 text-accent" />
                <span>NormativaCEN</span>
            </div>
            <a href="/login" className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Acceso Corporativo
            </a>
        </nav>

        <div className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center mt-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-10 backdrop-blur-md"
            >
                <Zap className="w-4 h-4 shadow-[0_0_10px_rgba(45,108,223,0.5)]" />
                <span>Compliance Multi-Agente V6.0</span>
            </motion.div>
            
            <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 italic leading-tight">
                La Máquina de <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Compliance</span>
            </h1>

            <p className="text-xl text-gray-500 max-w-2xl mb-14 font-medium leading-relaxed">
                El primer orquestador inteligente diseñado para transformar la complejidad normativa del SEN en resoluciones técnicas accionables para ingenieros.
            </p>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-12 py-6 bg-accent rounded-3xl overflow-hidden transition-all hover:shadow-[0_0_60px_rgba(45,108,223,0.5)] active:scale-95"
            >
                <div className="relative flex items-center gap-3 text-white font-black tracking-widest uppercase text-sm">
                    Configurar Mi Entorno <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
        
        <footer className="mt-auto pt-20 text-center text-gray-800 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 NormativaCEN · Powered by Harness-Tung V6.2.4
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
      <DashboardBody />
    </DashboardLayout>
  );
}
