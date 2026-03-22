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
          setToc([...new Set(tocMatches.map(m => m.replace('##', '').trim()))]);
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
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900 font-sans selection:bg-primary/20">
      {/* PDF PRINT TEMPLATE - Simplified for High Resolution */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={printRef} style={{ width: '210mm', backgroundColor: '#ffffff', color: '#1a1a1a', padding: '20mm', fontFamily: 'serif' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #3B82F6', marginBottom: '30px', paddingBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#3B82F6' }}>CONECTA INGENIERIA</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>WHITE PAPER TÉCNICO | {slug}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: '700' }}>REPORTE GENERADO: {formattedDate}</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>ID: {slug?.toString().toUpperCase()}</div>
              </div>
           </div>
           <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <ReactMarkdown>{cleanContent}</ReactMarkdown>
           </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR - BRANDING & TOC */}
        <aside className="hidden lg:flex w-80 bg-[#0B1221] text-white flex-col sticky top-0 h-screen border-r border-white/5 shadow-2xl">
          <div className="p-8 space-y-2">
            <h1 className="text-xl font-black tracking-tighter leading-tight italic uppercase">CONECTA <br/> INGENIERIA</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">White Paper Técnico</p>
          </div>

          <nav className="flex-1 px-8 py-4 space-y-8 overflow-y-auto overflow-x-hidden">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Contenido</h3>
              <ul className="space-y-3">
                {['Resumen Ejecutivo', ...toc].map((item, idx) => (
                  <li key={idx} className="group">
                    <button className="text-[13px] font-medium text-slate-400 group-hover:text-white transition-colors text-left leading-snug">
                       {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-4">
                <UserCheck className="w-3 h-3" /> Motor de Auditoría
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic pr-4">
                "Análisis procesado mediante Metodología Tung Alpha v3.0 - Cumplimiento NTSyCS 2025."
              </p>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT WINDOW */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* TOP NAV */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <Link href="/documentacion" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span className="uppercase tracking-widest">Biblioteca</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formattedDate}</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold border border-green-200 uppercase tracking-wide">Confidencial</span>
              </div>
              <PDFButton printRef={printRef} slug={slug as string} />
            </div>
          </header>

          {/* MAIN DOCUMENT BODY */}
          <main className="max-w-4xl mx-auto w-full px-8 py-16 md:py-24 space-y-16">
            
            {/* HERO SECTION */}
            <div className="space-y-6">
               <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{slug?.toString().replace(/-/g, ' ')}</p>
               <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] italic uppercase">
                  Análisis Técnico <br/> <span className="text-primary not-italic">y Normativo</span>
               </h2>
            </div>

            {/* METRICS GRID */}
            {Object.keys(metrics).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics).map(([label, value], idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="text-3xl font-black text-primary mb-1 tracking-tighter">{value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* HALLAZGO PRINCIPAL DASHBOARD */}
            {highlight && (
              <div className="relative overflow-hidden bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity className="w-24 h-24 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start text-left">
                  <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 shrink-0">
                    <Pin className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Hallazgo Principal</h3>
                    <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                      {highlight}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT CONTENT CONTEXT */}
            <article className="prose prose-slate max-w-none 
              prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tighter prose-headings:uppercase
              prose-h1:text-5xl prose-h1:mb-12 prose-h1:pt-16
              prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:flex prose-h2:items-center prose-h2:gap-4
              prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed
              prose-strong:text-slate-900 prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl
              prose-table:border prose-table:border-slate-200 prose-table:rounded-2xl prose-table:overflow-hidden
              prose-th:bg-slate-50 prose-th:text-slate-900 prose-th:p-4 prose-th:text-xs prose-th:uppercase prose-th:tracking-widest
              prose-td:p-4 prose-td:text-sm prose-td:border-t prose-td:border-slate-200
            ">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => {
                    const text = props.children?.toString() || '';
                    const match = text.match(/^(\d+)\.\s*(.*)/);
                    if (match) {
                      return (
                        <h2 className={props.className}>
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl md:text-2xl not-italic shrink-0">
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
            <div className="pt-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Database className="w-4 h-4" /> <span>Origen: {slug}.md</span>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2 group">
                   <Zap className="w-4 h-4 text-primary group-hover:text-white transition-colors" /> Ejecutar Auditoría
                </button>
                <button className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                   <Info className="w-4 h-4" /> Especificación
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
