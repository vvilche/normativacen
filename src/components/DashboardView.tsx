"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  Sparkles,
  ChevronRight,
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
  onExecute: (query?: string) => void;
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

  const isGuide = clientMode === "guide";
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

  const statusToProgress: Record<string, number> = {
    completado: 100,
    progreso: 55,
    pendiente: 25,
  };

  const heroMetrics = stats
    ? [
        { label: "Score Global", value: `${stats.globalScore}%` },
        { label: "Activos", value: `${stats.totalAssets}` },
        { label: "Riesgos Críticos", value: `${stats.criticalRisks}` },
      ]
    : [
        { label: "Score Global", value: "--" },
        { label: "Activos", value: "--" },
      ];

  const canExecute = query.trim().length > 0;

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
          <section className="hero-section" data-mode={clientMode}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="hero-pill">
                  {clientMode === "guide" ? "Modo Guía" : "Modo Operativo"}
                </span>
                <span className="hero-pill" style={{ borderStyle: "dashed" }}>
                  {processingStatus === "idle" ? "Listo para ejecutar" : "Procesando"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {heroCopy.title}
              </h2>
              <p className="text-base md:text-lg max-w-2xl opacity-80">
                {heroCopy.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 hero-actions">
                <button
                  className="primary"
                  onClick={() => onExecute(prompts[0])}
                >
                  {heroCopy.primaryCTA}
                </button>
                <button
                  className="secondary"
                  onClick={() => onExecute(prompts[1] || prompts[0])}
                >
                  {heroCopy.secondaryCTA}
                </button>
              </div>
              <div className="hero-metrics">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="metric-chip">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-2xl p-6 ${isGuide ? "bg-white border border-[rgba(13,30,37,0.12)] text-slate-900" : "bg-white/10 border border-white/20"}`}>
              <h5 className="text-sm font-bold uppercase tracking-[0.4em] mb-4 opacity-80">
                Consultas sugeridas
              </h5>
              <ul className="space-y-3 text-sm">
                {prompts.map((item, idx) => (
                  <li
                    key={idx}
                    className={`rounded-lg p-3 ${isGuide ? "bg-[rgba(13,30,37,0.04)] border border-[rgba(13,30,37,0.08)]" : "bg-white/10 border border-white/15"}`}
                  >
                    “{item}”
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div key={module.title} className="learning-card" data-mode={clientMode}>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold">{module.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
                    {module.status}
                  </span>
                </div>
                <p className="text-sm opacity-80">{module.description}</p>
                <div className="module-progress">
                  <span style={{ width: `${statusToProgress[module.status] ?? 40}%` }} />
                </div>
                <div className="module-footer">
                  <span>
                    {module.status === "completado" ? "Listo" : module.status === "progreso" ? "En curso" : "Pendiente"}
                  </span>
                  <span>Ver módulo</span>
                </div>
              </div>
            ))}
          </div>

          <div className="search-panel space-y-4" data-mode={clientMode}>
            <div className="relative flex flex-col gap-3">
              <label htmlFor="dashboard-query" className="sr-only">
                Describe tu incidente o consulta normativa
              </label>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="dashboard-query"
                    className="flex-1 bg-transparent border-none text-base focus:outline-none"
                    placeholder="Describe tu incidente o consulta normativa..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onExecute(query)}
                    aria-label="Describe tu incidente o consulta normativa"
                  />
                </div>
                <button
                  onClick={() => onExecute(query)}
                  className="bg-primary text-on-primary px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!canExecute}
                  aria-disabled={!canExecute}
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
                  aria-pressed={fastMode}
                >
                  {fastMode ? "ON" : "OFF"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClientMode("guide")}
                  className={`px-4 py-2 rounded-full border ${clientMode === "guide" ? "bg-primary text-white" : "border-slate-300 text-slate-500"}`}
                  aria-pressed={clientMode === "guide"}
                >
                  Exploratorio
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode("expert")}
                  className={`px-4 py-2 rounded-full border ${clientMode === "expert" ? "bg-primary text-white" : "border-slate-300 text-slate-500"}`}
                  aria-pressed={clientMode === "expert"}
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
          <div className="dashboard-header" data-mode={clientMode}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">
                Resolución generada
              </h2>
              <span className="hero-pill" style={{ borderStyle: "dashed" }}>
                {clientMode === "guide" ? "Modo Guía" : "Modo Operativo"}
              </span>
              {stats && (
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                  Score: {stats.globalScore}% · Activos: {stats.totalAssets}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                onClick={onTestSystem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] bg-accent/10 text-accent border border-accent/20"
              >
                <Activity className="w-3.5 h-3.5" /> Diagnóstico de Sistemas
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
              <button
                onClick={onReset}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gold"
              >
                Nueva consulta
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              {isAuditing && (
                <span className="flex items-center gap-2 text-[10px] text-accent font-black uppercase tracking-[0.25em]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Auditoría en curso
                </span>
              )}
              {auditError && (
                <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                  {auditError}
                </span>
              )}
            </div>
          </div>

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
