"use client";

import { motion } from "framer-motion";
import { FileDown, Calendar, User } from "lucide-react";
import { WhitePaper } from "@/lib/data/whitePapers";
import Link from "next/link";

interface WhitePaperCardProps {
  paper: WhitePaper;
}

export function WhitePaperCard({ paper }: WhitePaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#161B29]/40 backdrop-blur-xl border border-white-[0.03] rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
    >
      {/* Abstract Industrial Header */}
      <div className="relative h-24 overflow-hidden bg-[#0D111C]">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '12px 12px' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold/40 group-hover:text-gold/60 transition-colors shadow-gold">
                <FileDown className="w-6 h-6" />
            </div>
        </div>
        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[8px] font-technical text-gray-500 uppercase tracking-widest">
            v{paper.id}.2.4
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
            <span className="px-1.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[8px] text-gold font-black uppercase tracking-widest">
                {paper.category}
            </span>
        </div>
        
        <h4 className="font-heading font-black text-white text-[13px] leading-snug mb-3 line-clamp-2 italic group-hover:text-gold transition-colors">
            {paper.title}
        </h4>
        
        <div className="grid grid-cols-2 gap-3 mb-5 border-t border-white/5 pt-3">
            <div className="space-y-0.5">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Autor</span>
                <span className="text-[10px] text-gray-400 font-medium truncate italic">{paper.author}</span>
            </div>
            <div className="space-y-0.5">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Fecha</span>
                <span className="text-[10px] text-gray-400 font-technical italic">{paper.date}</span>
            </div>
        </div>

        <Link 
          href={paper.downloadUrl}
          className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-gold hover:text-black border border-white/5 text-gray-400 text-[10px] font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase active:scale-[0.98] shadow-gold"
        >
            VER DOCUMENTO
        </Link>
      </div>
    </motion.div>
  );
}
