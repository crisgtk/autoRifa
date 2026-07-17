import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../../utilis/adminAuth';
import { getAllTickets } from '../../../../../utilis/ticketLogger';
import { generateTicketPDF, sendTicketEmail } from '../../../../../utilis/ticketService';

export const dynamic = 'force-dynamic';

/**
 * Endpoint protegido para reenviar el email de un ticket ya generado a su destinatario.
 * @param {Request} request - Solicitud HTTP de Next.js. Body esperado: { ticketNumber }
 * @returns {Promise<NextResponse>} Respuesta JSON indicando si se reenvió exitosamente.
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
    
    // Buscar el ticket en todos los logs
    const allTickets = await getAllTickets();
    const ticket = allTickets.find(t => t.ticketNumber === ticketNumber);
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }
    
    if (!ticket.customerEmail || ticket.customerEmail.includes('sin-correo@ejemplo.com')) {
      return NextResponse.json({ error: 'El ticket no tiene un correo válido registrado' }, { status: 400 });
    }
    
    // Formatear la fecha de compra si no está presente
    const purchaseDate = ticket.timestamp 
      ? new Date(ticket.timestamp).toLocaleString('es-CL') 
      : 'N/A';
      
    // Generar PDF
    const pdfBuffer = await generateTicketPDF({
      name: ticket.customerName,
      email: ticket.customerEmail,
      identification: ticket.customerRUT,
      paymentId: ticket.paymentId,
      amount: ticket.amount,
      ticketNumber: ticket.ticketNumber,
      purchaseDate
    });
    
    // Reenviar email
    await sendTicketEmail({
      email: ticket.customerEmail,
      name: ticket.customerName,
      ticketNumber: ticket.ticketNumber,
      pdfBuffer
    });
    
    return NextResponse.json({ success: true, message: `Email reenviado exitosamente a ${ticket.customerEmail}` });
  } catch (error) {
    console.error('Error reenviando email desde API admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor al reenviar el ticket' }, { status: 500 });
  }
}
