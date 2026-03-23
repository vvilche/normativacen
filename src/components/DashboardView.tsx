"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Share2, Printer, Download, Mail } from "lucide-react";
import { ResolutionCard } from "./ResolutionCard";
import { WhitePaperCard } from "./WhitePaperCard";
import { HarnessMonitor } from "./HarnessMonitor";
import { WhitePaper } from "@/lib/data/whitePapers";

interface DashboardViewProps {
  resolutionData: any;
  recommendedPapers: WhitePaper[];
  onReset: () => void;
}

export function DashboardView({ resolutionData, recommendedPapers, onReset }: DashboardViewProps) {
  return (
    <div className="w-full space-y-8">
      
      {/* Page Title & Actions */}
      <div className="flex justify-between items-center bg-white/5 p-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-accent rounded-full" />
            <h2 className="text-sm font-black text-white tracking-widest uppercase italic">
                CEN Intelligence Hub <span className="text-gray-600 font-technical ml-2">v7.2.4</span>
            </h2>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                <span>Exportar</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <button 
                onClick={onReset}
                className="flex items-center gap-2 text-[10px] text-accent font-black uppercase tracking-widest hover:underline"
            >
                NUEVA CONSULTA
                <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* Main Content Grid (High Density) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Resolution & Details (8/12) */}
        <div className="lg:col-span-8 space-y-6">
            <ResolutionCard 
                antecedentes={resolutionData.antecedentes}
                acciones={resolutionData.acciones}
                confianza={resolutionData.confianza}
                id={resolutionData.id}
                date={resolutionData.date}
                type={resolutionData.type}
                verdict={resolutionData.verdict}
                controls={resolutionData.controls}
                kpis={resolutionData.kpis}
            />
        </div>

        {/* Right: Traceability Timeline (4/12) */}
        <div className="lg:col-span-4 bg-[#161B29]/40 border border-white-[0.03] rounded-xl p-6 backdrop-blur-xl">
            <HarnessMonitor status="complete" />
        </div>
      </div>

      {/* Recommended White Papers Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">
                Engineering Library Recommendations
            </h3>
          </div>
          <span className="text-[9px] text-gray-700 font-technical uppercase">3 MATCHES FOUND</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedPapers.map((paper) => (
            <WhitePaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </section>
    </div>
  );
}
