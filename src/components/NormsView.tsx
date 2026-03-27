"use client";

import React from 'react';
import { Book, Scale, ExternalLink, ChevronRight } from 'lucide-react';

const mockNorms = [
  { id: "NTSyCS-2025", title: "Norma Técnica de Seguridad y Calidad de Servicio", current: true, category: "SITR" },
  { id: "DS88", title: "Reglamento para Medios de Generación de Pequeña Escala", current: true, category: "PMGD" },
  { id: "RGR-04-2020", title: "Requisitos de Inyección de Energía Reactiva", current: true, category: "Generación" },
  { id: "NERC-CIP-003", title: "Ciberseguridad en Infraestructura Crítica", current: true, category: "Cyber" },
];

export function NormsView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-white italic">Base Normativa Vigente</h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-technical">Estándares y Reglamentación del Coordinador Eléctrico Nacional</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockNorms.map((norm) => (
          <div key={norm.id} className="bg-[#161B29]/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl hover:border-gold/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-gold/10 transition-colors" />
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-gold/40 group-hover:text-gold transition-all">
                <Book className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[8px] text-success font-black uppercase tracking-widest">
                VIGENTE
              </span>
            </div>

            <div className="space-y-1 mb-6">
                <span className="text-[10px] font-technical text-gray-500 font-black uppercase tracking-[0.2em]">{norm.category}</span>
                <h3 className="text-white font-black text-lg group-hover:text-gold transition-colors leading-tight italic">{norm.title}</h3>
                <p className="text-xs text-gray-500 font-technical mt-1 uppercase tracking-tighter">{norm.id}</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-2.5 rounded-xl bg-gold text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-gold">
                CONSULTAR AI <Scale className="w-3.5 h-3.5" />
              </button>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
