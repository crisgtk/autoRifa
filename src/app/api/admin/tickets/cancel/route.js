import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../../utilis/adminAuth';
import { cancelTicket } from '../../../../../utilis/ticketLogger';

export const dynamic = 'force-dynamic';

/**
 * Endpoint protegido para anular un ticket de sorteo.
 * @param {Request} request - Solicitud HTTP de Next.js. Body esperado: { ticketNumber }
 * @returns {Promise<NextResponse>} Respuesta JSON indicando si se anuló correctamente.
 */
export async function POST(request) {
  try {
    // Verificar autenticación
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('admin_session');
    
    if (!tokenCookie || !verifyToken(tokenCookie.value)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { ticketNumber } = await request.json();
    
    if (!ticketNumber) {
      return NextResponse.json({ error: 'Número de ticket es requerido' }, { status: 400 });
    }
    
    const success = await cancelTicket(ticketNumber);
    
    if (success) {
      return NextResponse.json({ success: true, message: `Ticket ${ticketNumber} anulado exitosamente` });
    }
    
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Error anulando ticket desde API admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor al anular ticket' }, { status: 500 });
  }
}
