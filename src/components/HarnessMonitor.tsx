"use client";

import { motion } from "framer-motion";
import { Shield, TrendingDown, Settings, Lock, CheckCircle2 } from "lucide-react";

const pillars = [
  { id: "normativo", label: "Normativo", icon: Shield, color: "text-blue-400", bg: "bg-blue-400/20" },
  { id: "economico", label: "Económico", icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-400/20" },
  { id: "operacional", label: "Operacional", icon: Settings, color: "text-emerald-400", bg: "bg-emerald-400/20" },
  { id: "cyber", label: "NERC CIP", icon: Lock, color: "text-red-400", bg: "bg-red-400/20" },
];

export function HarnessMonitor({ status = "idle" }: { status?: "idle" | "processing" | "complete" }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 flex flex-col items-center">
      {/* Central Hexagon (Harness) */}
      <div className="relative w-48 h-48 mb-12">
        <motion.div
          animate={status === "processing" ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-accent/30 rounded-full"
        />
        <div className="absolute inset-4 glass-panel rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
          <div className="text-center group">
            <h4 className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Harness</h4>
            <div className="text-2xl font-black text-white group-hover:scale-110 transition-transform">V6</div>
          </div>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-4 rounded-xl flex flex-col items-center gap-3 relative overflow-hidden ${status === "processing" ? "pillar-glow" : ""}`}
          >
            {status === "complete" && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 text-success"
              >
                <CheckCircle2 className="w-4 h-4" />
              </motion.div>
            )}
            <div className={`${pillar.bg} p-2 rounded-lg ${pillar.color}`}>
              <pillar.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">{pillar.label}</span>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={status === "processing" ? { width: "100%" } : status === "complete" ? { width: "100%" } : {}}
                 transition={{ duration: 2 + idx }}
                 className={`h-full ${pillar.color.replace('text', 'bg')}`}
               />
            </div>
          </motion.div>
        ))}
      </div>
      
      {status === "processing" && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-sm text-accent font-code animate-pulse"
        >
          Sintetizando Antecedentes y Acciones bajo Metodología Tung V2...
        </motion.p>
      )}
    </div>
  );
}
