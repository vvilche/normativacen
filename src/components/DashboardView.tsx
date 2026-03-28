"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Sparkles, 
  ChevronRight, 
  Share2, 
  Activity,
  Search,
  Loader2
} from "lucide-react";
import { ResolutionCard } from "./ResolutionCard";
import { WhitePaperCard } from "./WhitePaperCard";
import { HarnessMonitor } from "./HarnessMonitor";
import { WhitePaper } from "@/lib/data/whitePapers";
import Link from "next/link";

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
  onTestSystem?: () => void;
  fastMode: boolean;
  setFastMode: (value: boolean) => void;
  isAuditing: boolean;
  auditError?: string | null;
  clientMode: "guide" | "expert";
  setClientMode: (mode: "guide" | "expert") => void;
}

export function DashboardView({ 
  resolution, 
  stats,
  processingStatus,
  recommendedPapers, 
  onReset,
  onExecute,
  query,
  setQuery,
  onTestSystem,
  fastMode,
  setFastMode,
  isAuditing,
  auditError,
  clientMode,
  setClientMode
}: DashboardViewProps) {

  const guidePrompts = [
    "¿Qué es el SITR y qué debo reportar al CEN?",
    "Pasos básicos para actualizar el PMUS 2026",
    "Checklist EDAC mínimo antes de una auditoría"
  ];

  const expertPrompts = [
    "Mi GPS no está estampando la hora. ¿Qué consecuencias tengo?",
    "El enlace SITR supera 500ms. ¿Cómo normalizo rápido?",
    "Plan inmediato para BESS 20MW con CIP-013 y FFR <200ms"
  ];

  const guideModules = [
    { title: "Intro a Estándares CEN", description: "Marco regulatorio fundamental del CEN.", status: "completado" },
    { title: "Cumplimiento Operativo", description: "Cómo reportar telemetría en tiempo real.", status: "progreso" },
    { title: "Anexos Técnicos", description: "Requisitos específicos de transmisión/distribución.", status: "pendiente" },
  ];

  const expertModules = [
    { title: "Plan de Respuesta SITR", description: "Remediaciones para telemetría lenta.", status: "progreso" },
    { title: "FFR & PMU Upgrades", description: "Parámetros críticos para evitar multas.", status: "pendiente" },
    { title: "Auditoría PMUS", description: "Documentación previa y flujos SEC.", status: "completado" },
  ];

  const prompts = clientMode === "guide" ? guidePrompts : expertPrompts;
  const modules = clientMode === "guide" ? guideModules : expertModules;
  const heroCopy = clientMode === "guide"
    ? {
        title: "Centro Educativo NormativaCEN",
        subtitle: "Optimiza tu operación con rutas de aprendizaje y respuestas explicativas basadas en la normativa vigente.",
        primaryCTA: "Iniciar Capacitación",
        secondaryCTA: "Dudas Generales",
      }
    : {
        title: "Inteligencia Operativa Normativa",
        subtitle: "Activa el orquestador multi-agente para diagnosticar incidentes y evitar multas en minutos.",
        primaryCTA: "Auditar Instalaciones",
        secondaryCTA: "Reportar Incidente",
      };

  return (
    <div className="w-full space-y-8 pb-20">
      
      {/* Top Strategic Row Removed per User Request (De-cluttering) */}

      {/* Search / Command Bar - Integrated into the Hub */}
      {processingStatus === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <section className="hero-section">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-[0.5em] opacity-80">
                {clientMode === "guide" ? "Modo Guía" : "Modo Operativo"}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {heroCopy.title}
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-2xl">
                {heroCopy.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 hero-actions">
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold uppercase tracking-[0.3em] text-xs">
                  {heroCopy.primaryCTA}
                </button>
                <button className="bg-white/20 border border-white/40 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-[0.3em] text-xs">
                  {heroCopy.secondaryCTA}
                </button>
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h5 className="text-sm font-bold uppercase tracking-[0.4em] mb-4 text-white/80">
                Consultas sugeridas
              </h5>
              <ul className="space-y-3 text-sm">
                {prompts.map((item, idx) => (
                  <li key={idx} className="bg-white/10 border border-white/15 rounded-lg p-3">
                    “{item}”
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div key={module.title} className="learning-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
                    {module.status.toUpperCase()}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ background: module.status === "completado" ? "#10B981" : module.status === "progreso" ? "#FFBA38" : "#CBD5F5" }} />
                </div>
                <h4 className="text-lg font-bold mb-1">{module.title}</h4>
                <p className="text-sm opacity-70">{module.description}</p>
              </div>
            ))}
          </div>

          <div className="search-panel space-y-4">
            <div className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/5 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none text-base focus:outline-none"
                  placeholder="Describe tu incidente o consulta normativa..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onExecute(query)}
                />
                <button
                  onClick={() => onExecute(query)}
                  className="bg-primary text-on-primary px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.4em]"
                >
                  Ejecutar
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.3em] font-black">
              <div className="flex items-center gap-2">
                <span>Modo Rápido</span>
                <button
                  type="button"
                  onClick={() => setFastMode(!fastMode)}
                  className={`px-3 py-1 rounded-full border text-[9px] tracking-[0.3em] ${fastMode ? "bg-primary/10 border-primary text-primary" : "border-slate-300 text-slate-500"}`}
                >
                  {fastMode ? "ON" : "OFF"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClientMode("guide")}
                  className={`px-4 py-2 rounded-full border ${clientMode === "guide" ? "bg-primary text-white" : "border-slate-300 text-slate-500"}`}
                >
                  Exploratorio
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode("expert")}
                  className={`px-4 py-2 rounded-full border ${clientMode === "expert" ? "bg-primary text-white" : "border-slate-300 text-slate-500"}`}
                >
                  Operativo
                </button>
              </div>
            </div>
            <p className="text-[11px] opacity-70">
              {clientMode === "guide"
                ? "Recibirás respuestas educativas con sugerencias y módulos de capacitación."
                : "Obtendrás diagnósticos técnicos con checklists, riesgos y tiempos de ejecución."}
            </p>
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
                    CEN Intelligence Hub <span className="text-slate-500 font-technical px-2 py-0.5 rounded bg-white/5 lowercase">v9.2.2</span>
                    <span className="text-[10px] text-gold animate-pulse shadow-gold">● LIVE</span>
                </h2>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <button 
                  onClick={onTestSystem}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20 text-[9px] font-black text-accent uppercase tracking-widest hover:bg-accent/20 transition-all"
                >
                  <Activity className="w-3 h-3" /> Diagnóstico de Sistemas
                </button>
                {stats && (
                  <span className="text-[9px] text-white/60 font-technical uppercase tracking-widest">
                    Score Global: {stats.globalScore}% · Activos: {stats.totalAssets}
                  </span>
                )}
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded ${clientMode === 'guide' ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                  {clientMode === 'guide' ? 'Modo Guía' : 'Modo Operativo'}
                </span>
            </div>
            <div className="flex items-center gap-5">
                <button className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors group">
                    <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Compartir</span>
                </button>
                {resolution?.resolutionId && (
                  <Link
                    href={`/documentacion/dossier?resolutionId=${resolution.resolutionId}`}
                    target="_blank"
                    className="flex items-center gap-2 text-[9px] text-accent font-black uppercase tracking-[0.3em] border border-accent/30 px-3 py-1 rounded-lg hover:bg-accent/10 transition-all"
                  >
                    Dossier Técnico
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <div className="h-4 w-px bg-white/10" />
                <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-[9px] text-gold font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all"
                >
                    NUEVA CONSULTA
                    <ChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
                </button>
            </div>
            {isAuditing && (
              <div className="mt-3 flex items-center gap-2 text-[10px] text-accent font-black uppercase tracking-[0.25em]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Auditoría profunda en curso...
              </div>
            )}
            {auditError && (
              <p className="mt-2 text-[10px] text-red-400 uppercase tracking-[0.2em]">{auditError}</p>
            )}
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
                    reasoning={resolution?.reasoning}
                    timings={resolution?.timings}
                    guideSuggestions={resolution?.guideSuggestions}
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
