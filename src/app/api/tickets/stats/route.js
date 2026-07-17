import { NextResponse } from 'next/server';
import { getAllTickets } from '../../../../utilis/ticketLogger';

export const dynamic = 'force-dynamic';

/**
 * Manejador GET para obtener las estadísticas consolidadas del sorteo
 * @param {Request} request - Objeto de solicitud HTTP de Next.js
 * @returns {Promise<NextResponse>} Respuesta con estadísticas en formato JSON
 */
export async function GET(request) {
  try {
    const allTickets = await getAllTickets();
    
    // Filtrar los tickets activos (no anulados)
    const activeTickets = allTickets.filter(ticket => ticket.status !== 'cancelled');
    
    // Suma la cantidad total de boletos comprados en base a logs de tickets activos
    const soldFromLogs = activeTickets.reduce((sum, ticket) => {
      if (Array.isArray(ticket.items)) {
        return sum + ticket.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
      }
      // Fallback si no tiene formato esperado
      return sum + 1;
    }, 0);
    
    // Offset de ventas presenciales/offline (ajustable por variable de entorno)
    const offlineOffset = parseInt(process.env.OFFLINE_TICKETS_OFFSET || '0', 10);
    const totalSold = soldFromLogs + offlineOffset;
    
    // Variables de configuración de sorteo con fallbacks amigables
    const raffleNumber = parseInt(process.env.NEXT_PUBLIC_RAFFLE_NUMBER || '1', 10);
    const ticketGoal = parseInt(process.env.NEXT_PUBLIC_TICKET_GOAL || '1000', 10);
    const raffleDate = process.env.NEXT_PUBLIC_RAFFLE_DATE || 'Por confirmar';

    return NextResponse.json({
      success: true,
      raffleNumber,
      totalSold,
      soldFromLogs,
      offlineOffset,
      ticketGoal,
      raffleDate
    });
  } catch (error) {
    console.error('Error al generar estadísticas del sorteo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno al generar estadísticas' 
      },
      { status: 500 }
    );
  }
}
