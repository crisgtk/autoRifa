import { NextResponse } from 'next/server';
import { getEnvironmentInfo } from '@/utilis/environment';

export async function GET() {
  try {
    const environmentInfo = getEnvironmentInfo();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: environmentInfo,
      message: 'Configuración de entorno detectada automáticamente'
    }, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo información del entorno:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo información del entorno',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}