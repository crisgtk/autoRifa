import { NextResponse } from 'next/server';
import { createKhipuPayment } from '@/utilis/khipuService';

/**
 * Endpoint para crear una orden de pago en Khipu.
 * @param {Request} request - Petición HTTP conteniendo datos del pagador y de los items.
 * @returns {Promise<NextResponse>} Respuesta JSON conteniendo la URL de pago para redirección.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, RUT, items } = body;

    console.log('Creando pago Khipu con datos:', JSON.stringify(body, null, 2));

    // Validaciones básicas
    if (!name || !email || !RUT) {
      return NextResponse.json(
        { error: 'El nombre, email y RUT son requeridos para procesar el pago' },
        { status: 400 }
      );
    }

    // Reglas estrictas de precios en el servidor (CLP)
    const prices = {
      1: 2000,
      2: 4000,
      3: 5000,
      4: 7000,
      5: 9000,
      6: 10000
    };

    // Validar cantidad total de boletos
    const totalQty = (items || []).reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    if (isNaN(totalQty) || totalQty < 1 || totalQty > 6) {
      return NextResponse.json(
        { error: 'Cantidad total de tickets inválida (mínimo 1, máximo 6 tickets).' },
        { status: 400 }
      );
    }

    const expectedTotal = prices[totalQty];

    // Forzar y recalcular unit_price de forma proporcional
    const validatedItems = (items || []).map((item) => {
      const itemQty = parseInt(item.quantity) || 1;
      const itemPrice = Math.round((expectedTotal * itemQty) / totalQty / itemQty);
      return {
        title: item.title || 'Ticket de Sorteo',
        quantity: itemQty,
        unit_price: itemPrice,
      };
    });

    // Llamar a Khipu para generar la URL de pago
    const response = await createKhipuPayment({
      amount: expectedTotal,
      subject: 'Compra de tickets para sorteo',
      name,
      email,
      RUT,
      items: validatedItems
    });

    console.log('Respuesta de Khipu al crear pago:', JSON.stringify(response, null, 2));

    // La respuesta de Khipu v2.0 contiene:
    // - payment_id (ID único del cobro en Khipu)
    // - payment_url (URL para redirigir al usuario)
    return NextResponse.json({
      paymentId: response.payment_id,
      paymentUrl: response.payment_url,
      amount: expectedTotal,
      total_quantity: totalQty
    });

  } catch (error) {
    console.error('Error creando pago en Khipu:', error);

    return NextResponse.json(
      { 
        error: error.message || 'Error interno del servidor al crear el pago',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
