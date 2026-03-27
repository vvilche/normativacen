# Requisitos Técnicos: Centros de Control para Centrales Hidráulicas (PMGD/PMG)

Según la **NTSyCS (Norma Técnica de Seguridad y Calidad de Servicio)** y el **DS N°88 (Reglamento de PMGD)**, los Centros de Control (CCTL) que gestionan activos de generación hidráulica deben cumplir con estándares críticos de observabilidad y redundancia.

## 1. Sistema de Información en Tiempo Real (SITR)
Los Coordinados con centrales hidráulicas deben transmitir al SITR del Coordinador Eléctrico Nacional (CEN) las siguientes variables mínimas con estampa de tiempo (resolución ms):

### Variables Dinámicas Obligatorias
- **Potencia Activa (MW)** e Instantánea.
- **Potencia Reactiva (MVAr)** y Factor de Potencia (FP).
- **Tensión de Barra (kV)** en el punto de interconexión.
- **Estado de Interruptores** y Seccionadores.

### Variables Hidráulicas Críticas
- **Nivel de Estanque o Embalse**: Medido en metros (m) o porcentaje (%).
- **Caudal Turbinado ($m^3/s$)**: Volumen de agua procesado por las turbinas.
- **Caudal Vertido ($m^3/s$)**: Volumen de agua evacuado por vertederos.
- **Posición de Compuertas**: Estado de apertura/cierre de órganos de control hídrico.

## 2. Redundancia de Comunicaciones
El Anexo Técnico del SITR exige que el CCTL disponga de:
- **Canales Redundantes**: Dos enlaces físicos independientes hacia los Data Centers del Coordinador (CCP - Centro de Cómputos Principal y CCC - Centro de Cómputos de Contingencia).
- **Protocolos Admitidos**: ICCP v2 (IEC 60870-6/TASE.2) para CCTL a CCTL, o DNP3 over TCP/IP para conexión directa de IEDs.
- **Disponibilidad**: >= 99.8% anual.

## 3. Normativa de Inyección (DS 88)
- **Control de Tensión**: Capacidad de inyectar/absorber reactivos con FP 0.95.
- **Desconexión por Red**: Esquemas de protección que aseguren la desconexión ante fallas en la red de distribución.

## 4. Diseño y Seguridad (RGR 04/2020)
- Las instalaciones deben cumplir con la instrucción técnica de la SEC para asegurar la integridad de la infraestructura hidráulica y eléctrica.
