import { NextResponse } from 'next/server';
import { getKhipuPaymentDetails } from '@/utilis/khipuService';
import { logTicketGeneration, getAllTickets } from '@/utilis/ticketLogger';
import { generateTicketPDF, sendTicketEmail } from '@/utilis/ticketService';
import { generateAutoRifaTicketNumber } from '@/utilis/ticketGenerator';

/**
 * Webhook de Khipu para procesar notificaciones de pago conciliadas.
 * Soporta solicitudes POST con Content-Type: application/x-www-form-urlencoded.
 * @param {Request} request - Solicitud de Next.js.
 * @returns {Promise<NextResponse>} Respuesta HTTP.
 */
export async function POST(request) {
  try {
    let notificationToken = null;
    let apiVersion = null;

    // Intentar obtener los datos del cuerpo form-urlencoded primero
    try {
      const formData = await request.formData();
      notificationToken = formData.get('notification_token');
      apiVersion = formData.get('api_version');
    } catch (formError) {
      console.log('No se pudo parsear como formData, probando JSON...');
      try {
        const jsonBody = await request.json();
        notificationToken = jsonBody.notification_token;
        apiVersion = jsonBody.api_version;
      } catch (jsonError) {
        console.log('No se pudo parsear como JSON, probando URL params...');
        const { searchParams } = new URL(request.url);
        notificationToken = searchParams.get('notification_token');
        apiVersion = searchParams.get('api_version');
      }
    }

    console.log(`Webhook Khipu recibido. Token: ${notificationToken}, API Version: ${apiVersion}`);

    if (!notificationToken) {
      return NextResponse.json(
        { error: 'notification_token es requerido' },
        { status: 400 }
      );
    }

    // 1. Obtener detalles oficiales del pago desde Khipu
    const payment = await getKhipuPaymentDetails(notificationToken);
    console.log('Detalles del pago obtenidos de Khipu:', JSON.stringify(payment, null, 2));

    const paymentId = payment.payment_id;
    const paymentStatus = payment.status;

    // 2. Procesar únicamente si el estado del pago es 'done' (completado/aprobado)
    if (paymentStatus === 'done') {
      console.log(`✅ Pago Khipu Aprobado: ${paymentId}. Iniciando generación de ticket...`);

      // Evitar duplicación de tickets (Idempotencia)
      const allTickets = await getAllTickets();
      const alreadyProcessed = allTickets.some(t => String(t.paymentId) === String(paymentId));
      
      if (alreadyProcessed) {
        console.log(`⚠️ El pago Khipu ${paymentId} ya fue procesado previamente.`);
        return NextResponse.json({ received: true, message: 'Pago ya procesado' }, { status: 200 });
      }

      // Obtener datos del comprador desde el parámetro 'custom'
      let customerData = {
        name: payment.payer_name || 'Usuario Khipu',
        email: payment.payer_email || 'usuario@ejemplo.com',
        identification: 'Sin RUT',
        items: []
      };

      if (payment.custom) {
        try {
          const customObj = JSON.parse(payment.custom);
          customerData = {
            name: customObj.name || customerData.name,
            email: customObj.email || customerData.email,
            identification: customObj.identification || customerData.identification,
            items: customObj.items || customerData.items
          };
        } catch (parseError) {
          console.error('Error al decodificar metadatos "custom" del pago Khipu:', parseError);
        }
      }

      const ticketNumber = generateAutoRifaTicketNumber();
      const purchaseDate = new Date().toLocaleString('es-CL');

      const ticketData = {
        name: customerData.name,
        email: customerData.email,
        identification: customerData.identification,
        paymentId: paymentId,
        amount: payment.amount,
        ticketNumber: ticketNumber,
        purchaseDate: purchaseDate,
        items: customerData.items,
        source: 'khipu' // Registrar origen como khipu
      };

      // 3. Generar PDF
      const pdfBuffer = await generateTicketPDF(ticketData);

      // 4. Enviar email al cliente
      try {
        await sendTicketEmail({
          email: ticketData.email,
          name: ticketData.name,
          ticketNumber: ticketData.ticketNumber,
          pdfBuffer
        });
        console.log(`📧 Ticket enviado por correo a: ${ticketData.email}`);
      } catch (emailError) {
        console.error('⚠️ Error enviando email de confirmación:', emailError);
      }

      // 5. Guardar en los logs locales
      await logTicketGeneration(ticketData);
      console.log(`✅ Ticket ${ticketNumber} generado y registrado con éxito.`);
    } else {
      console.log(`⚠️ Notificación recibida para pago Khipu ${paymentId} con estado: ${paymentStatus}. No se genera ticket.`);
    }

    // Retornar 200 OK para confirmar recepción a Khipu
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error procesando webhook de Khipu:', error);
    // Retornar 200 OK a Khipu de todas formas para detener reintentos ante errores de código
    return NextResponse.json({ received: false, error: error.message }, { status: 200 });
  }
}

/**
 * Endpoint GET para verificar que el Webhook está activo.
 */
export async function GET(request) {
  return NextResponse.json({ 
    message: 'Webhook de Khipu activo y esperando notificaciones' 
  });
}
