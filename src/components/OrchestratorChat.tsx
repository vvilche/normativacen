"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {  FileText, 
  Database, 
  Pin, 
  Activity,
  User, 
  Bot, 
  Send, 
  Loader2, 
  Sparkles, 
  Check, 
  Info,
  ChevronRight
} from "lucide-react";
import { FeedbackWidget } from "./FeedbackWidget";
import { ReportExportButton } from "./ReportExportButton";
import { TechnicalReport } from "../lib/reportingEngine";

interface UserProfile {
  name: string;
  role: string;
  company: string;
  coordinadoType: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isClosedLoop?: boolean;
  sources?: string[];
  // Tung metadata
  agentType?: string;
  hallazgo?: string | null;
  metrics?: any[];
  seoTags?: string[];
  resolution?: TechnicalReport | null; // Nuevo campo para el reporte completo
  query?: string; // original user query for feedback
}

interface OrchestratorChatProps {
  userProfile: UserProfile | null;
}

export function OrchestratorChat({ userProfile }: OrchestratorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `¡Hola ${userProfile?.name?.split(" ")[0] || "allí"}! Bienvenido a ConectaCompliance IA. He ajustado mi entorno para enfocarnos en normativa aplica a **${userProfile?.coordinadoType.replace("_", " ")}**.\n\n¿En qué te puedo ayudar hoy? Puedes subir una consulta sobre SITR, EDAC o cualquier duda operativa.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userProfile
        })
      });
      
      const data = await response.json();
      setIsTyping(false);
      
      if (response.ok) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
          isClosedLoop: data.isClosedLoop,
          // Tung metadata para el FeedbackWidget
          agentType: data.agentType || "sitrAgent",
          hallazgo: data.hallazgo || null,
          metrics: data.resolution?.metrics || [],
          seoTags: data.seoTags || [],
          resolution: data.resolution || null, // Guardamos el reporte completo
          query: input, // guardamos la query original antes de limpiarla
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lo siento, ha ocurrido un error al conectar con la base de datos oficial del CEN. Intenta más tarde.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleLoopFeedback = (id: string, satisfied: boolean) => {
    // Remove the loop flag from the specific message so buttons disappear
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isClosedLoop: false } : m));
    
    if (satisfied) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "¡Excelente! Este reporte ha sido guardado en tu historial. Si necesitas auditar otro sistema o tienes otra consulta, estoy a tu disposición.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "¿Qué detalle te gustaría profundizar o agregar? Puedes especificar parámetros o indicarme si la topología de red de tu empresa tiene alguna peculiaridad.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto glass-panel rounded-2xl shadow-2xl overflow-hidden mt-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-black text-white italic tracking-tight uppercase">Orquestador de Cumplimiento</h3>
            <p className="text-[9px] text-success/80 flex items-center gap-1 font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Nodo Activo
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
             <Activity className="w-3 h-3" /> Sistema de Soporte Normativo
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${msg.role === 'user' ? 'bg-white/5 text-white/60' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-xl ${msg.role === 'user' ? 'bg-primary/90 text-white rounded-tr-none' : 'bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none line-height-relaxed'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-6">{msg.content}</p>
                  
                  {/* Sources attached if any */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-2 border-t border-white/5">
                      <p className="text-[10px] text-white/30 mb-2 flex items-center gap-1 font-bold uppercase tracking-widest">
                        <FileText className="w-3 h-3" /> Fuentes:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((s, i) => (
                          <span key={i} className="text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-primary/80 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span className="text-[9px] font-medium text-white/20 uppercase tracking-tighter">{msg.timestamp}</span>
                  {msg.agentType && <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">[{msg.agentType}]</span>}
                </div>

                {/* Closed Loop + Feedback Widget */}
                {msg.role === "assistant" && msg.agentType && (
                  <FeedbackWidget
                    messageId={msg.id}
                    agentType={msg.agentType}
                    query={msg.query || ""}
                    response={msg.content}
                    hallazgo={msg.hallazgo}
                    metrics={msg.metrics || []}
                    seoTags={msg.seoTags || []}
                    userProfile={userProfile}
                  />
                )}

                {/* Report Export Button (Valor Agregado) */}
                {msg.role === "assistant" && msg.resolution && (
                  <div className="mt-3">
                    <ReportExportButton report={msg.resolution} />
                  </div>
                )}

                {msg.isClosedLoop && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-xl p-3 w-full max-w-sm"
                  >
                    <p className="text-xs text-gray-300 font-medium mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-accent" /> ¿La respuesta aborda tu consulta o te gustaría agregar más detalles?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleLoopFeedback(msg.id, true)}
                        className="flex-1 text-xs py-2 bg-success/10 hover:bg-success/20 text-success border border-success/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Reporte Completo
                      </button>
                      <button 
                        onClick={() => handleLoopFeedback(msg.id, false)}
                        className="flex-1 text-xs py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg transition-colors"
                      >
                        Desearía agregar más
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-accent/20 border border-accent/30 text-accent">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#1E293B] border border-white/5 rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0F172A] border-t border-white/10">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Consulta la normativa o indica tus ajustes..."
            className="w-full bg-[#1E293B] border border-white/10 text-white placeholder-gray-500 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-500 mt-2">
          El Agente Orquestador elabora sus respuestas basado en bases de datos reglamentarias oficiales del CEN publicadas hasta 2025.
        </p>
      </div>

    </div>
  );
}
