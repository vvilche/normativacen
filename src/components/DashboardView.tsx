"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { 
  Sparkles, 
  ChevronRight, 
  Share2, 
  Printer, 
  Download, 
  Mail,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Zap,
  Search,
  Cpu,
  Database,
  ShieldAlert,
  DollarSign
} from "lucide-react";
import { ResolutionCard } from "./ResolutionCard";
import { WhitePaperCard } from "./WhitePaperCard";
import { HarnessMonitor } from "./HarnessMonitor";
import { WhitePaper } from "@/lib/data/whitePapers";

interface DashboardStats {
  globalScore: number;
  totalAssets: number;
  criticalRisks: number;
  totalExposureUTA: number;
}

interface DashboardViewProps {
  resolution?: any;
  stats?: DashboardStats;
  processingStatus: "idle" | "processing" | "complete";
  recommendedPapers: WhitePaper[];
  onReset: () => void;
  onExecute: (query: string) => void;
  query: string;
  setQuery: (q: string) => void;
}

export function DashboardView({ 
  resolution, 
  stats, 
  processingStatus,
  recommendedPapers, 
  onReset,
  onExecute,
  query,
  setQuery
}: DashboardViewProps) {

  const defaultStats = {
    globalScore: 88.5,
    totalAssets: 9,
    criticalRisks: 3,
    totalExposureUTA: 12500
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="w-full space-y-8 pb-20">
      
      {/* Top Strategic Row Removed per User Request (De-cluttering) */}

      {/* Search / Command Bar - Integrated into the Hub */}
      {processingStatus === "idle" && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto py-12"
        >
            <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-heading font-bold text-white italic tracking-tight uppercase font-technical">
                    Orquestador de <span className="text-gold underline decoration-gold/20 underline-offset-8">Cumplimiento</span>
                </h2>
                <p className="text-gray-400 text-sm font-medium">Activa el motor de razonamiento multi-agente para auditorías normativas del SEN.</p>
            </div>
            
            <div className="relative group">
                <div className="relative bg-[#161B29]/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 shadow-2xl flex items-center transition-all focus-within:border-accent/30">
                    <div className="pl-4 pr-1 text-gray-700">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-transparent border-none text-white text-lg focus:outline-none placeholder-slate-500 py-4 font-semibold px-2"
                        placeholder="Consultar SITR para BESS..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onExecute(query)}
                    />
                    <button 
                        onClick={() => onExecute(query)}
                        className="bg-gold hover:bg-gold/90 text-black font-black py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-gold hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[11px]"
                    >
                        EJECUTAR <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
      )}

      {/* Processing State */}
      {processingStatus === "processing" && (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-[#161B29]/40 border border-white/5 rounded-2xl p-10 backdrop-blur-3xl w-full max-w-xl shadow-2xl">
                <HarnessMonitor status="processing" />
            </div>
        </div>
      )}

      {/* Result State */}
      {processingStatus === "complete" && resolution && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
          {/* Page Title & Actions */}
          <div className="flex justify-between items-center bg-white/5 p-4 py-3 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-gold rounded-full shadow-gold animate-pulse" />
                <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase italic flex items-center gap-2">
                    CEN Intelligence Hub <span className="text-slate-500 font-technical px-2 py-0.5 rounded bg-white/5 lowercase">v9.2.1</span>
                    <span className="text-[10px] text-gold animate-pulse shadow-gold">● LIVE</span>
                </h2>
            </div>
            <div className="flex items-center gap-5">
                <button className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors group">
                    <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Compartir</span>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-[9px] text-gold font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all"
                >
                    NUEVA CONSULTA
                    <ChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-9 space-y-6">
                <ResolutionCard 
                    antecedentes={resolution?.antecedentes}
                    acciones={resolution?.acciones}
                    confianza={resolution?.confianza}
                    id={resolution?.id}
                    date={resolution?.date}
                    type={resolution?.type}
                    verdict={resolution?.verdict}
                    controls={resolution?.controls}
                    kpis={resolution?.kpis}
                    hallazgo={resolution?.hallazgo}
                    seoTags={resolution?.seoTags}
                />
            </div>

            <div className="lg:col-span-3 bg-[#161B29]/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-4">Trazabilidad Multi-Agente</h4>
                <HarnessMonitor status="complete" />
            </div>
          </div>
        </div>
      )}

      {/* Recommended White Papers Section - Only show when idle to keep results focused */}
      {processingStatus === "idle" && (
        <section className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">
                  Engineering Library Recommendations
              </h3>
            </div>
            <span className="text-[9px] text-slate-500 font-technical uppercase">3 MATCHES FOUND</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedPapers.map((paper) => (
              <WhitePaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
        highlight 
          ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
          : 'bg-[#161B29]/60 border-white/5 hover:border-gold/30'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-2 font-technical">{sub}</p>
    </motion.div>
  );
}
