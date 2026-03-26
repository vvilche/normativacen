"use client";

import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  Network, 
  Database, 
  AlertTriangle, 
  Fingerprint,
  ChevronRight,
  Clock,
  UserCheck,
  Pin,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Isolate browser-only libraries
const PDFButton = dynamic(() => import('@/components/PDFButton'), { ssr: false });

export default function WhitePaperPage() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [highlight, setHighlight] = useState('');
  const [cleanContent, setCleanContent] = useState('');
  const [toc, setToc] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/docs?slug=${slug}`);
        if (!res.ok) throw new Error('Documento no encontrado');
        const data = await res.json();
        
        let rawContent = data.content;
        
        // Extract METRICS_JSON
        const metricsMatch = rawContent.match(/\[METRICS_JSON\]\s*(\{[\s\S]*?\})/);
        if (metricsMatch) {
          try {
            setMetrics(JSON.parse(metricsMatch[1]));
            rawContent = rawContent.replace(metricsMatch[0], '');
          } catch (e) { console.error('Error parsing metrics', e); }
        }

        // Extract HALLAZGO_HIGHLIGHT
        const highlightMatch = rawContent.match(/\[HALLAZGO_HIGHLIGHT\]\s*(.*)/);
        if (highlightMatch) {
          setHighlight(highlightMatch[1].trim());
          rawContent = rawContent.replace(highlightMatch[0], '');
        }

        // Extract TOC
        const tocMatches = rawContent.match(/^##\s+(.*)/gm);
        if (tocMatches) {
          const cleanTOC = tocMatches.map((m: string) => m.replace('##', '').trim());
          setToc(Array.from(new Set(cleanTOC)));
        }

        setContent(data.content);
        setCleanContent(rawContent.trim());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchContent();
  }, [slug]);

  if (!mounted || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em]">Resolviendo Metodología Tung...</span>
      </div>
    </div>
  );

  const formattedDate = new Date().toLocaleDateString('es-CL');

  return (
    <div className="min-h-screen bg-[#050810] text-[#E9EEF5] font-body selection:bg-primary/20">
      {/* ... (PDF Template unchanged for now) ... */}

      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR - BRANDING & TOC */}
        <aside className="hidden lg:flex w-72 bg-[#080B14] text-white flex-col sticky top-0 h-screen border-r border-white/5 shadow-2xl z-50">
          <div className="p-6 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-[10px] font-black italic">N</div>
              <h1 className="text-xs font-heading font-black tracking-[0.2em] leading-tight uppercase">Conecta <br/> Ingeniería</h1>
            </div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Technical White Paper</p>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-10 overflow-y-auto overflow-x-hidden">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Contenido</h3>
              <ul className="space-y-2">
                {['Resumen Ejecutivo', ...toc].map((item, idx) => (
                  <li key={idx} className="group">
                    <button className="text-[12px] font-medium text-white/40 group-hover:text-primary transition-all text-left leading-snug">
                       {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                <ShieldCheck className="w-3 h-3 text-primary/50" /> Auditoría Interna
              </div>
              <p className="text-[10px] text-white/20 leading-relaxed italic font-medium pr-2">
                "Verificado contra Base Normativa CEN 2025. Auditoría técnica de cumplimiento activa."
              </p>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT WINDOW */}
        <div className="flex-1 flex flex-col min-h-screen relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,108,223,0.08),transparent_50%)] pointer-events-none" />
          
          {/* TOP NAV */}
          <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-8 py-3 flex items-center justify-between">
            <Link href="/documentacion" className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-primary transition-all group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> <span className="uppercase tracking-[0.2em]">Biblioteca Técnica</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formattedDate}</span>
                <span className="px-2 py-0.5 rounded border border-success/30 text-success text-[8px] font-black">Confidencial</span>
              </div>
              <PDFButton printRef={printRef} slug={slug as string} />
            </div>
          </header>

          {/* MAIN DOCUMENT BODY */}
          <main className="max-w-4xl mx-auto w-full px-8 py-6 md:py-10 space-y-6 relative z-10">
            
            {/* HERO SECTION - ENGINEERING COCKPIT STYLE */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-primary/80 uppercase tracking-widest">
                    <Database className="w-3 h-3" /> Normativa Vigente
                 </div>
                 <h2 className="text-3xl font-heading font-black text-white tracking-tighter uppercase leading-none">
                    Análisis Técnico <span className="text-primary">y Normativo</span>
                 </h2>
                 <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Reporte de Auditoría Técnica 2025</p>
              </div>
              
              {/* COMPACT HORIZONTAL METRIC BAR */}
              {Object.keys(metrics).length > 0 && (
                <div className="glass-card flex items-center divide-x divide-white/10 rounded-lg overflow-hidden border border-white/10">
                  {Object.entries(metrics).map(([label, value], idx) => (
                    <div key={idx} className="px-4 py-2 flex flex-col items-center justify-center min-w-[100px] hover:bg-white/5 transition-colors">
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">{label}</span>
                      <span className="text-sm font-black text-white tracking-tight">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CRITICAL FINDING CALLOUT - MINIMALIST */}
            {highlight && (
              <div className="glass-panel border-l-2 border-primary/50 bg-primary/5 rounded-r-lg p-4 flex gap-4 items-center">
                <div className="bg-primary/20 text-primary p-2 rounded-md border border-primary/30 shrink-0">
                  <Pin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-0.5 italic">Hallazgo Crítico Detectado</div>
                  <p className="text-xs font-bold text-white/90 leading-snug">
                    {highlight}
                  </p>
                </div>
              </div>
            )}

            {/* DOCUMENT CONTENT CONTEXT */}
            <article className="prose prose-invert max-w-none 
              prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
              prose-h1:text-2xl prose-h1:mb-4 prose-h1:text-white
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-primary
              prose-p:text-white/60 prose-p:text-[13px] prose-p:leading-relaxed prose-p:mb-3
              prose-strong:text-white prose-strong:font-black
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-table:border prose-table:border-white/5 prose-table:rounded-lg prose-table:overflow-hidden
              prose-th:bg-white/5 prose-th:text-white/40 prose-th:p-2 prose-th:text-[8px] prose-th:uppercase prose-th:tracking-widest
              prose-td:p-2 prose-td:text-[10px] prose-td:border-t prose-td:border-white/5 prose-td:text-white/50
            ">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => {
                    const text = props.children?.toString() || '';
                    const match = text.match(/^(\d+)\.\s*(.*)/);
                    if (match) {
                      return (
                        <h2 className={props.className}>
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/20 text-primary text-[10px] shrink-0 border border-primary/30 mr-2">
                            {match[1]}
                          </span>
                          <span>{match[2]}</span>
                        </h2>
                      );
                    }
                    return <h2 {...props} />;
                  }
                }}
              >
                {cleanContent || '# Documento no disponible'}
              </ReactMarkdown>
            </article>

            {/* FOOTER */}
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">
                 REF: {slug}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-primary text-white text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
                   <Activity className="w-2.5 h-2.5" /> Generar Auditoría
                </button>
                <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white/40 text-[8px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                   <Info className="w-2.5 h-2.5" /> Metadatos
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
