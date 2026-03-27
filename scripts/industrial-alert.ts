import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * ==========================================
 * INDUSTRIAL ALERT DISPATCHER (MOCK)
 * ==========================================
 * Simula el envío de notificaciones de emergencia técnica a canales
 * de Slack, Teams o centros de despacho ante hallazgos críticos.
 */

interface AlertPayload {
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    asset: string;
    finding: string;
    actionRequired: string;
    timestamp: string;
}

async function sendIndustrialAlert(payload: AlertPayload) {
    console.log("\n🚨 [INDUSTRIAL_ALERT] DISPARANDO PROTOCOLO DE EMERGENCIA...");
    console.log("-------------------------------------------------------------");
    
    // Simulación de delay de red de control
    await new Promise(resolve => setTimeout(resolve, 800));

    const color = payload.severity === 'CRITICAL' ? '🔴' : '🟡';
    
    console.log(`${color} NIVEL: ${payload.severity}`);
    console.log(`🏗️  ACTIVO: ${payload.asset}`);
    console.log(`🔍 HALLAZGO: ${payload.finding}`);
    console.log(`🛠️  ACCIÓN: ${payload.actionRequired}`);
    console.log(`⏰ HORA: ${payload.timestamp}`);
    
    console.log("-------------------------------------------------------------");
    console.log("✅ Alerta enviada exitosamente a: [Slack-Ingenieria-CEN]");
    console.log("✅ Alerta enviada exitosamente a: [Teams-Mantenimiento-OT]");
}

// Escenario de prueba automático
const mockFindings = [
    {
        severity: 'CRITICAL' as const,
        asset: 'S/E Cordillera - Paño B1',
        finding: 'Falla de sincronismo GPS > 500ms detectada por Agente SITR.',
        actionRequired: 'Reinicio de Master Clock y validación de antena.',
        timestamp: new Date().toISOString()
    }
];

if (require.main === module) {
    sendIndustrialAlert(mockFindings[0]).catch(console.error);
}
