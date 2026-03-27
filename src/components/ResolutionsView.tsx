"use client";

import React from 'react';
import { FileText, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const mockResolutions = [
  { id: "RES-2026-001", title: "Auditoría Técnica SITR - Planta BESS Lampa", date: "27 Mar 2026", status: "Aprobado", slug: "sitr-ntsycs-2025" },
  { id: "RES-2026-002", title: "Validación de Caudales Hidro PMGD - Río Bueno", date: "26 Mar 2026", status: "Pendiente", slug: "hidro-pmgd" },
  { id: "RES-2025-452", title: "Esquema EDAC - Zona Centro Sur", date: "15 Dec 2025", status: "Aprobado", slug: "edac-auditoria" },
];

export function ResolutionsView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-white italic">Historial de Resoluciones</h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-technical">Registros de Auditoría Técnica 2025-2026</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockResolutions.map((res) => (
          <div key={res.id} className="bg-[#161B29]/40 border border-white/5 p-6 rounded-2xl backdrop-blur-xl hover:border-gold/30 transition-all group flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-gray-500 group-hover:text-gold transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-technical text-gold/60 font-black uppercase tracking-widest">{res.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${res.status === 'Aprobado' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {res.status}
                  </span>
                </div>
                <h3 className="text-white font-black text-lg group-hover:text-gold transition-colors italic">{res.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-technical uppercase">
                    <Clock className="w-3 h-3" /> {res.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-technical uppercase">
                    <ShieldCheck className="w-3 h-3 text-gold/40" /> Verificado Tung
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/documentacion/${res.slug}`}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-black group-hover:bg-gold transition-all flex items-center gap-2"
            >
              VER REPORTE <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
