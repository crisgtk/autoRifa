import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getPaymentUrls, validateMercadoPagoUrl } from '@/utilis/environment';

// Configurar MercadoPago con el access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  }
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      token, 
      issuer_id, 
      payment_method_id, 
      transaction_amount,
      installments,
      description,
      payer,
      items,
      total
    } = body;

    console.log('Datos recibidos para crear pago:', JSON.stringify(body, null, 2));
    
    // Verificar URLs de pago
    const paymentUrls = getPaymentUrls();
    console.log('URLs de pago configuradas:', paymentUrls);

    // Validaciones básicas
    if (!token) {
      return NextResponse.json(
        { error: 'Token de tarjeta es requerido' },
        { status: 400 }
      );
    }

    if (!payment_method_id) {
      return NextResponse.json(
        { error: 'Método de pago es requerido' },
        { status: 400 }
      );
    }

    // Configurar el pago
    const paymentData = {
      transaction_amount: total || transaction_amount,
      token: token,
      description: description || 'Compra de tickets para sorteo',
      installments: parseInt(installments) || 1,
      payment_method_id: payment_method_id,
      issuer_id: issuer_id,
      payer: {
        email: payer?.email || 'test.buyer@example.com',
        identification: payer?.identification || {
          type: 'RUT',
          number: '12345678-9'
        }
      },
      external_reference: `ticket-${Date.now()}`,
      metadata: {
        items: items || [],
        timestamp: Date.now(),
        total: total || transaction_amount
      },
      // URL de notificación para webhooks (solo en producción - MercadoPago no acepta localhost)
      ...(paymentUrls.webhook && { notification_url: paymentUrls.webhook }),
      
      // Información adicional para Chile
      additional_info: {
        items: (items || []).map((item, index) => ({
          id: `item-${index}`,
          title: item.title || 'Ticket para sorteo',
          description: item.description || 'Ticket para participar en sorteo',
          picture_url: null,
          category_id: 'tickets',
          quantity: parseInt(item.quantity) || 1,
          unit_price: parseFloat(item.unit_price) || (total || transaction_amount)
        })),
        payer: {
          first_name: 'Test',
          last_name: 'User',
          phone: {
            area_code: '56',
            number: '987654321'
          }
        }
      }
    };

    console.log('Datos del pago a enviar a MercadoPago:', JSON.stringify(paymentData, null, 2));
    
    // Validar específicamente la notification_url si está presente
    if (paymentData.notification_url) {
      console.log('notification_url que se enviará:', paymentData.notification_url);
      const validation = validateMercadoPagoUrl(paymentData.notification_url);
      if (validation.valid) {
        console.log('notification_url es válida');
      } else {
        console.error('notification_url es inválida:', validation.reason);
        // Remover la notification_url inválida para evitar el error
        delete paymentData.notification_url;
        console.log('notification_url removida del payload');
      }
    } else {
      console.log('No se incluirá notification_url (modo desarrollo o URL inválida)');
    }

    // Crear el pago usando la API de MercadoPago
    const payment = new Payment(client);
    const response = await payment.create({ body: paymentData });

    console.log('Respuesta de MercadoPago:', JSON.stringify(response, null, 2));

    return NextResponse.json({
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      external_reference: response.external_reference,
      transaction_amount: response.transaction_amount,
      currency_id: response.currency_id,
      payment_method_id: response.payment_method_id,
      payment_type_id: response.payment_type_id,
      date_created: response.date_created,
      date_approved: response.date_approved
    });

  } catch (error) {
    console.error('Error creando pago:', error);
    
    // Extraer información útil del error
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;
    }

    if (error.status) {
      statusCode = error.status;
    }

    // Si es un error de MercadoPago, extraer más detalles
    if (error.cause && error.cause.length > 0) {
      const mpError = error.cause[0];
      errorMessage = `MercadoPago Error: ${mpError.description || mpError.message}`;
      statusCode = 400;
      console.error('Detalles del error de MercadoPago:', mpError);
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    );
  }
}