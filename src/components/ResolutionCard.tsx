"use client";

import { motion } from "framer-motion";
import { FileText, Download, Share2, Printer, Mail, CheckCircle2, MoreHorizontal } from "lucide-react";

interface Step {
  id: string;
  task: string;
  priority: "CRÍTICA" | "Alta" | "Media";
}

interface Evidence {
    source: string;
    text: string;
}

interface ResolutionProps {
  antecedentes: Evidence[];
  acciones: Step[];
  confianza: number;
  id?: string;
  date?: string;
  type?: string;
  verdict?: string;
}

export function ResolutionCard({ 
  id = "CEN-RM-2023-042", 
  date = "27 Oct 2023", 
  type = "Regulatorio",
  verdict = "El Phasor Measurement Unit (PMU) SEL-487E cumple con los requisitos de la norma CEN-REG-ELEC-2022 Sección 4.2 para Medición Sincrofasorial..."
}: ResolutionProps) {
  
  return (
    <div className="w-full space-y-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#0F172A]/40 backdrop-blur-3xl border border-[#38BDF8]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(56,189,248,0.1)] group overflow-hidden"
      >
        {/* Glow behind the card */}
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
          {/* Main Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
               <h3 className="text-xl font-heading font-black text-white tracking-tight">Resolución Nº {id} - PMU Compliance</h3>
            </div>
            
            <div className="flex items-center gap-6">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                 Fecha: <span className="text-gray-300">{date}</span>
               </span>
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                 Tipo: <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">{type}</span>
               </span>
            </div>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                <span className="text-white font-black">**Verdict Técnico:**</span> {verdict}
            </p>

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-4">
                <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <FileText className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Download className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Printer className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
          </div>

          {/* Status Badge Side */}
          <div className="flex flex-col items-center justify-center md:border-l border-white/10 md:pl-12 py-4">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Estado de Cumplimiento</p>
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-success shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-3xl font-heading font-black text-success tracking-tighter italic">CUMPLE</span>
            </div>
            <button className="mt-6 text-[10px] text-accent font-black uppercase tracking-widest hover:underline transition-all">
                Análisis detallado completo
            </button>
          </div>
        </div>
      </motion.div>
      <div className="text-center">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">Resolución Detallada PMU</p>
      </div>
    </div>
  );
}
