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
import { ResolutionCard } from "./ResolutionCard";
import { WhitePaperCard } from "./WhitePaperCard";
import { HarnessMonitor } from "./HarnessMonitor";
import { WhitePaper } from "@/lib/data/whitePapers";
import Link from "next/link";
import { sendXapiStatement } from "@/lib/xapi";

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

type ModuleStatus = "pendiente" | "progreso" | "completado";

interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  quizId: string;
  duration: string;
  topic: string;
}

const moduleBlueprints: Record<"guide" | "expert", ModuleDefinition[]> = {
  guide: [
    {
      id: "guide-standards",
      title: "Intro a Estándares CEN",
      description: "Marco regulatorio fundamental del CEN.",
      status: "progreso",
      quizId: "guide-quiz-01",
      duration: "6 min",
      topic: "NTSyCS",
    },
    {
      id: "guide-operations",
      title: "Cumplimiento Operativo",
      description: "Cómo reportar telemetría en tiempo real.",
      status: "pendiente",
      quizId: "guide-quiz-02",
      duration: "8 min",
      topic: "SITR",
    },
    {
      id: "guide-annexes",
      title: "Anexos Técnicos",
      description: "Requisitos específicos de transmisión/distribución.",
      status: "pendiente",
      quizId: "guide-quiz-03",
      duration: "10 min",
      topic: "EDAC",
    },
  ],
  expert: [
    {
      id: "expert-response",
      title: "Plan de Respuesta SITR",
      description: "Remediaciones para telemetría lenta.",
      status: "progreso",
      quizId: "expert-quiz-01",
      duration: "5 min",
      topic: "SITR",
    },
    {
      id: "expert-ffr",
      title: "FFR & PMU Upgrades",
      description: "Parámetros críticos para evitar multas.",
      status: "pendiente",
      quizId: "expert-quiz-02",
      duration: "7 min",
      topic: "PMU",
    },
    {
      id: "expert-pmus",
      title: "Auditoría PMUS",
      description: "Documentación previa y flujos SEC.",
      status: "pendiente",
      quizId: "expert-quiz-03",
      duration: "9 min",
      topic: "PMUS",
    },
  ],
};

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
  const showEducationPanel = isGuide;
  const [educationOpen, setEducationOpen] = useState(showEducationPanel);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  useEffect(() => {
    setEducationOpen(showEducationPanel);
  }, [showEducationPanel]);

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
        secondaryCTA: "Abrir playbooks",
      }
    : {
        title: "Diagnóstico operativo NormativaCEN",
        subtitle: "Orquesta agentes técnicos para resolver incidentes urgentes y documentar evidencias en minutos.",
      };

  const [moduleState, setModuleState] = useState<Record<"guide" | "expert", ModuleDefinition[]>>(() => ({
    guide: moduleBlueprints.guide.map((module) => ({ ...module })),
    expert: moduleBlueprints.expert.map((module) => ({ ...module })),
  }));
  const modules = moduleState[clientMode];

  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [localUser, setLocalUser] = useState<{ name?: string; email?: string } | null>(null);
  const [sendingModuleId, setSendingModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        setLocalUser(JSON.parse(storedProfile));
      } catch {
        setLocalUser(null);
      }
    }
  }, []);

  const addBadge = (label: string) => {
    setEarnedBadges((prev) => (prev.includes(label) ? prev : [...prev, label]));
  };

  useEffect(() => {
    if (moduleState.guide.every((module) => module.status === "completado")) {
      addBadge("Playbooks exploratorios completados");
    }
  }, [moduleState.guide]);

  useEffect(() => {
    if (moduleState.expert.every((module) => module.status === "completado")) {
      addBadge("Playbooks operativos completados");
    }
  }, [moduleState.expert]);

  const statusToProgress: Record<ModuleStatus, number> = {
    completado: 100,
    progreso: 55,
    pendiente: 25,
  };

  const statusLabels: Record<ModuleStatus, string> = {
    completado: "Completado",
    progreso: "En progreso",
    pendiente: "Pendiente",
  };

  const heroMetrics = clientMode === "guide" && stats
    ? [
        { label: "Score Global", value: `${stats.globalScore}%` },
        { label: "Activos", value: `${stats.totalAssets}` },
        { label: "Riesgos Críticos", value: `${stats.criticalRisks}` },
      ]
    : [];

  const actorEmail = localUser?.email || "guest@normativacen.com";
  const actorName = localUser?.name || "Invitado NormativaCEN";
  const actorMbox = actorEmail.startsWith("mailto:") ? actorEmail : `mailto:${actorEmail}`;

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

  const handleModuleQuiz = async (module: ModuleDefinition, mode: "guide" | "expert") => {
    if (module.status === "completado") return;
    setSendingModuleId(module.id);
    const success = await sendXapiStatement({
      actor: {
        name: actorName,
        mbox: actorMbox,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "es-ES": "completó" },
      },
      object: {
        id: `https://normativacen.com/education/quizzes/${module.quizId}`,
        definition: {
          name: { "es-ES": module.title },
          description: { "es-ES": module.description },
          type: "https://adlnet.gov/expapi/activities/assessment",
        },
      },
      result: {
        completion: true,
        duration: module.duration,
      },
      context: {
        platform: "NormativaCEN Dashboard",
        mode,
        topic: module.topic,
      },
    });

    if (success) {
      setModuleState((previous) => {
        const next = { ...previous } as Record<"guide" | "expert", ModuleDefinition[]>;
        next[mode] = previous[mode].map((item) =>
          item.id === module.id ? { ...item, status: "completado" } : item
        );
        return next;
      });
    }
    setSendingModuleId(null);
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

          {earnedBadges.length > 0 && (
            <div className="badge-panel">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                Insignias obtenidas
              </p>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map((badge) => (
                  <span key={badge} className="chip badge-chip">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showEducationPanel && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10" data-mode={clientMode}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                    Centro educativo NormativaCEN
                  </p>
                  <h4 className="text-lg font-bold">Playbooks sugeridos</h4>
                </div>
                <button
                  type="button"
                  className="text-[10px] font-black uppercase tracking-[0.3em] border px-3 py-1 rounded-full"
                  onClick={() => setEducationOpen(!educationOpen)}
                >
                  {educationOpen ? "Ocultar" : "Ver"}
                </button>
                <Link
                  href="/educacion"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
                >
                  Biblioteca
                </Link>
              </div>
              {educationOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="learning-card" data-mode={clientMode}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">{module.title}</h4>
                        <span className={`status-badge status-${module.status}`}>
                          {statusLabels[module.status]}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.3em] opacity-60">
                        {module.topic} · {module.duration} · Quiz {module.quizId}
                      </p>
                      <p className="text-sm opacity-80">{module.description}</p>
                      <div className="module-progress">
                        <span style={{ width: `${statusToProgress[module.status] ?? 40}%` }} />
                      </div>
                      <div className="module-footer">
                        <span>
                          {module.status === "completado"
                            ? "Listo"
                            : module.status === "progreso"
                              ? "En curso"
                              : "Pendiente"}
                        </span>
                        <span>Ver módulo</span>
                      </div>
                      <button
                        type="button"
                        className="module-quiz-button"
                        disabled={module.status === "completado" || sendingModuleId === module.id}
                        onClick={() => handleModuleQuiz(module, clientMode)}
                      >
                        {module.status === "completado"
                          ? "Quiz reportado"
                          : sendingModuleId === module.id
                            ? "Registrando..."
                            : "Registrar quiz xAPI"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
