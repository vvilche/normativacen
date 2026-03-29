"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, ShieldAlert, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ReportExportButton = dynamic(() => import("./ReportExportButton").then(mod => mod.ReportExportButton), { 
  ssr: false,
  loading: () => <div className="w-full h-10 bg-white/5 animate-pulse rounded-lg" />
});

interface Step {
  id: string;
  task: string;
  priority: "CRÍTICA" | "Alta" | "Media" | "ALTA";
  deadline: string;
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
  hallazgo?: string;
  seoTags?: string[];
  reasoning?: string;
  timings?: Record<string, number>;
  guideSuggestions?: string[];
  steps?: { id: number | string; agent: string; action: string; status: string }[];
  clientMode?: "guide" | "expert";
  showSteps?: boolean;
}

export function ResolutionCard({ 
  id = "CEN-RM-2023-042", 
  date = "27 Oct 2023", 
  type = "Regulatorio",
  verdict = "El Phasor Measurement Unit (PMU) SEL-487E cumple con los requisitos de la norma CEN-REG-ELEC-2022 Sección 4.2 para Medición Sincrofasorial...",
  controls = [],
  kpis = { score: "94.2%", risk: "LOW", protocol: "v1.4", latency: "45ms" },
  hallazgo,
  seoTags = [],
  acciones = [],
  reasoning,
  timings,
  guideSuggestions,
  steps = [],
  clientMode = "expert",
  showSteps = false
}: ResolutionProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 relative overflow-hidden group"
        data-mode={clientMode}
      >
        {/* Compact Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-gold">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Informe técnico</p>
                    <p className="text-sm font-technical text-white">
                        Agente: <span className="text-gold">NormativaCEN Orchestrator</span> · ID: {id}
                    </p>
                    <p className="text-xs font-technical text-white/60">Tipo: {type}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Nivel de riesgo</p>
                    <p className={cn(
                        "text-sm font-technical",
                        kpis.risk === "LOW" ? "text-success" : kpis.risk === "MEDIUM" ? "text-warning" : "text-danger"
                    )}>
                        {kpis.risk}
                    </p>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Verdict Panel */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 relative overflow-hidden group/verdict">
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
            
            <p className="text-sm text-white/90 leading-relaxed font-medium">
                {verdict}
            </p>
            {reasoning && (
              <div className="mt-4">
                <div className={cn("markdown-output text-sm transition-all text-white/80", expanded ? "" : "clamped") }>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {reasoning}
                  </ReactMarkdown>
                </div>
                <button
                  className="text-xs text-gold uppercase tracking-[0.3em] mt-3"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Mostrar menos" : "Mostrar más"}
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/10 pt-4 text-sm">
                <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] block mb-1 text-white/60">Protocolo</span>
                    <span className="font-technical text-white">{kpis.protocol}</span>
                </div>
                <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] block mb-1 text-white/60">Latencia</span>
                    <span className="font-technical text-white">{kpis.latency}</span>
                </div>
                <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] block mb-1 text-white/60">Score</span>
                    <span className={cn(
                        "font-technical font-black",
                        parseInt(kpis.score) > 90 ? "text-success" : "text-warning"
                    )}>{kpis.score}</span>
                </div>
            </div>
            {timings && Object.keys(timings).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs text-white/70">
                {Object.entries(timings).map(([label, value]) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <span className="block uppercase tracking-[0.2em] text-[11px] text-white/50">{label.replace(/_/g, " ")}</span>
                    <span className="font-black text-white text-sm">{(value / 1000).toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            )}

            {guideSuggestions && guideSuggestions.length > 0 && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-2">Capacitación recomendada</p>
                <ul className="space-y-1 text-sm text-white/80 list-disc list-inside">
                  {guideSuggestions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showSteps && steps && steps.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-3">Flujo de agentes</p>
              <ol className="space-y-3">
                {steps.map((step) => (
                  <li key={step.id} className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <div className="flex-1">
                      <p className="font-semibold">{step.agent}</p>
                      <p className="text-white/60 text-sm">{step.action}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">{step.status}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
            <ReportExportButton report={{ 
                id: id || "PENDING", 
                title: `Informe Técnico: ${id || 'AUDIT'}`,
                coordinado: "Empresa Coordinada",
                agentType: "Orchestrator",
                verdict: verdict || "", 
                date: date || "", 
                hallazgo: hallazgo || "", 
                seoTags: seoTags || [],
                normativeReferences: [],
                actionPlan: acciones.map(a => ({ ...a, deadline: a.deadline || "30 días" })),
                metrics: controls.map(c => ({ 
                    label: c.label, 
                    value: 'CHECKED', 
                    status: c.status === 'MET' ? 'success' : 'critical' 
                })) 
            }} />
        </div>

        {/* Recommended Action Plan (New Section) */}
        {acciones && acciones.length > 0 && (
          <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-gold shadow-gold" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Recommended Action Plan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acciones.map((action) => (
                      <div key={action.id} className="bg-white/5 border border-white/5 rounded-lg p-3 group/item hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-technical text-gold font-black">{action.id}</span>
                              <span className={cn(
                                  "text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter",
                                  action.priority === "CRÍTICA" ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"
                                )}>
                                  {action.priority}
                              </span>
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium leading-tight group-hover/item:text-white transition-colors capitalize">
                              {action.task}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
        )}

        {/* SEO Tags Footer */}
        {seoTags && seoTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {seoTags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold/5 border border-gold/10 text-[9px] font-black text-gold/80 uppercase tracking-widest">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                    </div>
                ))}
            </div>
        )}
      </motion.div>
    </div>
  );
}
