import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../../utilis/adminAuth';
import { generateAutoRifaTicketNumber } from '../../../../../utilis/ticketGenerator';
import { logTicketGeneration } from '../../../../../utilis/ticketLogger';
import { generateTicketPDF, sendTicketEmail } from '../../../../../utilis/ticketService';

export const dynamic = 'force-dynamic';

/**
 * Endpoint protegido para emitir/imprimir un ticket manual (venta física/offline).
 * Registra el ticket, envía el email si se especifica, y devuelve el PDF para su descarga/impresión.
 * @param {Request} request - Solicitud HTTP de Next.js. Body esperado: { name, email, identification, amount, quantity }
 * @returns {Promise<NextResponse>} Respuesta con el archivo PDF o JSON en caso de error.
 */
export async function POST(request) {
  try {
    // Verificar autenticación
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('admin_session');
    
    if (!tokenCookie || !verifyToken(tokenCookie.value)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, email, identification, amount, quantity } = body;
    
    if (!name || !amount || !quantity) {
      return NextResponse.json({ error: 'Nombre, monto y cantidad son requeridos' }, { status: 400 });
    }
    
    // Generar número de ticket
    const ticketNumber = generateAutoRifaTicketNumber();
    const purchaseDate = new Date().toLocaleString('es-CL');
    const paymentId = `MANUAL-${Date.now()}`;
    
    // Formatear items de compra
    const items = [
      {
        title: 'STICKET_MANUAL',
        quantity: parseInt(quantity, 10),
        unit_price: Math.round(amount / quantity)
      }
    ];
    
    const ticketData = {
      timestamp: new Date().toISOString(),
      ticketNumber,
      email: email || 'sin-correo@ejemplo.com',
      name,
      identification: identification || 'Sin RUT',
      paymentId,
      amount: parseFloat(amount),
      items,
      status: 'generated',
      source: 'manual'
    };
    
    // Generar PDF
    const pdfBuffer = await generateTicketPDF({
      name: ticketData.name,
      email: ticketData.email,
      identification: ticketData.identification,
      paymentId: ticketData.paymentId,
      amount: ticketData.amount,
      ticketNumber: ticketData.ticketNumber,
      purchaseDate,
    });
    
    // Enviar email si viene un correo válido
    if (email && email.trim() !== '' && !email.includes('sin-correo@ejemplo.com')) {
      try {
        await sendTicketEmail({
          email,
          name,
          ticketNumber,
          pdfBuffer
        });
      } catch (emailError) {
        console.error('⚠️ Error al enviar email en emisión manual (continuando):', emailError);
      }
    }
    
    // Registrar en los logs JSON
    await logTicketGeneration(ticketData);
    
    // Devolver PDF para descarga directa e impresión
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticketNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Ticket-Number': ticketNumber,
        'X-Success-Message': 'Ticket manual emitido y registrado exitosamente'
      }
    });
    
  } catch (error) {
    console.error('Error emitiendo ticket manual:', error);
    return NextResponse.json({ error: 'Error interno del servidor al emitir ticket' }, { status: 500 });
  }
}
