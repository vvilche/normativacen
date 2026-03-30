"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const [cleanContent, setCleanContent] = useState(" ");
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
                ? item.task.replace(/[\*`_]/g, "").replace(/\s+/g, " ").trim()
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

  const heroChips = [
    `ID ${resolutionMeta.id || "SIN-ID"}`,
    formattedDate,
    clientMode === "guide" ? "Modo Guía" : "Modo Operativo",
  ];
  const heroMetrics = metricsEntries.slice(0, 3);
  const accentLabelClass = isGuide ? "text-slate-600" : "text-white/60";
  const accentHeadingClass = isGuide ? "text-slate-900" : "text-white";
  const suggestionAccentBg = isGuide ? "bg-slate-50 border-slate-200" : "bg-white/10 border-white/10";
  const copySuggestion = (text: string) => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(text).catch(() => undefined);
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const target = window.open("", "_blank", "width=900,height=700");
    if (!target) return;

    const chipsHtml = heroChips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join(" ");
    const metricsHtml = heroMetrics
      .map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`)
      .join("");
    const contentHtml = escapeHtml(cleanContent).replace(/\n/g, "<br />");
    const planHtml = actionPlan.length
      ? `<ul>${actionPlan.map((item) => `<li><strong>${escapeHtml(item.id || "")}</strong> ${escapeHtml(item.task || "")}</li>`).join("")}</ul>`
      : "<p>No se detectaron acciones pendientes.</p>";

    target.document.write(`<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <title>${escapeHtml(docTitle)} - Dossier</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 2rem; color: #111; }
          h1 { font-size: 28px; margin-bottom: 0.2rem; }
          h2 { margin-top: 1.5rem; }
          .chips span { display: inline-block; border: 1px solid #ccc; border-radius: 999px; padding: 0.2rem 0.8rem; margin-right: 0.4rem; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; }
          .metrics { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
          .metric { border: 1px solid #ddd; border-radius: 0.8rem; padding: 0.8rem 1rem; min-width: 140px; }
          .metric span { display:block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #666; }
          .metric strong { font-size: 18px; }
          ul { padding-left: 1.2rem; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(docTitle)}</h1>
        <p>${escapeHtml(highlight || "Dossier técnico generado por NormativaCEN.")}</p>
        <div class="chips">${chipsHtml}</div>
        <div class="metrics">${metricsHtml}</div>
        <h2>Contenido</h2>
        <div>${contentHtml}</div>
        <h2>Plan de acción</h2>
        ${planHtml}
        <script>window.onload = function(){ window.print(); window.close(); };</script>
      </body>
      </html>`);
    target.document.close();
  };

  return (
    <div className={`min-h-screen ${isGuide ? "theme-guide" : "theme-expert"}`}>
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10" data-mode={clientMode}>
        <section className="master-hero" data-mode={clientMode}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {heroChips.map((chip) => (
                <span key={chip} className="hero-pill">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {docTitle}
            </h1>
            <p className="text-lg max-w-3xl opacity-80">
              {highlight || "Optimiza tu operación con acceso directo a los procedimientos y anexos CEN."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary" onClick={() => window.open("/dashboard", "_self")}>
                Volver al dashboard
              </button>
              <button className="btn-primary" onClick={handleExport}>
                Exportar dossier
              </button>
            </div>
            {heroMetrics.length > 0 && (
              <div className="hero-metrics">
                {heroMetrics.map(([label, value]) => (
                  <div key={label} className="metric-chip">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {isGuide && (
          <div className="prompt-panel" data-mode="guide">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h5 className="text-sm font-bold uppercase tracking-[0.4em] opacity-80">Consultas sugeridas</h5>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Listas para copiar</span>
            </div>
            <ul className="prompt-list">
              {suggestions.map((item) => (
                <li
                  key={item}
                  className="prompt-item"
                  onClick={() => copySuggestion(item)}
                >
                  <span className="flex-1">“{item}”</span>
                  <button
                    type="button"
                    className="copy-trigger"
                    onClick={(event) => {
                      event.stopPropagation();
                      copySuggestion(item);
                    }}
                  >
                    Copiar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-6">
          <div className="knowledge-card md:col-span-2">
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
          <div className="chat-card space-y-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${accentLabelClass}`}>Hallazgo clave</p>
              <p className={`text-lg font-semibold ${accentHeadingClass}`}>
                {highlight || "Sin hallazgos críticos reportados."}
              </p>
            </div>
            {guideSuggestions.length > 0 && (
              <div className={`rounded-lg p-3 border ${suggestionAccentBg}`}>
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

        {isGuide && (
          <section className="learning-grid">
            {modules.map((module) => (
              <div key={module.id} className="learning-card" data-mode={clientMode}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-primary text-lg font-black">{module.id}</span>
                  <span className={`status-badge status-${module.status}`}>
                    {module.status === "completado" ? "Completado" : module.status === "progreso" ? "En Progreso" : "Pendiente"}
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-2">{module.task}</h4>
                <p className="text-sm opacity-70">{module.priority || "Módulo del plan de acción"}</p>
              </div>
            ))}
          </section>
        )}

        {actionPlan.length > 0 && (
          <section className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Plan de Acción</h3>
              <span className="chip">{actionPlan.length} tareas</span>
            </div>
            <div className="space-y-3">
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

        <footer className="mt-10 text-xs uppercase tracking-[0.3em].opacity-70 text-center">
          REF: {slug}
        </footer>
      </div>
    </div>
  );
}
