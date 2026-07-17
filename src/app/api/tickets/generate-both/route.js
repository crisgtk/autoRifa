import { NextResponse } from 'next/server';
import { logTicketGeneration } from '../../../../utilis/ticketLogger';
import { generateTicketPDF, sendTicketEmail } from '../../../../utilis/ticketService';

/**
 * Genera el ticket (PDF + Email) y retorna el archivo para descarga directa.
 * @param {Request} request - Solicitud HTTP de Next.js.
 * @returns {Promise<NextResponse>} Respuesta con el archivo PDF o JSON en caso de error.
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

    console.log('🎟️✉️ Generando ticket para EMAIL + DESCARGA (unificado):', body);

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

    // PASO 1: Enviar email con el PDF adjunto (en background)
    try {
      await sendTicketEmail({
        email,
        name,
        ticketNumber,
        pdfBuffer
      });
      console.log('✅ Email enviado exitosamente a:', email);
    } catch (emailError) {
      console.error('⚠️ Error enviando email (continuando con descarga):', emailError);
    }

    // PASO 2: Registrar ticket en logs
    await logTicketGeneration(body);

    // PASO 3: Retornar PDF para descarga automática
    console.log('📥 Retornando PDF para descarga automática');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticketNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Email-Sent': 'true',
        'X-Ticket-Number': ticketNumber,
        'X-Success-Message': 'Ticket generado: PDF descargado y email enviado'
      }
    });

  } catch (error) {
    console.error('Error generando ticket (email + descarga):', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar ticket',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}