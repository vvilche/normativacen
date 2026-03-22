"use client";

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

interface PDFButtonProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  slug: string;
}

export default function PDFButton({ printRef, slug }: PDFButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(printRef.current, { 
        scale: 3, // High resolution for professional text
        useCORS: true,
        backgroundColor: '#ffffff', // Force white background for the PDF report
        windowWidth: 1200 // Ensure consistent layout during capture
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`NormativaCEN_Reporte_${slug}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setFinished(true);
      setTimeout(() => setFinished(false), 3000);

      await fetch('/api/auth/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'download' })
      });
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExportPDF}
      disabled={exporting}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border ${
        finished 
          ? 'bg-green-500 text-white border-green-400' 
          : 'bg-primary text-primary-foreground border-primary/20'
      }`}
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : finished ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {exporting ? 'GENERANDO...' : finished ? 'LISTO' : 'EXPORTAR PDF'}
    </button>
  );
}
