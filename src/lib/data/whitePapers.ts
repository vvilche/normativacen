export interface WhitePaper {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  downloadUrl: string;
  imageUrl?: string;
}

export const whitePapers: WhitePaper[] = [
  {
    id: "pmus-monitoreo",
    title: "Estabilidad del Sistema Eléctrico con PMUs",
    author: "Dr. A. Gómez",
    date: "27 Oct 2023",
    category: "SITR / Monitoreo",
    tags: ["PMU", "NTSyCS"],
    description: "Análisis de implementación de unidades de medición fasorial.",
    downloadUrl: "/documentacion/pmus-monitoreo",
  },
  {
    id: "hidro-pmgd",
    title: "Especialización Hidráulica para PMGD",
    author: "NormativaCEN Engineering",
    date: "27 Mar 2026",
    category: "Generación",
    tags: ["Hidro", "PMGD"],
    description: "Auditoría de activos hidráulicos y redundancia SITR.",
    downloadUrl: "/documentacion/hidro-pmgd",
  },
  {
    id: "sitr-ntsycs-2025",
    title: "Guía de Redundancia SITR / NTSyCS 2025",
    author: "Ing. M. Tapia",
    date: "02 Dec 2023",
    category: "Telecomunicaciones",
    tags: ["SITR", "Ciberseguridad"],
    description: "Prácticas para cumplimiento de norma NTSyCS.",
    downloadUrl: "/documentacion/sitr-ntsycs-2025",
  },
  {
    id: "edac-auditoria",
    title: "Esquemas de Desconexión de Carga (EDAC)",
    author: "Agencia Compliance AI",
    date: "10 Jan 2024",
    category: "Protecciones",
    tags: ["EDAC", "Estabilidad"],
    description: "Evaluación de requisitos de visibilidad para el CEN.",
    downloadUrl: "/documentacion/edac-auditoria",
  }
];
