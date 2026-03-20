"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Check, Info, FileText, Loader2, Sparkles } from "lucide-react";

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
  isClosedLoop?: boolean; // Indicates if this message requires validation/feedback
  sources?: string[]; // E.g., ["Estudio PMUS 2025", "NTSyCS Anexo"]
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
          isClosedLoop: data.isClosedLoop
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
    <div className="flex flex-col h-[85vh] w-full max-w-5xl mx-auto bg-[#0B1221]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden mt-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#0F172A]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white leading-tight">Agente Orquestador CEN</h3>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> En línea
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-300">{userProfile?.company || "Empresa"}</p>
          <p className="text-xs text-gray-500">{userProfile?.role || "Operador"}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-accent/20 border border-accent/30 text-accent'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-accent text-white rounded-tr-none' : 'bg-[#1E293B] border border-white/5 text-gray-200 rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                  
                  {/* Sources attached if any */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Fuentes consultadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((s, i) => (
                          <span key={i} className="text-[11px] bg-black/30 border border-white/5 px-2 py-1 rounded-md text-cyan-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>

                {/* Closed Loop Feedback Controls */}
                {msg.isClosedLoop && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-xl p-3 w-full max-w-sm"
                  >
                    <p className="text-xs text-gray-300 font-medium mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-accent" /> ¿La respuesta aborda tu consulta o te gustaría agregar más detalles para mejorar el reporte?
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
