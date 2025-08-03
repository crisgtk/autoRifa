import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '🧪 Test del flujo completo de tickets',
    instructions: [
      '1. Ve a la página de tickets en tu frontend',
      '2. Llena el formulario con tarjeta de prueba',
      '3. Procesa el pago',
      '4. Ve si se genera y envía el ticket automáticamente'
    ],
    test_cards: {
      visa: '4170 0688 1010 8020',
      mastercard: '5031 7557 3453 0604',
      amex: '3711 803032 57522',
      cvv: '123 (Amex: 1234)',
      expiry: 'Cualquier fecha futura',
      name: 'APRO (para aprobada)'
    },
    endpoints: {
      payment: '/api/mercadopago/create-payment',
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
      paymentId: `test_payment_${Date.now()}`,
      amount: 25000,
      ticketNumber: `TICKET-${Date.now()}`,
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
    const ticketResponse = await fetch('http://localhost:3001/api/tickets/generate', {
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
      mercadopago_access_token: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      mercadopago_public_key: !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
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
        '🎯 Probar desde el frontend con tarjeta real'
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