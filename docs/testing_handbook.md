# Manual de Auditoría Normativa: Golden Testing Samples

Este manual contiene los 15 escenarios técnicos críticos para validar la matriz de cumplimiento de **Agente Normativo**. Estos "Golden Samples" permiten verificar que los veredictos emitidos sigan los estándares de ingeniería del CEN y la SEC.

## Escenarios SITR (Telecomunicaciones y SCADA)

1.  **Falla de Sincronismo GPS**:
    *   **Prompt**: "Auditar la integridad de datos de una subestación de transmisión donde el receptor GPS muestra un drift de 500ms respecto al reloj de referencia del CEN."
    *   **Resultado Esperado**: El sistema debe identificar un incumplimiento crítico según la NTSyCS (Anexo Técnico de Intercambio de Información) y recomendar la revisión inmediata de la antena/receptor para evitar pérdida de validez fasorial.

2.  **Latencia Excedida en PMGD**:
    *   **Prompt**: "Analizar el canal SITR de un PMGD tipo photovoltaic de 9MW con latencias de reporte ICCP de 5.2s."
    *   **Resultado Esperado**: Identificar riesgo de desconexión del activo por superar el umbral de observabilidad (normalmente <4s para coordinados tipo A).

3.  **Redundancia de Enlaces CCC/CCP**:
    *   **Prompt**: "Verificar el cumplimiento de redundancia física en un Centro de Despacho que utiliza un único proveedor de fibra óptica para los canales CCC y CCP."
    *   **Resultado Esperado**: Reportar falta de topología redundante e independiente según requisitos del Coordinador.

## Escenarios BESS (Almacenamiento y Respuesta Dinámica)

4.  **Respuesta de Frecuencia Rápida (FFR)**:
    *   **Prompt**: "Evaluar si un sistema BESS de 50MW/100MWh cumple con la NTSyCS al tener un tiempo de respuesta FFR de 350ms ante una caída de frecuencia sub-transitoria."
    *   **Resultado Esperado**: Señalar que el tiempo está fuera del rango ideal (<200ms) para aplicaciones de inercia sintética avanzada bajo los nuevos códigos de red.

5.  **Control de Potencia Reactiva**:
    *   **Prompt**: "Un parque solar con almacenamiento BESS reporta un factor de potencia de 0.92 inductivo en el Punto de Conexión (POI). ¿Hay riesgo normativo?"
    *   **Resultado Esperado**: Identificar infracción al DS88 (Art. 29) que exige mantener el FP entre 0.95 inductivo y 0.95 capacitivo.

## Escenarios Ciberseguridad OT (NERC CIP)

6.  **Gestión de Acceso Perimetral (ESP)**:
    *   **Prompt**: "Auditar la seguridad de una red SCADA donde se detectaron accesos remotos vía TeamViewer sin el uso de un Electronic Security Perimeter (ESP) certificado."
    *   **Resultado Esperado**: Incumplimiento crítico de NERC CIP-005 y recomendación inmediata de implementación de Jump Hosts y VPNs IPsec.

7.  **Sistemas de Recuperación (DRP)**:
    *   **Prompt**: "Verificar el cumplimiento de CIP-009 para un Coordinado que no ha realizado pruebas de restauración de copias de seguridad en los últimos 24 meses."
    *   **Resultado Esperado**: Alerta de auditoría por falta de periodicidad anual en simulacros de recuperación ante desastres.

## Escenarios Generación y PMGD

8.  **Monitoreo SITR Hidráulico**:
    *   **Prompt**: "Evaluar informe de operación de central de pasada donde los sensores de estanque reportan variaciones de ±10% sin telemetría de caudal vertido."
    *   **Resultado Esperado**: Señalar incumplimiento en la entrega de variables de operación obligatorias para el CEN.

9.  **Despacho de Potencia en PMGD**:
    *   **Prompt**: "Un PMGD inyectó energía por sobre su capacidad autorizada en la carta de conexión durante una ventana de congestión en la red de distribución."
    *   **Resultado Esperado**: Emitir alerta económica por riesgo de multas SEC y desviación de despacho programado.

## Escenarios Económicos (Multas y Remuneración)

10. **Proyección de Multas SEC**:
    *   **Prompt**: "Calcular el riesgo proyectado de multa para una empresa de Transmisión que no notificó el retiro anticipado de un trasformador de poder de contingencia."
    *   **Resultado Esperado**: Basado en registros previos, proyectar una sancionable en el rango de 1000 a 5000 UTA según severidad del impacto al sistema.

---
