import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
// Importaremos modelos si existen, o generaremos datos dinámicos basados en el historial

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Simulación de agregación de datos (en producción esto vendría de una agregación de MongoDB)
    const dashboardData = {
      globalScore: 88.5,
      totalAssets: 9,
      criticalRisks: 3,
      totalExposureUTA: 12500,
      
      segments: [
        { name: 'Generación', score: 92, status: 'success' },
        { name: 'Transmisión', score: 76, status: 'critical' },
        { name: 'BESS', score: 85, status: 'warning' },
        { name: 'Consumo', score: 98, status: 'success' }
      ],
      
      topRisks: [
        { id: 'CEN-TRANS-001', asset: 'SE Seccionadora 220kV', type: 'NERC CIP-014', risk: 'HIGH', imp: '10k UTA' },
        { id: 'CEN-BESS-4821', asset: 'BESS El Salto', type: 'Latencia SITR', risk: 'HIGH', imp: '800 UTA' },
        { id: 'CEN-GEN-099', asset: 'Parque Fotovoltaico X', type: 'Punto PMU', risk: 'MEDIUM', imp: '500 UTA' }
      ],

      remediationProgress: [
        { month: 'Ene', completed: 12, pending: 45 },
        { month: 'Feb', completed: 25, pending: 32 },
        { month: 'Mar', completed: 38, pending: 15 }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
