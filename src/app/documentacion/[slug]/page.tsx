"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, Activity } from "lucide-react";

interface ResolutionMeta {
  id?: string | null;
  timings?: Record<string, number> | null;
  createdAt?: string | null;
  clientMode?: "guide" | "expert";
}

interface ActionItem {
  id: string;
  task: string;
  priority?: string;
}

export default function DocumentacionPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const resolutionId = searchParams?.get("resolutionId");

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [highlight, setHighlight] = useState("");
  const [cleanContent, setCleanContent] = useState("");
  const [docTitle, setDocTitle] = useState("Gestión de Cumplimiento Normativo");
  const [resolutionMeta, setResolutionMeta] = useState<ResolutionMeta>({});
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([]);
  const [guideSuggestions, setGuideSuggestions] = useState<string[]>([]);
  const [contentExpanded, setContentExpanded] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (resolutionId) {
          const res = await fetch(`/api/dossiers/${resolutionId}`);
          if (!res.ok) throw new Error("Dossier no disponible");
          const data = await res.json();
          const payload = data.data || {};

          const mdContent = payload.content || "# Dossier no disponible";
          const metricsRecord: Record<string, string> = {};
          (payload.resolution?.metrics || []).forEach((m: any) => {
            if (m?.label && m?.value) metricsRecord[m.label] = m.value;
          });
          if (!Object.keys(metricsRecord).length && payload.metrics) {
            Object.entries(payload.metrics).forEach(([label, value]) => {
              metricsRecord[label] = String(value);
            });
          }

          setMetrics(metricsRecord);
          setHighlight(payload.hallazgo || payload.resolution?.hallazgo || "");
          setCleanContent(mdContent.trim());
          setDocTitle(payload.originalQuery || "Resolución Técnica");
          const sanitizedPlan = (payload.resolution?.actionPlan || [])
            .map((item: ActionItem) => {
              const cleanTask = typeof item.task === "string"
                ? item.task
                    .replace(/[\*`_]/g, "")
                    .replace(/\s+/g, " ")
                    .trim()
                : "";
              return { ...item, task: cleanTask };
            })
            .filter((item: ActionItem) => item.task && item.task !== "--" && item.task.length < 300);
          setResolutionMeta({
            id: payload.resolutionId,
            timings: payload.timings,
            createdAt: payload.createdAt,
            clientMode: payload.clientMode,
          });
          setActionPlan(sanitizedPlan);
          setGuideSuggestions(payload.guideSuggestions || []);
        } else {
          const res = await fetch(`/api/docs?slug=${slug}`);
          if (!res.ok) throw new Error("Documento no encontrado");
          const data = await res.json();
          let rawContent = data.content;

          const metricsMatch = rawContent.match(/\[METRICS_JSON\]\s*(\{[\s\S]*?\})/);
          if (metricsMatch) {
            try {
              setMetrics(JSON.parse(metricsMatch[1]));
              rawContent = rawContent.replace(metricsMatch[0], "");
            } catch (error) {
              console.error("Error al parsear métricas", error);
            }
          }

          const highlightMatch = rawContent.match(/\[HALLAZGO_HIGHLIGHT\]\s*(.*)/);
          if (highlightMatch) {
            setHighlight(highlightMatch[1].trim());
            rawContent = rawContent.replace(highlightMatch[0], "");
          }

          setCleanContent(rawContent.trim());
          setDocTitle("Análisis Técnico y Normativo");
          setResolutionMeta({ clientMode: "guide" });
          setActionPlan([]);
          setGuideSuggestions([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchContent();
  }, [slug, resolutionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const formattedDate = resolutionMeta.createdAt
    ? new Date(resolutionMeta.createdAt).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : new Date().toLocaleDateString("es-CL");
  const clientMode = (resolutionMeta.clientMode || "expert") as "guide" | "expert";
  const isGuide = clientMode === "guide";

  const navItems = [
    { label: "Resumen", active: true },
    { label: "Plan de acción" },
    { label: "Artefactos educativos", hidden: !isGuide },
  ];

  const suggestions = guideSuggestions.length
    ? guideSuggestions
    : [
        "Revisar requisitos de NTSyCS para subestaciones",
        "Validar protocolos del Anexo Técnico 4.1",
        "Checklist de auditoría para SITR",
      ];

  const modules = (actionPlan.length ? actionPlan.slice(0, 3) : [
    { id: "M1", task: "Intro a Estándares CEN" },
    { id: "M2", task: "Cumplimiento Operativo" },
    { id: "M3", task: "Anexos Técnicos" },
  ]).map((item, index) => ({
    ...item,
    status: index === 0 ? "completado" : index === 1 ? "progreso" : "pendiente",
  }));

  const metricsEntries = Object.entries(metrics || {});
  const timingEntries = resolutionMeta.timings ? Object.entries(resolutionMeta.timings) : [];

  return (
    <div className={`dossier-shell ${isGuide ? "theme-guide" : "theme-expert"}`}>
      <aside className="dossier-sidebar">
        <div>
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3 text-white font-black">
            C
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Dossier Operativo</h2>
          <p className="text-xs opacity-60 uppercase tracking-[0.2em]">ID: {resolutionMeta.id || "SIN-ID"}</p>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.filter((item) => !item.hidden).map((item) => (
            <button key={item.label} className={item.active ? "active" : ""}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="btn-primary uppercase tracking-[0.3em]">Exportar PDF</button>
      </aside>

      <main className="dossier-main">
        <header className="dossier-topbar">
          <div className="flex items-center gap-3">
            <Link href="/documentacion" className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">
              ← Biblioteca Técnica
            </Link>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] opacity-70">
            <button className="flex items-center gap-1 text-primary">
              <Activity className="w-4 h-4" /> Diagnóstico Infra
            </button>
          </div>
        </header>

        <div className="dossier-content">
          <section className="hero-section" data-mode={clientMode}>
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-[0.5em] opacity-80">
                Diagnóstico Operativo
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">{docTitle}</h1>
              <p className="text-white/80 text-lg">
                {highlight || "Optimice su operación con acceso directo a los procedimientos y anexos CEN."}
              </p>
              <div className="hero-metrics" data-mode={clientMode}>
                {metricsEntries.slice(0, 3).map(([label, value]) => (
                  <div key={label} className="metric-chip">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            {isGuide && (
              <div className="rounded-2xl p-6 bg-white border border-[rgba(13,30,37,0.12)] text-slate-900">
                <h5 className="text-sm font-bold uppercase tracking-[0.4em] mb-4 opacity-80">
                  Consultas sugeridas
                </h5>
                <ul className="space-y-3 text-sm">
                  {suggestions.map((item) => (
                    <li key={item} className="rounded-lg p-3 bg-[rgba(13,30,37,0.04)] border border-[rgba(13,30,37,0.08)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="metrics-grid" data-mode={clientMode}>
            {metricsEntries.map(([label, value]) => (
              <div key={label} className="metrics-card">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{label}</span>
                <p className="text-2xl font-black mt-1">{value}</p>
              </div>
            ))}
            {timingEntries.map(([label, value]) => (
              <div key={label} className="metrics-card">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{label.replace(/_/g, " ")}</span>
                <p className="text-2xl font-black mt-1">{(value / 1000).toFixed(2)}s</p>
              </div>
            ))}
          </section>

          {isGuide && (
            <section className="learning-grid">
              {modules.map((module) => (
                <div key={module.id} className="learning-card" data-mode={clientMode}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary text-lg font-black">{module.id}</span>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full status-${module.status}`}>
                      {module.status === "completado" ? "Completado" : module.status === "progreso" ? "En Progreso" : "Pendiente"}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{module.task}</h4>
                  <p className="text-sm opacity-70">{module.priority || "Módulo del plan de acción"}</p>
                </div>
              ))}
            </section>
          )}

          <section className="knowledge-section" data-mode={clientMode}>
            <div className="knowledge-card">
              <h3 className="text-2xl font-bold mb-4">Base de Conocimiento</h3>
              <div className={contentExpanded ? "" : "scroll-panel clamped"}>
                <article className="markdown-output">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cleanContent || "# Documento no disponible"}
                  </ReactMarkdown>
                </article>
              </div>
              <button
                className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary"
                onClick={() => setContentExpanded(!contentExpanded)}
              >
                {contentExpanded ? "Mostrar menos" : "Mostrar más"}
              </button>
            </div>
            <div className="chat-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">AI</div>
                <div>
                  <p className="font-bold">Asistente Técnico</p>
                  <p className="text-[10px] text-primary uppercase tracking-[0.4em]">Soporte Normativo</p>
                </div>
              </div>
              <p className="text-sm opacity-80 mb-4">{highlight || "Sin hallazgos críticos reportados."}</p>
              {guideSuggestions.length > 0 && (
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Siguiente paso</p>
                  <ul className="space-y-1 text-sm">
                    {guideSuggestions.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {actionPlan.length > 0 && (
            <section className="learning-card" data-mode={clientMode}>
              <h3 className="text-2xl font-bold mb-4">Plan de Acción</h3>
              <div className="space-y-2">
                {actionPlan.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] opacity-60">
                      <span>{item.id}</span>
                      <span>{item.priority || "—"}</span>
                    </div>
                    <p className="text-sm">{item.task}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-10 text-xs uppercase tracking-[0.3em] opacity-70">
            REF: {slug}
          </footer>
        </div>
      </main>
    </div>
  );
}
