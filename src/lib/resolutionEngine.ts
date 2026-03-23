export interface Evidence {
    source: string;
    text: string;
}

export interface Step {
    id: string;
    task: string;
    priority: "CRÍTICA" | "Alta" | "Media";
}

export interface Control {
    id: string;
    label: string;
    status: "MET" | "FAIL";
}

export interface KPIs {
    score: string;
    risk: "LOW" | "MEDIUM" | "HIGH";
    latency: string;
    protocol: string;
}

export interface Resolution {
    id: string;
    type: string;
    verdict: string;
    antecedentes: Evidence[];
    acciones: Step[];
    confianza: number;
    date: string;
    controls: Control[];
    kpis: KPIs;
}

const resolutions: Record<string, Resolution> = {
    BESS: {
        id: "CEN-BESS-2025-001",
        type: "Técnico-Operativo",
        verdict: "El Sistema de Almacenamiento (BESS) presenta desviaciones en la latencia de respuesta SITR (> 2s), comprometiendo su participación en Servicios Complementarios.",
        date: "22 Mar 2026",
        confianza: 98,
        controls: [
            { id: "TC-BESS-001", label: "PTP Sync", status: "MET" },
            { id: "TC-BESS-002", label: "DNP3 Latency", status: "FAIL" },
            { id: "TC-BESS-003", label: "RTU Hardening", status: "MET" },
            { id: "TC-BESS-004", label: "Grid Stability", status: "MET" },
        ],
        kpis: {
            score: "88.2%",
            risk: "MEDIUM",
            latency: "2.1s",
            protocol: "NTSyCS 4.2"
        },
        antecedentes: [
            { source: "AT-SITR-1 (Marzo 2025)", text: "Las exigencias de latencia para activos BESS en Control de Frecuencia se han reducido a < 2 segundos." },
            { source: "NTSyCS Cap. 4.2", text: "La falta de visibilidad en tiempo real gatilla la Indisponibilidad del Activo para SSCC." },
            { source: "NERC CIP-007", text: "El endurecimiento de puertos en RTU no debe comprometer la velocidad de conmutación DNP3." }
        ],
        acciones: [
            { id: "B1", task: "Optimización de FW: Configurar Fast-Path en Firewall Perimetral para tráfico DNP3.", priority: "CRÍTICA" },
            { id: "B2", task: "Calibrar reloj maestro IEEE 1588 PTP para eliminar drift de 1.2s.", priority: "Alta" },
            { id: "B3", task: "Notificar al Coordinador (CEN) sobre ventana de mantenimiento de 15 min.", priority: "Media" }
        ]
    },
    PMGD: {
        id: "CNE-PMGD-2024-088",
        type: "Regulatorio-Económico",
        verdict: "Inyección de excedentes en Media Tensión excede los límites de fluctuación del DS88 (+/- 7%), arriesgando multas del regulador.",
        date: "20 Mar 2026",
        confianza: 97,
        controls: [
            { id: "TC-PMGD-101", label: "Volt-VAR Drop", status: "FAIL" },
            { id: "TC-PMGD-102", label: "Grid Stability", status: "MET" },
            { id: "TC-PMGD-103", label: "Inverter Comm", status: "MET" },
        ],
        kpis: {
            score: "92.5%",
            risk: "LOW",
            latency: "450ms",
            protocol: "DS88 / MT"
        },
        antecedentes: [
            { source: "Reglamento DS 88", text: "Obligación de coordinación con la distribuidora para el vertimiento de excedentes." },
            { source: "NT Distribución Cap. 5", text: "Límites de inyección por capacidad de transformación local y estabilidad de tensión." },
            { source: "Res. CNE 125/2024", text: "Nuevo régimen de precios estabilizados para PMGD aplicable a partir de 2025." }
        ],
        acciones: [
            { id: "P1", task: "Ajuste de Inversores: Configurar control Volt-VAR en modo Droop.", priority: "CRÍTICA" },
            { id: "P2", task: "Actualizar Anexo de Inyección con la Distribuidora local.", priority: "Alta" },
            { id: "P3", task: "Implementar telemetría de excedentes via 4G/LTE para reportes horarios.", priority: "Media" }
        ]
    },
    TRANSMISION: {
        id: "CIP-NEXUS-2025-014",
        type: "Ciberseguridad-NERC",
        verdict: "Hallazgos de vulnerabilidad física y lógica en Subestación Seccionadora 220kV representan riesgo de inestabilidad sistémica (Efecto Dominó).",
        date: "18 Mar 2026",
        confianza: 99,
        controls: [
            { id: "TC-NERC-011", label: "Physical Perim", status: "FAIL" },
            { id: "TC-NERC-012", label: "DMZ Auth", status: "MET" },
            { id: "TC-NERC-013", label: "OT Segment", status: "MET" },
        ],
        kpis: {
            score: "76.4%",
            risk: "HIGH",
            latency: "12ms",
            protocol: "CIP-014"
        },
        antecedentes: [
            { source: "NTSyCS 2025 (Seguridad)", text: "Exigencia de segmentación lógica total entre red de operación (OT) y administrativa (IT)." },
            { source: "NERC CIP-014", text: "Requisitos de protección física y lógica para Infraestructura Crítica Sistémica (ICS)." },
            { source: "NERC CIP-010", text: "Gestión de configuración basal (Baseline) para RTUs y Protecciones Digitales." }
        ],
        acciones: [
            { id: "T1", task: "Endurecimiento de RTU: Deshabilitar puertos USB no utilizados y aplicar sellado.", priority: "CRÍTICA" },
            { id: "T2", task: "Implementar DMZ industrial con autenticación MFA para acceso de vendors.", priority: "Alta" },
            { id: "T3", task: "Generar 'Golden Core Image' para monitorear desviaciones de firmware.", priority: "Media" }
        ]
    },
    PMU: {
        id: "CEN-RM-2023-042",
        type: "Regulatorio",
        verdict: "El Phasor Measurement Unit (PMU) SEL-487E cumple con los requisitos de la norma CEN-REG-ELEC-2022 para Medición Sincrofasorial.",
        date: "27 Oct 2023",
        confianza: 99,
        controls: [
            { id: "TC-PMU-001", label: "Phasor Sync", status: "MET" },
            { id: "TC-PMU-002", label: "C37.118 Frame", status: "MET" },
            { id: "TC-PMU-003", label: "GPS Accuracy", status: "MET" },
        ],
        kpis: {
            score: "99.2%",
            risk: "LOW",
            latency: "42ms",
            protocol: "CEN-REG-2022"
        },
        antecedentes: [
            { source: "NTSyCS Cap. 5 Art. 3.2", text: "Toda instalación de generación o subestación crítica debe contar con redundancia PMU para visibilidad fasorial." },
            { source: "Procedimiento DP-042 CEN", text: "Los equipos PMU deben cumplir con el estándar IEEE C37.118 y latencia < 100ms." }
        ],
        acciones: [
            { id: "M1", task: "Instalar Unidades de Medición Fasorial (PMU) en las barras de 110kV.", priority: "CRÍTICA" },
            { id: "M2", task: "Configurar Gateway SITR para transporte de tramas Sincrofasoriales.", priority: "Alta" },
            { id: "M3", task: "Verificar sincronismo GPS con precisión < 100us.", priority: "Alta" }
        ]
    }
};

export function getResolutionByQuery(query: string): Resolution {
    const q = query.toLowerCase();
    
    if (q.includes("bess") || q.includes("almacenamiento") || q.includes("batería")) return resolutions.BESS;
    if (q.includes("pmgd") || q.includes("distribución") || q.includes("solar")) return resolutions.PMGD;
    if (q.includes("transmisión") || q.includes("subestación") || q.includes("nerc") || q.includes("cip")) return resolutions.TRANSMISION;
    if (q.includes("pmu") || q.includes("fasor") || q.includes("sincro")) return resolutions.PMU;
    
    return resolutions.PMGD;
}
