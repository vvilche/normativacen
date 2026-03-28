"use client";

import { motion } from "framer-motion";
import { Shield, TrendingDown, Settings, Lock, CheckCircle2 } from "lucide-react";

const steps = [
  { id: 1, label: "REQUEST_RECEIVED", agent: "Gateway", time: "08:41:01" },
  { id: 2, label: "LOGIC_ORCHESTRATION", agent: "Harness_V7", time: "08:41:03" },
  { id: 3, label: "NORMATIVE_AUDIT", agent: "Agente_CEN", time: "08:41:05" },
  { id: 4, label: "RISK_ASSESSMENT", agent: "Risk_Engine", time: "08:41:08" },
  { id: 5, label: "FINAL_VALIDATION", agent: "Compliance_Bot", time: "08:41:10" },
  { id: 6, label: "TECHNICAL_VERDICT", agent: "Aegis_AI", time: "08:41:12" },
];

export function HarnessMonitor({ status = "idle" }: { status?: "idle" | "processing" | "complete" }) {
  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4 shadow-gold">
            <Settings className="w-3 h-3 animate-spin-slow" />
            <span>Multi-Agent Traceability</span>
        </div>
        <h3 className="text-xl font-heading font-black text-white italic tracking-tighter uppercase mb-6">
            {status === "processing" ? "Orquestando Resolución..." : "Trazabilidad de Inferencia"}
        </h3>

        {/* Industrial Progress Bar */}
        <div className="w-full h-4 bg-[#161B29] border border-white/5 rounded-full overflow-hidden p-1 relative">
            <div className="absolute inset-0 flex justify-between px-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-[15%] h-full border-r border-white/5 last:border-none" />
                ))}
            </div>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ 
                    width: status === "complete" ? "100%" : 
                           status === "processing" ? "60%" : "0%" 
                }}
                className="h-full bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full relative shadow-gold"
                transition={{ duration: 1.5, ease: "circOut" }}
            >
                {status === "processing" && (
                    <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-30"
                    />
                )}
            </motion.div>
        </div>
      </div>

      <div className="relative space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

        {steps.map((step, idx) => {
          const isPending = status === "processing" && idx > 2; // Mock progress
          const isActive = status === "processing" && idx === 2;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative pl-10 flex items-center justify-between group transition-all duration-500",
                isPending ? "opacity-30 grayscale" : "opacity-100"
              )}
            >
              {/* Node Dot */}
              <div className={cn(
                "absolute left-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 z-10",
                isPending
                    ? "bg-[#161B29] border-white/10 text-slate-700"
                    : isActive
                        ? "bg-gold border-gold shadow-gold text-black scale-110"
                        : "bg-success/20 border-success/30 text-success"
              )}>
                {isPending ? (
                    <span className="text-[10px] font-technical">{step.id}</span>
                ) : isActive ? (
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <Settings className="w-3 h-3" />
                    </motion.div>
                ) : (
                    <Shield className="w-3 h-3" />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-[11px] font-black text-white italic tracking-tighter uppercase">{step.label}</span>
                    <span className="h-px bg-white/5 flex-1" />
                    <span className="text-[9px] font-technical text-gray-600">{step.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Agente:</span>
                    <span className={cn(
                        "text-[9px] font-technical italic",
                        isActive ? "text-gold" : "text-slate-500"
                    )}>{step.agent}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {status === "processing" && (
        <div className="mt-12 p-4 rounded-xl bg-gold/5 border border-gold/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-ping shadow-gold" />
                <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] leading-relaxed">
                    Sintetizando evidencias normativas vigentes...
                </p>
            </div>
        </div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
