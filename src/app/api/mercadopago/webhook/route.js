import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Webhook recibido:', JSON.stringify(body, null, 2));

    // Validar que sea una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      console.log(`Procesando pago ID: ${paymentId}`);

      // Obtener información completa del pago usando la nueva API
      const paymentApi = new Payment(client);
      const payment = await paymentApi.get({ id: paymentId });
      
      console.log('Información del pago:', JSON.stringify(payment, null, 2));

      const paymentInfo = payment;
      
      // Procesar según el estado del pago
      switch (paymentInfo.status) {
        case 'approved':
          console.log('✅ Pago aprobado:', paymentId);
          await handleApprovedPayment(paymentInfo);
          break;
          
        case 'rejected':
          console.log('❌ Pago rechazado:', paymentId);
          await handleRejectedPayment(paymentInfo);
          break;
          
        case 'pending':
          console.log('⏳ Pago pendiente:', paymentId);
          await handlePendingPayment(paymentInfo);
          break;
          
        case 'in_process':
          console.log('🔄 Pago en proceso:', paymentId);
          await handleProcessingPayment(paymentInfo);
          break;
          
        case 'cancelled':
          console.log('🚫 Pago cancelado:', paymentId);
          await handleCancelledPayment(paymentInfo);
          break;
          
        default:
          console.log(`⚠️ Estado de pago desconocido: ${paymentInfo.status}`);
      }
    }

    // Responder con 200 para confirmar que recibimos la notificación
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error procesando webhook:', error);
    
    // Aún así responder con 200 para evitar reintentos innecesarios
    return NextResponse.json(
      { error: 'Error interno', received: false }, 
      { status: 200 }
    );
  }
}

// Función para manejar pagos aprobados
async function handleApprovedPayment(payment) {
  try {
    console.log('Procesando pago aprobado...');
    
    // Aquí puedes implementar la lógica para:
    // - Guardar el pago en tu base de datos
    // - Asignar los tickets al usuario
    // - Enviar email de confirmación
    // - Actualizar el inventario de tickets
    
    const ticketData = {
      paymentId: payment.id,
      externalReference: payment.external_reference,
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      payerEmail: payment.payer.email,
      status: 'approved',
      paymentDate: payment.date_approved,
      items: payment.additional_info?.items || [],
    };
    
    console.log('Datos del ticket a procesar:', ticketData);
    
    // TODO: Implementar guardado en base de datos
    // await saveTicketToDatabase(ticketData);
    
    // TODO: Enviar email de confirmación
    // await sendConfirmationEmail(ticketData);
    
    console.log('✅ Pago aprobado procesado exitosamente');
    
  } catch (error) {
    console.error('Error procesando pago aprobado:', error);
  }
}

// Función para manejar pagos rechazados
async function handleRejectedPayment(payment) {
  try {
    console.log('Procesando pago rechazado...');
    
    // Aquí puedes implementar la lógica para:
    // - Registrar el intento fallido
    // - Enviar notificación al usuario
    // - Liberar tickets reservados (si aplica)
    
    console.log(`❌ Pago rechazado - Razón: ${payment.status_detail}`);
    
  } catch (error) {
    console.error('Error procesando pago rechazado:', error);
  }
}

// Función para manejar pagos pendientes
async function handlePendingPayment(payment) {
  try {
    console.log('Procesando pago pendiente...');
    
    // Aquí puedes implementar la lógica para:
    // - Reservar los tickets temporalmente
    // - Enviar notificación de pago pendiente
    // - Programar verificación posterior
    
    console.log(`⏳ Pago pendiente - Detalle: ${payment.status_detail}`);
    
  } catch (error) {
    console.error('Error procesando pago pendiente:', error);
  }
}

// Función para manejar pagos en proceso
async function handleProcessingPayment(payment) {
  try {
    console.log('Procesando pago en proceso...');
    
    console.log(`🔄 Pago en proceso - Detalle: ${payment.status_detail}`);
    
  } catch (error) {
    console.error('Error procesando pago en proceso:', error);
  }
}

// Función para manejar pagos cancelados
async function handleCancelledPayment(payment) {
  try {
    console.log('Procesando pago cancelado...');
    
    // Aquí puedes implementar la lógica para:
    // - Liberar tickets reservados
    // - Limpiar datos temporales
    // - Registrar la cancelación
    
    console.log(`🚫 Pago cancelado - Detalle: ${payment.status_detail}`);
    
  } catch (error) {
    console.error('Error procesando pago cancelado:', error);
  }
}

// También manejar solicitudes GET para verificación de MercadoPago
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const id = searchParams.get('id');
  
  console.log(`GET webhook - Topic: ${topic}, ID: ${id}`);
  
  return NextResponse.json({ 
    message: 'Webhook endpoint activo',
    topic,
    id 
  });
} 