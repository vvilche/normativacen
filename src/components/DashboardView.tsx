"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Share2, Printer, Download, Mail } from "lucide-react";
import { ResolutionCard } from "./ResolutionCard";
import { WhitePaperCard } from "./WhitePaperCard";
import { WhitePaper } from "@/lib/data/whitePapers";

interface DashboardViewProps {
  resolutionData: any;
  recommendedPapers: WhitePaper[];
  onReset: () => void;
}

export function DashboardView({ resolutionData, recommendedPapers, onReset }: DashboardViewProps) {
  return (
    <div className="w-full space-y-10">
      
      {/* Page Title / Breadcrumb area */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-heading font-black text-white tracking-tight italic">
            NormativaCEN Dashboard
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span className="hover:text-accent cursor-pointer">Main</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300">Resoluciones</span>
        </div>
      </div>

      {/* Main Resolution Card (Banner Style) */}
      <ResolutionCard 
        antecedentes={resolutionData.antecedentes}
        acciones={resolutionData.acciones}
        confianza={resolutionData.confianza}
        id={resolutionData.id}
        date={resolutionData.date}
        type={resolutionData.type}
        verdict={resolutionData.verdict}
      />

      {/* Recommended White Papers Section */}
      <section className="space-y-6 pt-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xl font-heading font-black text-cyan-400 italic">
            Publicaciones Premium Recomendadas
          </h3>
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-gray-500 font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            AI-POWERED RECOMMENDATIONS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedPapers.map((paper) => (
            <WhitePaperCard key={paper.id} paper={paper} />
          ))}
        </div>

        {/* Pagination Dots (Mockup aesthetic) */}
        <div className="flex justify-center gap-2 pt-8">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="w-2 h-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer" />
            <div className="w-2 h-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer" />
        </div>
      </section>
    </div>
  );
}
