# White Paper: Monitoreo con PMUs (PMUS 2025)

[METRICS_JSON]
{ "PMUs Activas": "15", "Error Fase": "0.1º", "Timestamping": "1 μs", "Integridad": "99.9%" }

[HALLAZGO_HIGHLIGHT]
La falta de sincronización GPS en PMUs de transmisión invalida los modelos de estabilidad dinámica ante contingencias críticas.

## 📋 Resumen Ejecutivo
El sistema de Monitoreo de Unidades de Medición Fasorial (PMUS) es obligatorio para instalaciones de generación y almacenamiento >= 9 MW. Este documento resume las especificaciones técnicas y los hitos de cumplimiento anual.

## 📅 Hito Crítico: 31 de Julio
Cada año, a más tardar el **31 de Julio**, todos los coordinados obligados deben presentar su **Actualización del Estudio PMUS** y el plan de adecuación de puntos de monitoreo.

## 📡 Especificaciones Técnicas del PMU

### 1. Hardware y Comunicación
- **Clase de Desempeño**: M-Class (Medición).
- **Tasa de Transmisión**: 50 muestras por segundo.
- **Protocolo**: IEEE C37.118 (v2).
- **Sincronización**: IRIG-B (Error < 1 us).

### 2. Infraestructura de Red
- **Ancho de Banda**: Mínimo 120 kbps por PMU.
- **Redundancia**: Se exige un **segundo enlace de comunicaciones** dedicado para el tráfico MMF.
- **Alimentación**: Respaldo mínimo de 8 horas con baterías o UPS dedicada.

## 📁 Entregables PES (Puesta en Servicio)
Para la aprobación de una PMU, el coordinado debe entregar:
- Layout de armarios y diagramas de conexionado.
- Pruebas de conmutación de transformadores de potencial (TP).
- Validación de latencia de red extremo a extremo.

---
*REF: Estudio MMF 2025 / NTSyCS ATSM*
