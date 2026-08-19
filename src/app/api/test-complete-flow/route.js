import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '🧪 Test del flujo completo de tickets',
    instructions: [
      '1. Ve a la página de tickets en tu frontend',
      '2. Llena el formulario con tus datos',
      '3. Procesa el pago y simula la aprobación en Khipu',
      '4. Ve si se genera y envía el ticket automáticamente'
    ],
    test_instructions: {
      bank: 'Puedes usar cualquier banco ficticio en la pasarela de pruebas de Khipu',
      amount: 'El precio se calcula automáticamente según la cantidad de tickets'
    },
    endpoints: {
      payment: '/api/khipu/create-payment',
      tickets: '/api/tickets/generate'
    }
  });
}

export async function POST() {
  try {
    console.log('🧪 Iniciando test del sistema de tickets...');
    
    // Datos de prueba para ticket
    const testTicketData = {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      identification: '12345678-9',
      paymentId: `test_payment_khipu_${Date.now()}`,
      amount: 25000,
      ticketNumber: `TICKET-KHIPU-${Date.now()}`,
      purchaseDate: new Date().toLocaleString('es-CL'),
      items: [
        {
          title: 'Ticket de Sorteo - Test',
          quantity: 1,
          unit_price: 25000
        }
      ]
    };

    console.log('📋 Datos de prueba:', testTicketData);

    // Probar generación de ticket
    const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tickets/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTicketData),
    });

    const ticketResult = await ticketResponse.json();

    console.log('🎟️ Resultado de generación de ticket:', ticketResult);

    // Verificar variables de entorno
    const envCheck = {
      khipu_receiver_id: !!process.env.KHIPU_RECEIVER_ID,
      khipu_secret: !!process.env.KHIPU_SECRET,
      email_user: !!process.env.EMAIL_USER,
      email_password: !!process.env.EMAIL_PASSWORD,
    };

    return NextResponse.json({
      test_status: 'completed',
      ticket_generation: {
        success: ticketResponse.ok,
        status: ticketResponse.status,
        result: ticketResult
      },
      environment_variables: envCheck,
      test_data: testTicketData,
      next_steps: ticketResponse.ok ? [
        '✅ PDF se genera correctamente',
        envCheck.email_user ? '✅ Email configurado' : '⚠️ Configurar email para envío automático',
        '🎯 Probar desde el frontend seleccionando Khipu'
      ] : [
        '❌ Error en generación de PDF',
        '🔧 Revisar logs del servidor',
        '📧 Verificar configuración'
      ]
    });

  } catch (error) {
    console.error('❌ Error en test completo:', error);
    
    return NextResponse.json({
      test_status: 'failed',
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}