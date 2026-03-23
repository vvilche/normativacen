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
                <>
                    {processingStatus === "idle" && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                            <div className="space-y-3 max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-[9px] font-black uppercase tracking-[0.25em] text-accent/60 mb-2">
                                    <Zap className="w-3 h-3" />
                                    <span>Harness Intelligence Hub v7.2</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-heading font-black text-white italic tracking-tighter leading-none">
                                    Orquestador de <span className="text-accent underline decoration-accent/20 underline-offset-[8px] uppercase">Cumplimiento</span>
                                </h1>
                                <p className="text-gray-500 text-base font-medium max-w-xl mx-auto">
                                    Activa el motor de razonamiento multi-agente para auditorías normativas del SEN.
                                </p>
                            </div>
                            
                            <div className="w-full max-w-xl relative group">
                                <div className="relative bg-[#161B29]/60 backdrop-blur-xl border border-white-[0.03] rounded-2xl p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center transition-all group-focus-within:border-accent/30 group-focus-within:bg-[#161B29]/80">
                                    <div className="pl-4 pr-1 text-gray-700">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none text-white text-lg focus:outline-none placeholder-gray-700 py-4 font-semibold px-2"
                                        placeholder="Consultar SITR para BESS..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleConsultar}
                                        className="bg-accent hover:bg-accent/90 text-white font-black py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,108,223,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[11px]"
                                    >
                                        EJECUTAR <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {processingStatus === "processing" && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <div className="bg-[#161B29]/40 border border-white-[0.03] rounded-2xl p-8 backdrop-blur-xl w-full max-w-md">
                                <HarnessMonitor status={processingStatus} />
                            </div>
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
                </>
            ) : (
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
            )}
        </div>
    </DashboardLayout>
  );
}
}
