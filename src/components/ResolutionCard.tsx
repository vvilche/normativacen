"use client";

import { motion } from "framer-motion";
import { FileText, Download, Share2, Printer, Mail, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
  controls?: any[];
  kpis?: any;
}

export function ResolutionCard({ 
  id = "CEN-RM-2023-042", 
  date = "27 Oct 2023", 
  type = "Regulatorio",
  verdict = "El Phasor Measurement Unit (PMU) SEL-487E cumple con los requisitos de la norma CEN-REG-ELEC-2022 Sección 4.2 para Medición Sincrofasorial...",
  controls = [],
  kpis = { score: "94.2%", risk: "LOW", protocol: "v1.4", latency: "45ms" }
}: ResolutionProps) {
  
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 border-white-[0.03] relative overflow-hidden group"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-0.5">Technical Compliance Overview</h3>
                    <p className="text-xs font-technical text-white/90">Agent: <span className="text-accent">Aegis_AI_v7.2</span> | ID: {id}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mb-0.5">Controls Met</p>
                    <p className="text-xs font-technical text-success">
                        {controls.filter(c => c.status === "MET").length} / {controls.length}
                    </p>
                </div>
                <div className="h-6 w-px bg-white/5" />
                <div className="text-right">
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mb-0.5">Risk Level</p>
                    <p className={cn(
                        "text-xs font-technical",
                        kpis.risk === "LOW" ? "text-success" : kpis.risk === "MEDIUM" ? "text-warning" : "text-danger"
                    )}>
                        {kpis.risk}
                    </p>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Verdict Panel */}
          <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-4 relative overflow-hidden group/verdict">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover/verdict:opacity-100 transition-opacity">
                <div className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center",
                    kpis.risk === "LOW" ? "border-success text-success" : "border-warning text-warning"
                )}>
                    <CheckCircle2 className="w-4 h-4" />
                </div>
            </div>
            <div className={cn(
                "inline-flex items-center gap-2 mb-3 px-2 py-0.5 rounded border",
                kpis.risk === "LOW" ? "bg-success/10 border-success/20 text-success" : "bg-warning/10 border-warning/20 text-warning"
            )}>
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", kpis.risk === "LOW" ? "bg-success" : "bg-warning")} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                    Verdict: {kpis.risk === "LOW" ? "Certified" : "Caution Required"}
                </span>
            </div>
            
            <p className="text-[13px] text-gray-300 leading-relaxed font-medium italic">
                {verdict}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-4">
                <div>
                    <span className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em] block mb-1">Protocol</span>
                    <span className="text-[10px] font-technical text-white/60">{kpis.protocol}</span>
                </div>
                <div>
                    <span className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em] block mb-1">Latency</span>
                    <span className="text-[10px] font-technical text-white/60">{kpis.latency}</span>
                </div>
                <div>
                    <span className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em] block mb-1">Compliance Score</span>
                    <span className={cn(
                        "text-[10px] font-technical font-black",
                        parseInt(kpis.score) > 90 ? "text-success" : "text-warning"
                    )}>{kpis.score}</span>
                </div>
            </div>
          </div>

          {/* Controls Mini List */}
          <div className="w-full md:w-64 space-y-2">
            <div className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em] mb-3">Compliance Controls</div>
            {controls.map(ctrl => (
                <div key={ctrl.id} className="flex items-center justify-between text-[10px] bg-white/5 p-2 px-3 rounded border border-transparent hover:border-white/5 hover:bg-white/10 transition-all font-technical">
                    <span className="text-gray-500">{ctrl.id}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 text-[9px] uppercase tracking-tighter truncate max-w-[80px]">{ctrl.label}</span>
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-[0_0_5px]",
                            ctrl.status === "MET" ? "bg-success shadow-success/50" : "bg-danger shadow-danger/50"
                        )} />
                    </div>
                </div>
            ))}
            <button className="w-full py-1 text-[8px] text-gray-600 font-black uppercase tracking-widest hover:text-accent transition-colors pt-2">
                Descargar Reporte Técnico (.pdf)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
