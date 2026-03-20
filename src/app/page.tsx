"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, Server, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import { LeadGenModal } from "@/components/LeadGenModal";
import { OrchestratorChat } from "@/components/OrchestratorChat";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleGatedAction = () => {
    if (!isRegistered) {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-start min-h-screen pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-success/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header / Hero Section */}
      <div className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-muted/50 text-sm font-medium text-accent-foreground mb-6 backdrop-blur-md"
        >
          <Zap className="w-4 h-4 text-accent" />
          <span>Inteligencia Artificial para el SEN Chileno</span>
        </motion.div>
        
        <motion.h1 
          className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Cumplimiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Normativo CEN</span> sin fricción
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          El primer sistema Multi-Agente diseñado exclusivamente para Generadores, Transmisores y PMGD. Obtén claridad instantánea sobre NTSyCS, SITR, EDAC y más.
        </motion.p>
      </div>

      {/* RAG Search / Orchestrator Entry Point */}
      <motion.div 
        className="w-full max-w-3xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/50 to-cyan-500/50 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-40"></div>
          <div className="relative bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center">
            <div className="pl-4 pr-2 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              className="w-full bg-transparent border-none text-white text-lg focus:outline-none placeholder-gray-500 py-4"
              placeholder="Ej: ¿Cuáles son las redundancias exigidas para SITR en subestaciones?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={handleGatedAction}
              className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
            >
              Consultar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      {!isRegistered && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            onClick={handleGatedAction}
            className="text-left bg-[#0F172A]/60 backdrop-blur-lg border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors group cursor-pointer"
          >
            <div className="bg-accent/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Server className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3 flex items-center gap-2">
              Auditoría Express SITR
            </h3>
            <p className="text-gray-400">Sube tu diagrama de red y recibe un informe automatizado sobre brechas de cumplimiento NTSyCS.</p>
          </button>

          <button 
            onClick={handleGatedAction}
            className="text-left bg-[#0F172A]/60 backdrop-blur-lg border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors group cursor-pointer"
          >
            <div className="bg-success/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3 flex items-center gap-2">
              Lazo Cerrado EDAC
            </h3>
            <p className="text-gray-400">Servicio guiado de pruebas operativas. Valida tus tiempos de desconexión contra la norma empíricamente.</p>
          </button>

          <button 
            onClick={handleGatedAction}
            className="text-left bg-[#0F172A]/60 backdrop-blur-lg border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors group cursor-pointer"
          >
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3">Generación de Leads</h3>
            <p className="text-gray-400">Obtén reportes y arquitecturas tipo personalizadas a cambio de tu registro estructurado.</p>
          </button>
        </motion.div>
      )}

      {/* Orchestrator Chat Area */}
      {isRegistered && (
        <motion.div
          className="w-full z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <OrchestratorChat userProfile={userProfile} />
        </motion.div>
      )}

      <LeadGenModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(profileData) => {
          setUserProfile(profileData);
          setIsRegistered(true);
          setIsModalOpen(false);
        }} 
      />
    </main>
  );
}
