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
    id: "pmu-compliance-2025",
    title: "Asegurando la Estabilidad del Sistema Eléctrico con PMUs Avanzados",
    author: "Dr. A. Gómez",
    date: "27 Oct 2023",
    category: "SITR / Monitoreo",
    tags: ["PMU", "NTSyCS", "Sincrofasores"],
    description: "Análisis comparativo de estándares IEC/CEN para la implementación de unidades de medición fasorial en redes de alta tensión.",
    downloadUrl: "#",
  },
  {
    id: "bess-remuneration-chile",
    title: "Análisis Comparativo de Estándares IEC/CEN para Sincrofasores",
    author: "Ing. M. Tapia",
    date: "15 Nov 2023",
    category: "Almacenamiento",
    tags: ["BESS", "Arbitraje", "SSCC"],
    description: "Estudio sobre la remuneración de servicios complementarios y arbitraje de energía para sistemas BESS en el mercado chileno.",
    downloadUrl: "#",
  },
  {
    id: "sitr-redundancy-guide",
    title: "Guía de Redundancia Galvánica en Sistemas SITR",
    author: "NormativaCEN Research",
    date: "02 Dec 2023",
    category: "Telecomunicaciones",
    tags: ["SITR", "Ciberseguridad", "Redundancia"],
    description: "Mejores prácticas para el cumplimiento de la norma NERC-CIP y NTSyCS en infraestructura de comunicaciones crítica.",
    downloadUrl: "#",
  },
  {
    id: "pmgd-future-grid",
    title: "El Futuro de los PMGD: Integración y Desafíos de Visibilidad",
    author: "Agencia Compliance AI",
    date: "10 Jan 2024",
    category: "Generación Distribuida",
    tags: ["PMGD", "Visibilidad", "SITR"],
    description: "Evaluación de los nuevos requisitos del Coordinador para la visibilidad de inyectores distribuidos.",
    downloadUrl: "#",
  }
];
