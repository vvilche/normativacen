"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface LeadGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function LeadGenModal({ isOpen, onClose, onSuccess }: LeadGenModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    coordinadoType: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for lead capture
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(formData);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6"
          >
            <div className="bg-[#0B1221] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
              {/* Decorative Header */}
              <div className="h-2 bg-gradient-to-r from-accent via-cyan-400 to-success" />
              
              <div className="p-6 md:p-8">
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-accent/20 p-2 rounded-lg text-accent">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-white">
                    Acceso Requerido
                  </h2>
                </div>
                
                <p className="text-gray-400 mb-6 font-body leading-relaxed">
                  Te invitamos a conocer y aprender cómo mantener al día tus obligaciones con el CEN de forma sencilla. Cuéntanos un poco sobre tu rol y tipo de instalación para que nuestro Agente Especialista pueda entregarte respuestas, guías y auditorías adaptadas exactamente a tu realidad operativa.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300 font-medium">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ej: Juan Pérez"
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300 font-medium">Correo Corporativo</label>
                      <input 
                        required
                        type="email" 
                        placeholder="juan@empresa.cl"
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300 font-medium">Empresa Registrada en CEN</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ej: Generadora Solar SpA"
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300 font-medium">Cargo / Rol</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ej: Ingeniero SCADA"
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-gray-300 font-medium">Tipo de Coordinado / Sector Industrial</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                        value={formData.coordinadoType}
                        onChange={(e) => setFormData({...formData, coordinadoType: e.target.value})}
                      >
                        <option value="" disabled>Selecciona una clasificación principal</option>
                        
                        <optgroup label="Generación">
                          <option value="Generación_Renovable">Generación a Gran Escala (Renovable)</option>
                          <option value="Generación_Convencional">Generación a Gran Escala (Convencional)</option>
                          <option value="PMGD_PMG">PMGD / PMG</option>
                        </optgroup>
                        
                        <optgroup label="Transmisión y Distribución">
                          <option value="Transmisión">Transmisión (Nacional / Zonal / Dedicada)</option>
                          <option value="Distribución">Distribución</option>
                        </optgroup>

                        <optgroup label="Clientes Libres / Industria">
                          <option value="Industria_Mineria">Minería (Metálica y No Metálica)</option>
                          <option value="Industria_PulpaPapel">Celulosa, Pulpa y Papel</option>
                          <option value="Industria_Alimentos">Alimentos y Bebidas</option>
                          <option value="Industria_Siderurgia">Siderurgia y Metalurgia</option>
                          <option value="Industria_Otras">Otras Industrias / Cliente Libre General</option>
                        </optgroup>

                        <optgroup label="Otros Agentes">
                          <option value="SSCC">Prestador de Servicios Complementarios (SSCC)</option>
                          <option value="Comercializador">Comercializador de Energía</option>
                          <option value="Almacenamiento">Sistema de Almacenamiento Puro (BESS)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Configurando entorno del Coordinado...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Acceder al Agente de Normativa
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  Al continuar, aceptas recibir correos relacionados con alertas de cumplimiento normativo del CEN.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
