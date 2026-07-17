import { NextResponse } from 'next/server';
import { logTicketGeneration } from '../../../../utilis/ticketLogger';
import { generateTicketPDF, sendTicketEmail } from '../../../../utilis/ticketService';

/**
 * Genera el ticket (PDF + Email) y retorna respuesta JSON de confirmación.
 * @param {Request} request - Solicitud HTTP de Next.js.
 * @returns {Promise<NextResponse>} Respuesta indicando éxito o fracaso.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      identification, 
      paymentId, 
      amount, 
      ticketNumber, 
      purchaseDate 
    } = body;

    console.log('Generando ticket para:', body);

    // Validaciones básicas
    if (!email || !ticketNumber) {
      return NextResponse.json(
        { error: 'Email y número de ticket son requeridos' },
        { status: 400 }
      );
    }

    // Generar PDF usando el servicio unificado
    const pdfBuffer = await generateTicketPDF({
      name,
      email,
      identification,
      paymentId,
      amount,
      ticketNumber,
      purchaseDate,
    });

    // Enviar email con el PDF adjunto
    await sendTicketEmail({
      email,
      name,
      ticketNumber,
      pdfBuffer
    });

    // Registrar ticket en logs estructurados
    await logTicketGeneration(body);

    console.log('Ticket generado y enviado exitosamente a:', email);

    return NextResponse.json({
      success: true,
      ticketNumber: ticketNumber,
      message: 'Ticket generado y enviado por email exitosamente'
    });

  } catch (error) {
    console.error('Error generando ticket:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar ticket',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}