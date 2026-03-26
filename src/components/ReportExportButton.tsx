"use client";

import React from 'react';
import { Download, FileText, Share2 } from 'lucide-react';
import { TechnicalReport } from '../lib/reportingEngine';
import { jsPDF } from 'jspdf';

interface ReportExportButtonProps {
  report: TechnicalReport | null;
}

export const ReportExportButton: React.FC<ReportExportButtonProps> = ({ report }) => {
  if (!report) return null;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- Header ---
    doc.setFillColor(15, 23, 42); // Navy Blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CONECTA COMPLIANCE', 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INDUSTRIAL ENGINEERING WHITE PAPER - TUNG V2', 15, 30);
    doc.text(`ID: ${report.id}`, pageWidth - 70, 20);
    doc.text(`FECHA: ${report.date}`, pageWidth - 70, 30);

    // --- Body ---
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(report.title, 15, 55);
    
    doc.setDrawColor(45, 108, 223); // Accent Blue
    doc.setLineWidth(1);
    doc.line(15, 58, 60, 58);

    // Coordinado
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`COORDINADO: ${report.coordinado}`, 15, 68);
    doc.text(`ESPECIALISTA: ${report.agentType.toUpperCase()}`, 15, 73);

    // Veredicto
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('VEREDICTO TÉCNICO:', 15, 85);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitVerdict = doc.splitTextToSize(report.verdict, pageWidth - 30);
    doc.text(splitVerdict, 15, 92);

    // Hallazgos
    const hallazgoY = 92 + (splitVerdict.length * 5) + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('ANALISIS DE HALLAZGOS:', 15, hallazgoY);
    
    doc.setFont('helvetica', 'normal');
    const splitHallazgo = doc.splitTextToSize(report.hallazgo, pageWidth - 30);
    doc.text(splitHallazgo, 15, hallazgoY + 7);

    // Plan de Acción
    const actionY = hallazgoY + (splitHallazgo.length * 5) + 15;
    doc.setFont('helvetica', 'bold');
    doc.text('PLAN DE ACCIÓN RECOMENDADO:', 15, actionY);
    
    doc.setFont('helvetica', 'normal');
    report.actionPlan.forEach((action, index) => {
        const yPos = actionY + 10 + (index * 15); // Aumentar espacio entre items
        doc.setFillColor(241, 245, 249);
        doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${action.id}:`, 20, yPos + 1);
        
        doc.setFont('helvetica', 'normal');
        const splitAction = doc.splitTextToSize(action.task, pageWidth - 80);
        doc.text(splitAction, 30, yPos + 1);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`[PRIORIDAD: ${action.priority}]`, pageWidth - 45, yPos + 1);
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('DOCUMENTO GENERADO POR NORMATAIVACEN ORCHESTRATOR - CONFIDENCIALIDAD INDUSTRIAL', 15, 285);
    doc.text('PAGINA 1/1', pageWidth - 30, 285);

    alert("PDF generado con éxito. Iniciando descarga del White Paper...");
    doc.save(`${report.id}_Technical_WhitePaper.pdf`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: report.hallazgo,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group/action-bar">
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/action-bar:opacity-100 transition-opacity" />
      
      <div className="flex-1 flex items-center gap-4 z-10">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
        </div>
        <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                Generar Dossier Técnico
                <span className="text-[10px] text-gray-600 font-technical lowercase">v7.2.5</span>
            </h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium font-technical italic">
                {report.id} · Industrial Engineering White Paper (Tung V2)
            </p>
        </div>
      </div>
      
      <div className="flex gap-3 z-10 w-full sm:w-auto">
        <button 
          onClick={handleShare}
          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
        
        <button 
          onClick={handleExportPDF}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-br from-accent to-blue-700 hover:brightness-110 active:scale-95 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-accent/20"
        >
          <Download className="w-4 h-4" />
          <span>EXPORTAR PDF</span>
        </button>
      </div>
    </div>
  );
};
