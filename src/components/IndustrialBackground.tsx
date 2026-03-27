"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function IndustrialBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-20 overflow-hidden bg-[#0B0F1A]">
      {/* Base Industrial Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-[#0D1424] to-[#0B0F1A]" />
      
      {/* Animated Grid Layer */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-industrial-grid opacity-20" 
      />

      {/* Atmospheric Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-gold/10 blur-[130px] rounded-full" />

      {/* Scanline/Technical Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
