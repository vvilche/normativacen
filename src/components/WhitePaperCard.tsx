"use client";

import { motion } from "framer-motion";
import { FileDown, Calendar, User } from "lucide-react";
import { WhitePaper } from "@/lib/data/whitePapers";

interface WhitePaperCardProps {
  paper: WhitePaper;
}

export function WhitePaperCard({ paper }: WhitePaperCardProps) {
  // Map categories to some placeholder images for the mockup feel
  const getThumbnail = (category: string) => {
    if (category.includes("SITR")) return "https://images.unsplash.com/photo-1558485940-8473c4d51622?q=80&w=300&auto=format&fit=crop";
    if (category.includes("PMU")) return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300&auto=format&fit=crop";
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
    >
      {/* Thumbnail area with Image */}
      <div className="relative h-44 overflow-hidden">
        <img 
            src={getThumbnail(paper.category)} 
            alt={paper.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60" />
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">White Paper</span>
        
        <h4 className="font-heading font-bold text-white text-base leading-tight mb-4 line-clamp-2">
            {paper.title}
        </h4>
        
        <div className="space-y-2 mb-6 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
            <div className="flex items-center gap-1.5">
                <span>Autor:</span>
                <span className="text-gray-300">{paper.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span>Fecha:</span>
                <span className="text-gray-300">{paper.date}</span>
            </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-[#2D6CDF] hover:bg-[#3B82F6] text-white text-xs font-black tracking-widest transition-all flex items-center justify-center gap-2 group/btn shadow-[0_4px_15px_rgba(45,108,223,0.3)]">
            DESCARGAR PDF
            <FileDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
