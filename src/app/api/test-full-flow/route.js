import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🧪 INICIANDO PRUEBA COMPLETA DEL SISTEMA...');
    
    // Simular datos de un pago exitoso real
    const testPaymentData = {
      name: 'Usuario de Prueba Final',
      email: 'autorifadeautoimporta@gmail.com',
      identification: '12345678-9',
      paymentId: `FINAL_TEST_${Date.now()}`,
      amount: 25000,
      ticketNumber: `TICKET-FINAL-${Date.now()}`,
      purchaseDate: new Date().toLocaleString('es-CL'),
      items: [
        {
          title: 'Ticket Premium - Prueba Final',
          quantity: 1,
          unit_price: 25000
        }
      ]
    };

    console.log('📋 Datos de prueba final:', testPaymentData);

    // Llamar al endpoint de generación de tickets (con email)
    const ticketResponse = await fetch('http://localhost:3000/api/tickets/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });

    const ticketResult = await ticketResponse.json();

    console.log('🎟️ Resultado de generación + email:', ticketResult);

    return NextResponse.json({
      test_status: 'PRUEBA FINAL COMPLETADA',
      simulation_data: testPaymentData,
      ticket_generation: {
        success: ticketResult.success,
        result: ticketResult
      },
      next_steps: ticketResult.success ? [
        '✅ PDF generado correctamente',
        '✅ Email enviado automáticamente', 
        '📧 Revisa autorifadeautoimporta@gmail.com',
        '🎯 ¡SISTEMA FUNCIONANDO AL 100%!',
        '',
        '🚀 AHORA HAZ UN PAGO REAL:',
        '1. Ve a http://localhost:3000',
        '2. Tarjeta: 4170 0688 1010 8020',
        '3. CVV: 123, Nombre: APRO',
        '4. Email: autorifadeautoimporta@gmail.com',
        '5. ¡Verifica que llegue el PDF por email!'
      ] : [
        '❌ Error en el sistema',
        '🔧 Revisar logs para diagnosticar'
      ],
      system_status: ticketResult.success ? '🎉 FUNCIONANDO PERFECTAMENTE' : '❌ REQUIERE ATENCIÓN'
    });

  } catch (error) {
    console.error('❌ Error en prueba final:', error);
    
    return NextResponse.json({
      test_status: 'FAILED',
      error: error.message,
      system_status: '❌ ERROR EN PRUEBA FINAL'
    }, { status: 500 });
  }
}