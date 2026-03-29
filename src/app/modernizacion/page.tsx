"use client";

import React, { useMemo, useState } from "react";
import {
  Cpu,
  RefreshCcw,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Copy,
  Radio,
  History,
} from "lucide-react";

const prompts = [
  "Checklist IEC 61850 para RTU legada",
  "Plan de recambio antenas EDAC > 200ms",
  "Auditoría OT para PMU con firmware 2020",
];

const playbooks = [
  {
    id: "PB-01",
    title: "Mapa de activos críticos",
    description: "Inventario normativo por subestación y telemetría asociada.",
    status: "completado",
  },
  {
    id: "PB-02",
    title: "Redundancia SITR",
    description: "Duplicación física y lógica de enlaces críticos.",
    status: "progreso",
  },
  {
    id: "PB-03",
    title: "Ciber OT avanzada",
    description: "Segmentación y hardening para RTU/PMU industriales.",
    status: "pendiente",
  },
];

const timeline = [
  {
    label: "Escaneo inventario",
    detail: "Orquestador detecta firmware, protocolos y topologías.",
    metric: "Latencia base 180ms",
  },
  {
    label: "Gap IA",
    detail: "Cruce NTSyCS 2025 vs estado real de cada activo.",
    metric: "14 riesgos altos",
  },
  {
    label: "Plan de modernización",
    detail: "Prioriza recambios y upgrades en 30 días.",
    metric: "CAPEX $120M aprox.",
  },
];

const ModernizationPage = () => {
  const [clientMode, setClientMode] = useState<"guide" | "expert">("expert");
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    installation: "",
    brand: "",
    issue: "",
    timeframe: "",
  });

  const heroMetrics = useMemo(
    () => [
      { label: "Latencia meta", value: "<= 200ms" },
      { label: "Inventario IA", value: "143 activos" },
      { label: "Auditorías", value: "15/mes" },
    ],
    []
  );

  const canAdvance = formStep === 1
    ? Boolean(formData.installation.trim())
    : Boolean(formData.issue.trim()) && Boolean(formData.timeframe.trim());

  const copyPrompt = (text: string) => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(text).catch(() => undefined);
  };

  const handleInput = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.installation.trim()) return;
    setIsSubmitted(true);
  };

  const diagnosticHint = useMemo(() => {
    if (!formData.installation) {
      return "Sin datos de instalación: ingresa un activo para generar diagnóstico.";
    }
    const issue = formData.issue || "latencias irregulares";
    const time = formData.timeframe || "Q4";
    return `La instalación ${formData.installation} muestra ${issue}. Se recomienda cerrar brechas antes de ${time}.`;
  }, [formData]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="max-w-2xl w-full glass-card border border-white/10 rounded-[40px] p-10 space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-gold/10 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-gold/30 bg-gold/10 flex items-center justify-center text-gold">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Solicitud sincronizada</p>
              <h2 className="text-3xl font-heading font-black text-white italic">Modernización en curso</h2>
            </div>
          </div>
          <div className="relative grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Instalación</p>
              <p className="text-xl font-black text-white">{formData.installation}</p>
              <p className="text-sm text-white/60">Marca declarada: {formData.brand || "Sin detalle"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Próximo paso</p>
              <p className="text-sm text-white/80">
                Hemos asignado al Orquestador una auditoría profunda. Recibirás en tu correo el plan de recambio y el backlog de upgrades.
              </p>
              <p className="text-xs text-gold">ETA 48 horas · Protocolo NTSyCS 2025</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormStep(1);
            }}
            className="w-full border border-white/15 rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 hover:text-white"
          >
            Registrar nueva instalación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 selection:bg-gold/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-industrial-grid" />
      <div className="max-w-6xl mx-auto space-y-10 relative z-10 p-6 md:p-10">
        <section className="master-hero" data-mode={clientMode}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {["Programa Modernización 2026", "SITR / EDAC", clientMode === "guide" ? "Modo Guía" : "Modo Operativo"].map((chip) => (
                <span key={chip} className="hero-pill">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Inventario operativo listo para auditorías CEN
            </h1>
            <p className="text-lg max-w-3xl opacity-80">
              Detectamos RTUs, PMUs y enlaces críticos en minutos. Orquesta upgrades y playbooks antes de que la multa llegue.
            </p>
            <div className="flex flex-wrap gap-3 hero-actions">
              <button className="primary" onClick={() => setFormStep(1)}>
                Ejecutar auditoría
              </button>
              <button className="secondary" onClick={() => setClientMode(clientMode === "guide" ? "expert" : "guide")}>
                {clientMode === "guide" ? "Ver modo operativo" : "Ver modo guía"}
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
          <div className="prompt-panel" data-mode={clientMode}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h5 className="text-sm font-bold uppercase tracking-[0.4em] opacity-80">Consultas sugeridas</h5>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                Copia o inserta
              </span>
            </div>
            <ul className="prompt-list">
              {prompts.map((prompt) => (
                <li
                  key={prompt}
                  className="prompt-item"
                  onClick={() => handleInput("issue", prompt)}
                >
                  <span className="flex-1">“{prompt}”</span>
                  <button
                    type="button"
                    className="copy-trigger"
                    onClick={(event) => {
                      event.stopPropagation();
                      copyPrompt(prompt);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "RTUs & gateways", desc: "Migramos DNP3 serial a IEC 61850 con autenticación segura." },
            { icon: ShieldCheck, title: "Ciberseguridad OT", desc: "Hardening de PMU/RTU según protocolo NTSyCS 2025." },
            { icon: RefreshCcw, title: "Redundancia", desc: "Duplicación física de canales y failover activo-activo." },
          ].map((feature) => (
            <div key={feature.title} className="p-8 rounded-[32px] border border-white/5 bg-white/[0.03] backdrop-blur-xl hover:border-gold/30 transition-all group">
              <feature.icon className="w-8 h-8 text-gold mb-6 opacity-70 group-hover:opacity-100" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">{feature.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        <section className="learning-grid">
          {playbooks.map((playbook) => (
            <div key={playbook.id} className="learning-card" data-mode={clientMode}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary text-lg font-black">{playbook.id}</span>
                <span className={`status-badge status-${playbook.status}`}>
                  {playbook.status === "completado"
                    ? "Completado"
                    : playbook.status === "progreso"
                      ? "En progreso"
                      : "Pendiente"}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-2">{playbook.title}</h4>
              <p className="text-sm opacity-70">{playbook.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card rounded-[32px] border border-white/10 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Formulario exploratorio</p>
                <h3 className="text-2xl font-black text-white">Solicitar diagnóstico técnico</h3>
              </div>
              <div className="flex gap-2">
                {[1, 2].map((step) => (
                  <span
                    key={step}
                    className={`w-10 h-10 rounded-2xl border text-xs font-black flex items-center justify-center ${formStep === step ? "bg-gold text-black border-gold" : "border-white/20 text-white/60"}`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formStep === 1 ? (
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                      Instalación / subestación
                    </label>
                    <input
                      type="text"
                      value={formData.installation}
                      onChange={(event) => handleInput("installation", event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none"
                      placeholder="Ej: SE Atacama 220kV"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                      Marca de equipos
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(event) => handleInput("brand", event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none"
                      placeholder="SEL, Siemens, ABB"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Problema actual</label>
                    <textarea
                      value={formData.issue}
                      onChange={(event) => handleInput("issue", event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none h-32"
                      placeholder="Describe latencias, firmware, multas, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Horizonte</label>
                    <input
                      type="text"
                      value={formData.timeframe}
                      onChange={(event) => handleInput("timeframe", event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none"
                      placeholder="Ej: 45 días, Q4, Auditoría SEC"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 justify-between">
                {formStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormStep((prev) => Math.max(1, prev - 1))}
                    className="px-5 py-3 border border-white/20 rounded-2xl text-[10px] uppercase tracking-[0.3em]"
                  >
                    Volver
                  </button>
                )}
                {formStep < 2 && (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => canAdvance && setFormStep(2)}
                    className="px-5 py-3 rounded-2xl bg-gold text-black font-black text-[10px] uppercase tracking-[0.3em] disabled:opacity-40"
                  >
                    Continuar
                  </button>
                )}
                {formStep === 2 && (
                  <button
                    type="submit"
                    disabled={!canAdvance}
                    className="flex-1 px-5 py-3 rounded-2xl bg-gold text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    Enviar auditoría <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="glass-card rounded-[32px] border border-white/10 p-8 space-y-5">
            <div className="flex items-center gap-3 text-white">
              <Radio className="w-6 h-6 text-gold" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Diagnóstico IA</p>
                <h4 className="text-xl font-black">Análisis previo</h4>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 p-5 space-y-2 bg-black/30">
              <p className="text-sm text-white/80">{diagnosticHint}</p>
              <p className="text-xs text-white/50">Protocolos: IEC 61850, CIP-013, Anexo 4.1</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[11px] uppercase tracking-[0.3em] text-white/70">
              <div className="rounded-2xl border border-white/10 p-4 flex flex-col gap-1">
                <span>Score esperado</span>
                <strong className="text-2xl">72%</strong>
              </div>
              <div className="rounded-2xl border border-white/10 p-4 flex flex-col gap-1">
                <span>Brechas críticas</span>
                <strong className="text-2xl">08</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {timeline.map((step) => (
            <div key={step.label} className="glass-card rounded-[32px] border border-white/10 p-6 space-y-2">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-gold" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{step.metric}</p>
              </div>
              <h4 className="text-lg font-black uppercase">{step.label}</h4>
              <p className="text-sm text-white/70">{step.detail}</p>
            </div>
          ))}
        </section>

        <section className="glass-card rounded-[40px] border border-white/10 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">SLA Modernización</p>
            <h3 className="text-3xl font-black text-white">Cumplimiento operativo en 45 días</h3>
            <p className="text-sm text-white/70">Diagnóstico remoto en 72h · Plan físico en 2 semanas · Recambio supervisado</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary">Descargar playbook</button>
            <button className="btn-primary">Hablar con especialista</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernizationPage;
