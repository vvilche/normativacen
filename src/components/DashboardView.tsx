"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Activity,
  Search,
  Loader2,
  Copy
} from "lucide-react";
import Link from "next/link";
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
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  useEffect(() => {
    if (copiedPromptIndex === null) return;
    const timer = setTimeout(() => setCopiedPromptIndex(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedPromptIndex]);
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

  const prompts = clientMode === "guide" ? guidePrompts : expertPrompts;
  const heroCopy = clientMode === "guide"
    ? {
        title: "Diagnóstico asistido + playbooks",
        subtitle: "Prioriza la operación y complementa con microlecciones rápidas antes de enfrentarte a auditorías.",
        primaryCTA: "Diagnosticar consulta",
        secondaryCTA: "Ver resoluciones",
      }
    : {
        title: "Diagnóstico operativo NormativaCEN",
        subtitle: "Orquesta agentes técnicos para resolver incidentes urgentes y documentar evidencias en minutos.",
      };

  const heroMetrics = clientMode === "guide" && stats
    ? [
        { label: "Score Global", value: `${stats.globalScore}%` },
        { label: "Activos", value: `${stats.totalAssets}` },
        { label: "Riesgos Críticos", value: `${stats.criticalRisks}` },
      ]
    : [];

  const canExecute = query.trim().length > 0;

  const formatDateLabel = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
  };

  const parseScoreTone = (score: any) => {
    if (typeof score === "number") return score >= 90 ? "good" : "warn";
    if (!score) return "warn";
    const numeric = parseFloat(String(score).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(numeric)) return "warn";
    return numeric >= 90 ? "good" : "warn";
  };

  const resolutionKpis = resolution
    ? [
        { label: "Score", value: resolution.kpis?.score ?? "--", tone: parseScoreTone(resolution.kpis?.score) },
        { label: "Riesgo", value: resolution.kpis?.risk ?? "--", tone: /bajo/i.test(String(resolution.kpis?.risk || "")) ? "good" : "warn" },
        { label: "Latencia", value: resolution.kpis?.latency ?? "--", tone: "neutral" },
      ]
    : [];

  const handleCopyPrompt = async (text: string, idx: number, mode: "guide" | "expert") => {
    const promptKey = mode === "guide" ? idx : idx + 10;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptIndex(promptKey);
    } catch {
      setCopiedPromptIndex(null);
    }
  };

  const handlePromptInsert = (text: string) => {
    setQuery(text);
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
            {clientMode === "guide" && (
              <>
                <div className="flex flex-wrap gap-3 hero-actions">
                  <button className="primary" onClick={() => onExecute(prompts[0])}>
                    {heroCopy.primaryCTA}
                  </button>
                  <button className="secondary" onClick={() => onExecute(prompts[1] || prompts[0])}>
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
              </>
            )}
          </div>
            <div className="prompt-panel" data-mode={clientMode}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h5 className="text-sm font-bold uppercase tracking-[0.4em] opacity-80">
                  Consultas sugeridas
                </h5>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                  Toca para insertar
                </span>
              </div>
              <ul className="prompt-list">
                {prompts.map((item, idx) => {
                  const promptKey = clientMode === "guide" ? idx : idx + 10;
                  const isCopied = copiedPromptIndex === promptKey;
                  return (
                    <li
                      key={idx}
                      className="prompt-item"
                      onClick={() => handlePromptInsert(item)}
                    >
                      <span className="flex-1">“{item}”</span>
                      <button
                        type="button"
                        className="copy-trigger"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCopyPrompt(item, idx, clientMode);
                        }}
                      >
                        {isCopied ? "Copiado" : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {!isGuide && (
                <p className="prompt-hint">
                  Usa los chips para completar el comando o copia el texto si necesitas pegarlo en otra herramienta.
                </p>
              )}
            </div>
          </section>

          <div className="search-panel space-y-4" data-mode={clientMode}>
            <div className="relative flex flex-col gap-3">
              <label htmlFor="dashboard-query" className="sr-only">
                Describe tu incidente o consulta normativa
              </label>
              <div className="flex flex-col gap-3 w-full lg:flex-row lg:items-center">
                <div className="flex items-center gap-3 flex-1">
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
                <div className="flex justify-end">
                  <button
                    onClick={() => onExecute(query)}
                    className="bg-primary text-on-primary px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={!canExecute}
                    aria-disabled={!canExecute}
                  >
                    Ejecutar ↵
                  </button>
                </div>
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
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="resolution-header" data-mode={clientMode}>
            <div className="space-y-1">
              <div className="bg-white/5 p-3 rounded-lg mb-4 border-l-2 border-primary/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Tu consulta</p>
                <p className="text-sm italic text-white/90">&quot;{resolution?.originalQuery || query}&quot;</p>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Diagnóstico operativo</p>
              <h3 className="text-lg font-semibold">
                {resolution.hallazgo || "Resultado generado por el orquestador"}
              </h3>
              <p className="text-sm opacity-70">
                #{resolution.id || "SIN-ID"}
                {formatDateLabel(resolution.date) ? ` · ${formatDateLabel(resolution.date)}` : ""}
              </p>
            </div>
            <div className="resolution-actions">
              <button onClick={onReset}>Nueva consulta</button>
              {resolution?.resolutionId && (
                <Link href={`/documentacion/dossier?resolutionId=${resolution.resolutionId}`} target="_blank">
                  Dossier técnico
                </Link>
              )}
              <button onClick={onTestSystem}>
                <Activity className="w-4 h-4" /> Diagnóstico infra
              </button>
            </div>
          </div>

          {resolutionKpis.length > 0 && (
            <div className="resolution-kpis" data-mode={clientMode}>
              {resolutionKpis.map((kpi) => (
                <div key={kpi.label} className={`kpi-card ${kpi.tone}`}>
                  <span>{kpi.label}</span>
                  <strong>{kpi.value}</strong>
                </div>
              ))}
            </div>
          )}

          {auditError && (
            <div className="text-[11px] text-red-400 border border-red-500/30 rounded-xl px-4 py-3">
              {auditError}
            </div>
          )}

          {isAuditing && (
            <div className="text-[11px] text-accent border border-accent/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Auditoría profunda en curso…
            </div>
          )}

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
            steps={resolution?.steps}
            clientMode={clientMode}
            showSteps={clientMode === "guide"}
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
