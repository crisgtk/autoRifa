import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../utilis/adminAuth';
import { getAllTickets } from '../../../../utilis/ticketLogger';

export const dynamic = 'force-dynamic';

/**
 * Endpoint protegido para obtener la lista de todos los tickets registrados.
 * @param {Request} request - Solicitud HTTP de Next.js
 * @returns {Promise<NextResponse>} Respuesta con la lista de tickets ordenados de forma descendente.
 */
export async function GET(request) {
  try {
    // Verificar autenticación
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('admin_session');
    
    if (!tokenCookie || !verifyToken(tokenCookie.value)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Obtener todos los tickets
    const tickets = await getAllTickets();
    
    // Ordenar por fecha/timestamp descendente
    tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error en API de tickets de admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
