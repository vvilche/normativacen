"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Database, Pin } from "lucide-react";

interface DossierPayload {
  content: string;
  hallazgo?: string | null;
  seoTags?: string[] | null;
  resolution?: {
    actionPlan?: Array<{ id: string; task: string; priority?: string }>;
    metrics?: Array<{ label: string; value: string; status: string }>;
  };
  agentType?: string;
  resolutionId?: string;
  createdAt?: string;
  originalQuery?: string;
}

export default function DossierViewer() {
  const params = useParams();
  const dossierId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<DossierPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const res = await fetch(`/api/dossiers/${dossierId}`);
        if (!res.ok) throw new Error("Dossier no disponible");
        const data = await res.json();
        setPayload(data.data);
      } catch (err: any) {
        setError(err.message || "Error recuperando el dossier");
      } finally {
        setLoading(false);
      }
    };
    if (dossierId) {
      fetchDossier();
    }
  }, [dossierId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <Loader2 className="w-12 h-12 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <p className="text-sm text-white/60">{error || "Dossier no encontrado"}</p>
        <Link href="/documentacion" className="text-gold text-xs font-black uppercase tracking-[0.3em]">
          Volver a Documentación
        </Link>
      </div>
    );
  }

  const metrics = payload.resolution?.metrics ?? [];
  const actionPlan = payload.resolution?.actionPlan ?? [];

  return (
    <div className="min-h-screen bg-[#050810] text-white font-body">
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/documentacion" className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
          <ArrowLeft className="w-3 h-3" /> Biblioteca Técnica
        </Link>
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
          Dossier #{payload.resolutionId || dossierId}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-[0.3em] font-black">
            <Database className="w-3 h-3" /> Informe Técnico Multi-Agente
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white">
            {payload.originalQuery || "Resolución Técnica"}
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em]">
            Generado {payload.createdAt ? new Date(payload.createdAt).toLocaleString("es-CL") : "Reciente"}
          </p>
        </section>

        {payload.hallazgo && (
          <div className="glass-panel border-l-2 border-gold/40 bg-gold/5 p-4 rounded-r-xl flex gap-3 items-center">
            <div className="p-2 rounded bg-gold/20 border border-gold/40">
              <Pin className="w-3 h-3 text-gold" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">Hallazgo Crítico</p>
              <p className="text-sm text-white/80 font-medium">{payload.hallazgo}</p>
            </div>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="glass-card rounded-xl border border-white/5 overflow-hidden grid grid-cols-2 md:grid-cols-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="p-4 border border-white/5 text-center">
                <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-black">{metric.label}</p>
                <p className="text-lg font-black text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        <article className="markdown-output bg-[#080B14] border border-white/5 rounded-2xl p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{payload.content}</ReactMarkdown>
        </article>

        {actionPlan.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Plan de Acción</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {actionPlan.map((item) => (
                <div key={item.id} className="border border-white/5 rounded-xl p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{item.id}</span>
                    <span className="text-[9px] text-white/40 uppercase tracking-[0.2em]">{item.priority || "—"}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-snug">{item.task}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
