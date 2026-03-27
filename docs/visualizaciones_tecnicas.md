# Visualización del Ciclo de Vida de Auditoría Normativa

Como ingenieros, la trazabilidad del proceso es fundamental. A continuación, se presenta el flujo que sigue cada consulta en el **Intelligence Hub** para garantizar veredictos de alta fidelidad.

## 1. Ciclo de Auditoría (Asset Workflow)

```mermaid
graph TD
    A["Asset Query (Ingreso de Datos de Activo)"] --> B{"Triage Técnico (Routing)"}
    B -->|SITR| C["Especialista Telecomunicaciones"]
    B -->|BESS| D["Especialista Almacenamiento"]
    B -->|CIP| E["Especialista Ciberseguridad"]
    B -->|OTRO| F["Pool de 9 Agentes"]
    
    C & D & E & F --> G["Consulta RAG (CEN/SEC Database 2025)"]
    G --> H["Borrador de Veredicto de Especialista"]
    H --> I{"Auditoría de Calidad (Senior Lead Auditor)"}
    
    I -->|RECHAZADO: Falta Cita Normativa| H
    I -->|APROBADO: Cumple Estándar| J["Generación de Dossier Técnico"]
    
    J --> K["Matriz de Riesgo: MET / FAIL"]
    K --> L["Plan de Acción Priorizado (Exportable PDF)"]
```
