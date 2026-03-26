"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookmarkPlus, AlertTriangle, CheckCircle2, Send, ChevronDown, ChevronUp } from "lucide-react";

interface FeedbackWidgetProps {
  messageId: string;
  agentType: string;
  query: string;
  response: string;
  hallazgo?: string | null;
  metrics?: any[];
  seoTags?: string[];
  userProfile?: any;
}

export function FeedbackWidget({
  messageId,
  agentType,
  query,
  response,
  hallazgo,
  metrics = [],
  seoTags = [],
  userProfile,
}: FeedbackWidgetProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isGolden, setIsGolden] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correction, setCorrection] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const submitFeedback = async (overrideGolden?: boolean) => {
    if (rating === 0 && !correction) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          response,
          agentType,
          hallazgo,
          metrics,
          seoTags,
          rating,
          isGoldenExample: overrideGolden ?? (isGolden && rating >= 4),
          correction: correction || null,
          userProfile,
        }),
      });

      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      if (data.success) setTimeout(() => setIsCollapsed(true), 2000);
    } catch {
      setStatus("error");
    }
  };

  const agentLabel: Record<string, string> = {
    edacAgent: "Agente EDAC",
    sitrAgent: "Agente SITR",
    ssccAgent: "Agente SSCC",
    bessAgent: "Agente BESS",
    cibersegAgent: "Agente Ciberseg",
    proceduralAgent: "Agente Procedimental",
    generacionAgent: "Agente Generación",
    transmisionAgent: "Agente Transmisión",
  };

  if (isCollapsed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 bg-[#0F172A]/80 border border-white/5 rounded-xl p-3 w-full"
    >
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(c => !c)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
          Califica la respuesta — {agentLabel[agentType] || agentType}
        </span>
        {isCollapsed ? <ChevronDown className="w-3 h-3 text-gray-600" /> : <ChevronUp className="w-3 h-3 text-gray-600" />}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {status === "success" ? (
              <div className="flex items-center gap-2 mt-3 text-success text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isGolden && rating >= 4 ? "✅ Guardado como caso de referencia para el aprendizaje del agente." : "Feedback registrado. ¡Gracias!"}</span>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {/* Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="text-[10px] text-gray-500 self-center ml-2">
                      {["", "Muy básico", "Mejorable", "Suficiente", "Buena respuesta", "Referencia de calidad"][rating]}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2"
                  >
                    {rating >= 4 && (
                      <button
                        onClick={() => { setIsGolden(true); submitFeedback(true); }}
                        disabled={status === "loading"}
                        className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-lg transition-colors font-black uppercase tracking-wider"
                      >
                        <BookmarkPlus className="w-3 h-3" />
                        Guardar como Referencia
                      </button>
                    )}

                    <button
                      onClick={() => setShowCorrection(v => !v)}
                      className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg transition-colors font-black uppercase tracking-wider"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Reportar Imprecisión
                    </button>

                    {!showCorrection && (
                      <button
                        onClick={() => submitFeedback(false)}
                        disabled={status === "loading"}
                        className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        {status === "loading" ? "Enviando..." : "Enviar"}
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Correction textarea */}
                <AnimatePresence>
                  {showCorrection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <textarea
                        rows={2}
                        value={correction}
                        onChange={(e) => setCorrection(e.target.value)}
                        placeholder="¿Qué fue impreciso? p.ej. 'Faltó mencionar CIP-013 en el análisis de supply chain'"
                        className="w-full bg-[#1E293B] border border-white/10 text-white text-xs placeholder-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:border-orange-500/40"
                      />
                      <button
                        onClick={() => submitFeedback(false)}
                        disabled={!correction.trim() || status === "loading"}
                        className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 disabled:opacity-50 text-orange-300 border border-orange-500/30 rounded-lg transition-colors font-black uppercase tracking-wider"
                      >
                        <Send className="w-3 h-3" />
                        {status === "loading" ? "Enviando..." : "Enviar Corrección"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
