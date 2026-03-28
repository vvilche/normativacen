"use client";

import { BookOpen, ClipboardList, FlaskConical, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseEducationArtifacts } from "@/lib/education/parseArtifacts";
import { cn } from "@/lib/utils";

interface EducationArtifactsPanelProps {
  content?: string | null;
  variant?: "guide" | "expert";
  className?: string;
}

export function EducationArtifactsPanel({ content, variant = "guide", className }: EducationArtifactsPanelProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const sections = parseEducationArtifacts(content);
  const isGuide = variant === "guide";
  const infoBlocks = [
    { label: "Microlección", icon: BookOpen, body: sections.microlesson },
    { label: "Checklist", icon: ClipboardList, body: sections.checklist },
    { label: "Plan de práctica", icon: FlaskConical, body: sections.practice },
  ].filter((block) => !!block.body);

  return (
    <div className={cn("education-panel rounded-2xl border p-6 space-y-5", className)} data-variant={variant}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
            Ruta educativa NormativaCEN
          </p>
          <h4 className="text-lg md:text-xl font-semibold">
            Microlecciones accionables
          </h4>
        </div>
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-current opacity-80">
          {isGuide ? "Modo guía" : "Modo operativo"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {infoBlocks.map(({ label, icon: Icon, body }) => (
          <div
            key={label}
            className={cn(
              "rounded-xl p-4 border space-y-3",
              isGuide ? "bg-white border-[rgba(13,30,37,0.08)]" : "bg-black/20 border-white/10"
            )}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Icon className={cn("w-4 h-4", isGuide ? "text-[#1A237E]" : "text-cyan-300") } />
              <span>{label}</span>
            </div>
            <div className="markdown-output text-[12px] leading-relaxed text-inherit">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {body || ""}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {sections.cta && (
        <div
          className={cn(
            "rounded-xl p-4 flex items-center gap-3 border",
            isGuide ? "bg-[#F7FAFF] border-[rgba(13,30,37,0.08)]" : "bg-white/5 border-white/10"
          )}
        >
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isGuide ? "bg-[#1A237E]/5" : "bg-white/10") }>
            <Sparkles className={cn("w-5 h-5", isGuide ? "text-[#1A237E]" : "text-white") } />
          </div>
          <div className="text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections.cta}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
