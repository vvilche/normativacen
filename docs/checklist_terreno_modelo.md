# Checklist de Evidencia Terreno: Cierre de Hallazgos Normativos

Para que un hallazgo detectado por **Agente Normativo** sea considerado "Cerrado" ante una auditoría del Coordinador o la SEC, el equipo de terreno debe recolectar la siguiente evidencia mínima.

## 📡 Escenarios SITR (Telecomunicaciones)
- [ ] **Captura de Pantalla SCADA**: Registro de la estampa de tiempo (Timestamp) antes y después de la corrección.
- [ ] **Certificado de Calibración GPS**: Copia del certificado vigente del receptor de tiempo.
- [ ] **Prueba de Latencia (Ping/Traceroute)**: Log técnico que demuestre latencias estables < 500ms hacia el nodo del CEN.
- [ ] **Fotos de Antena**: Verificación visual de línea de vista y ausencia de obstrucciones.

## 🔋 Escenarios BESS (Almacenamiento)
- [ ] **Registro de Eventos (Event Log)**: Archivo .csv o .xls del BMS/PCS durante el evento de falla.
- [ ] **Curva de Respuesta de Frecuencia**: Gráfico que demuestre la inyección de potencia en los tiempos normados (< 200ms para FFR).
- [ ] **Ajustes de Inversores**: Captura de los parámetros de configuración (Banda Muerta, Statismo) aplicados.

## 🛡️ Escenarios Ciberseguridad (NERC CIP)
- [ ] **Inventario de Activos Cibernéticos**: Lista actualizada de dispositivos dentro del ESP.
- [ ] **Registro de Accesos**: Log detallado de quién y cuándo accedió al sistema durante el periodo de auditoría.
- [ ] **Evidencia de MFA**: Captura que verifique el uso de segundo factor de autenticación para accesos remotos.

## ⚡ Escenarios Generación y SSCC
- [ ] **Reporte de Ensayos ASF/CPF**: Documento firmado por el ingeniero de protecciones.
- [ ] **Caudalametría**: Log de sensores de nivel y caudal vertido (en caso de centrales hidráulicas).

---

> [!TIP]
> **Subida de Evidencia**:
> Una vez recolectada, adjunte estos archivos al **Portal de Hallazgos** para que el Agente pueda realizar la **Verificación de Cierre** y actualizar el Dashboard a 🟢 Cumplimiento.
