import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

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
    const { items, back_urls, auto_return, notification_url, metadata } = body;

    // Validar que tenemos todos los datos necesarios
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items son requeridos' },
        { status: 400 }
      );
    }

    // Validar back_urls cuando se usa auto_return
    if (auto_return && (!back_urls || !back_urls.success)) {
      return NextResponse.json(
        { error: 'back_urls.success es requerido cuando se usa auto_return' },
        { status: 400 }
      );
    }

    // Validar que las URLs sean absolutas si están presentes
    const validateUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (back_urls) {
      if (back_urls.success && !validateUrl(back_urls.success)) {
        return NextResponse.json(
          { error: 'back_urls.success debe ser una URL válida' },
          { status: 400 }
        );
      }
      if (back_urls.failure && !validateUrl(back_urls.failure)) {
        return NextResponse.json(
          { error: 'back_urls.failure debe ser una URL válida' },
          { status: 400 }
        );
      }
      if (back_urls.pending && !validateUrl(back_urls.pending)) {
        return NextResponse.json(
          { error: 'back_urls.pending debe ser una URL válida' },
          { status: 400 }
        );
      }
    }

    // Configurar URLs de retorno
    const finalBackUrls = back_urls ? {
      success: back_urls.success,
      failure: back_urls.failure,
      pending: back_urls.pending,
    } : {
      success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`,
      failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/failure`,
      pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/pending`,
    };

    // Configurar la preferencia de pago
    const preference = {
      items: items.map(item => ({
        title: item.title,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
        currency_id: item.currency_id || 'CLP',
      })),
      back_urls: finalBackUrls,
      ...(auto_return && finalBackUrls.success ? { auto_return: auto_return } : {}),
      notification_url: notification_url,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Hasta 12 cuotas
      },
      payer: {
        // Email por defecto para pruebas - en producción usar el email real del usuario
        email: 'test.buyer@example.com',
      },
      external_reference: `ticket-${Date.now()}`,
      metadata: metadata || {},
      // Configuración mínima para Chile
      additional_info: {
        items: items.map(item => ({
          id: `item-${Date.now()}`,
          title: item.title,
          description: `Ticket para sorteo: ${item.title}`,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        }))
      },
    };

    console.log('Datos recibidos del frontend:', JSON.stringify(body, null, 2));
    console.log('URLs procesadas:', JSON.stringify(finalBackUrls, null, 2));
    console.log('🔍 DIAGNÓSTICO COMPLETO DE CREDENCIALES:');
    console.log('Variables de entorno:', {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
      ACCESS_TOKEN_START: process.env.MERCADOPAGO_ACCESS_TOKEN ? process.env.MERCADOPAGO_ACCESS_TOKEN.substring(0, 30) : 'NO CONFIGURADO',
      ACCESS_TOKEN_LENGTH: process.env.MERCADOPAGO_ACCESS_TOKEN ? process.env.MERCADOPAGO_ACCESS_TOKEN.length : 0,
      PUBLIC_KEY_START: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ? process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY.substring(0, 30) : 'NO CONFIGURADO'
    });
    
    // Verificar formato de credenciales
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (accessToken) {
      console.log('🔧 ANÁLISIS ACCESS TOKEN:');
      console.log('- Empieza con APP_USR:', accessToken.startsWith('APP_USR-'));
      console.log('- Es sandbox (TEST):', accessToken.includes('TEST'));
      console.log('- Longitud esperada (~200 chars):', accessToken.length > 150);
    }
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