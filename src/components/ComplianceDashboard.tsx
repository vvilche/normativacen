"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  Activity,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

export function ComplianceDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Upper Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<ShieldCheck className="text-success" />} 
          label="Compliance Score" 
          value={`${data.globalScore}%`} 
          sub="Promedio Sistémico"
        />
        <StatCard 
          icon={<AlertTriangle className="text-critical" />} 
          label="Riesgos Críticos" 
          value={data.criticalRisks} 
          sub="Acción Requerida"
          highlight
        />
        <StatCard 
          icon={<DollarSign className="text-warning" />} 
          label="Exposición SEC" 
          value={`${data.totalExposureUTA} UTA`} 
          sub="Multas Estimadas"
        />
        <StatCard 
          icon={<Activity className="text-accent" />} 
          label="Activos Monitoreados" 
          value={data.totalAssets} 
          sub="Matriz 9 Agentes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap/Segments */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Formato: Industrial Engineering White Paper
          </h3>
          <div className="space-y-6">
            {data.segments.map((seg: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-300 font-medium">{seg.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    seg.status === 'success' ? 'bg-success/10 text-success' : 
                    seg.status === 'critical' ? 'bg-critical/10 text-critical' : 'bg-warning/10 text-warning'
                  }`}>
                    {seg.status}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.score}%` }}
                    className={`h-full ${
                      seg.status === 'success' ? 'bg-success' : 
                      seg.status === 'critical' ? 'bg-critical' : 'bg-warning'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Critical Risks */}
        <div className="bg-[#0B1221] border border-critical/20 p-6 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-critical" />
            Top Riesgos Detectados
          </h3>
          <div className="space-y-4">
            {data.topRisks.map((risk: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-critical">{risk.id}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{risk.imp}</span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-accent transition-colors">{risk.asset}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{risk.type}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-all hover:translate-y-[-2px] ${
      highlight ? 'bg-critical/5 border-critical/30 ring-1 ring-critical/20' : 'bg-[#1E293B]/40 border-white/5 hover:border-gold/20'
    }`}>
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 group-hover:border-gold/20">
        {icon}
      </div>
      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-black text-white italic">{value}</h3>
      <p className="text-[10px] text-slate-500 mt-1 font-medium">{sub}</p>
    </div>
  );
}
