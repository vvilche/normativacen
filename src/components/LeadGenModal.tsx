"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle2, Key, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface LeadGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function LeadGenModal({ isOpen, onClose, onSuccess }: LeadGenModalProps) {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    segment: "",
    activeAsset: "",
  });
  
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          email: formData.email, 
          password: 'password123', // Default for passwordless-style flow via OTP
          role: 'coordinado'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar registro');

      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify', 
          email: formData.email, 
          code: otpCode 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Código inválido');

      // Persistence for unified flow
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userProfile', JSON.stringify(formData));

      onSuccess(formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
              <div className="h-1.5 bg-gradient-to-r from-accent via-cyan-400 to-success" />
              
              <div className="p-6 md:p-8">
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {step === 'form' ? <Lock className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">
                      {step === 'form' ? 'Registro de Auditoría' : 'Verificación de Seguridad'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {step === 'form' ? 'Identificación técnica para el Coordinador.' : `Ingresa el código enviado a ${formData.email}`}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}
                
                {step === 'form' ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Nombre</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Juan Pérez"
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-gray-700 text-sm"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Corporativo</label>
                        <input 
                          required
                          type="email" 
                          placeholder="juan@empresa.cl"
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-gray-700 text-sm"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Empresa</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Generadora Solar"
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-gray-700 text-sm"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Cargo</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Ingeniero SCADA"
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-gray-700 text-sm"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Segmento / Sector</label>
                        <select 
                          required
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all cursor-pointer text-sm font-medium"
                          value={formData.segment}
                          onChange={(e) => setFormData({...formData, segment: e.target.value})}
                        >
                          <option value="" disabled>Seleccionar Segmento</option>
                          <optgroup label="Suministro / Redes" className="bg-[#0B1221] text-accent font-bold">
                            <option value="Generación">Generación (Renovable / Convencional)</option>
                            <option value="Transmisión">Transmisión (Nacional / Zonal / Dedicada)</option>
                            <option value="Distribución">Distribución</option>
                            <option value="PMGD">PMGD / PMG (Pequeños Medios)</option>
                          </optgroup>
                          <optgroup label="Sectores Industriales / Libres" className="bg-[#0B1221] text-accent font-bold">
                            <option value="Minería">Minería (Metálica y No Metálica)</option>
                            <option value="Celulosa">Celulosa, Pulpa y Papel</option>
                            <option value="Químicas">Industrias Químicas y Petroquímicas</option>
                            <option value="Siderurgia">Siderurgia y Metalurgia</option>
                            <option value="Alimentos">Alimentos y Agroindustria</option>
                            <option value="Otras">Otras Industrias / Cliente Libre</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Activo Crítico a Auditar</label>
                        <select 
                          required
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl p-3.5 text-white focus:outline-none focus:border-accent transition-all cursor-pointer text-sm font-medium"
                          value={formData.activeAsset}
                          onChange={(e) => setFormData({...formData, activeAsset: e.target.value})}
                        >
                          <option value="" disabled>Seleccionar Activo</option>
                          <optgroup label="Infraestructura de Energía" className="bg-[#0B1221] text-success font-bold">
                            <option value="Central_Generacion">Central de Generación (Unidades)</option>
                            <option value="BESS">Sistema BESS (Almacenamiento)</option>
                            <option value="Subestacion">Subestación Eléctrica / Patio</option>
                            <option value="Linea_Alta_Tension">Línea de Alta Tensión</option>
                          </optgroup>
                          <optgroup label="Sistemas de Control y Medida" className="bg-[#0B1221] text-success font-bold">
                            <option value="SITR">Sistema SITR (Telemetría TR)</option>
                            <option value="EDAC_EDAG">Sistema EDAC / EDAG (Desconexión)</option>
                            <option value="PMU_MMF">Sistema PMU / MMF (Medición Fasorial)</option>
                          </optgroup>
                          <optgroup label="Demanda" className="bg-[#0B1221] text-success font-bold">
                            <option value="Planta_Industrial">Planta / Faena Industrial</option>
                            <option value="Centro_Carga">Centro de Carga / Conexión</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full mt-6 bg-accent hover:shadow-[0_0_20px_rgba(45,108,223,0.3)] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Siguiente: Verificación OTP
                        </>
                      )}
                    </button>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                      <p className="text-gray-500 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <a href="/login" className="text-accent font-bold hover:underline transition-all">
                          Inicia sesión aquí
                        </a>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="000000"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0F172A] border border-white/5 focus:border-accent outline-none transition-all text-center tracking-[0.8em] text-2xl font-mono text-white"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl bg-success text-white font-bold hover:shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar e Ingresar'}
                      {!isLoading && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      ← Volver a editar datos
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
