import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar MercadoPago con el access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, back_urls, auto_return, notification_url, metadata } = body;

    // Validar que tenemos todos los datos necesarios
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items son requeridos' },
        { status: 400 }
      );
    }

    // Configurar la preferencia de pago
    const preference = {
      items: items.map(item => ({
        title: item.title,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
        currency_id: item.currency_id || 'CLP',
      })),
      back_urls: back_urls || {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/pending`,
      },
      auto_return: auto_return || 'approved',
      notification_url: notification_url,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Hasta 12 cuotas
      },
      payer: {
        email: 'test_user@test.com', // Email de prueba
      },
      external_reference: `ticket-${Date.now()}`,
      metadata: metadata || {},
      // Configuración específica para Chile
      additional_info: {
        items: items.map(item => ({
          id: `item-${Date.now()}`,
          title: item.title,
          description: `Ticket para sorteo: ${item.title}`,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
        payer: {
          first_name: 'Test',
          last_name: 'User',
          phone: {
            area_code: '56',
            number: '123456789',
          },
        },
        shipments: {
          receiver_address: {
            zip_code: '7500000',
            state_name: 'Región Metropolitana',
            city_name: 'Santiago',
            street_name: 'Calle Test',
            street_number: 123,
          },
        },
      },
    };

    console.log('Creando preferencia:', JSON.stringify(preference, null, 2));

    // Crear la preferencia en MercadoPago usando la nueva API
    const preferenceApi = new Preference(client);
    const response = await preferenceApi.create({ body: preference });

    console.log('Respuesta de MercadoPago:', response);

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    
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