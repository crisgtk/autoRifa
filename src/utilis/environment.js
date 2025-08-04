/**
 * Utilidad para manejar URLs de entorno de manera dinámica
 * Funciona automáticamente en local y en Vercel
 */

// Detectar el entorno actual
export const getEnvironment = () => {
  // En Vercel, VERCEL_URL siempre está disponible
  if (process.env.VERCEL_URL) {
    return 'vercel';
  }
  
  // En desarrollo local
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  
  // Producción genérica
  return 'production';
};

// Obtener la URL base según el entorno
export const getBaseUrl = () => {
  // Si hay una URL personalizada definida, usarla
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // En Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Para desarrollo local - detectar puerto de Next.js
  // Prioridad: NEXT_PUBLIC_SITE_URL > PORT > NEXT_PUBLIC_PORT > 3001 (puerto común de Next.js)
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3001';
  return `http://localhost:${port}`;
};

// Obtener URLs de pago (para MercadoPago)
export const getPaymentUrls = () => {
  const baseUrl = getBaseUrl();
  
  return {
    success: `${baseUrl}/payment/success`,
    failure: `${baseUrl}/payment/failure`, 
    pending: `${baseUrl}/payment/pending`,
    // Para desarrollo local, no incluir webhook (MercadoPago no acepta localhost)
    webhook: getEnvironment() === 'development' ? null : `${baseUrl}/api/mercadopago/webhook`
  };
};

// Información del entorno actual (para debugging)
export const getEnvironmentInfo = () => {
  return {
    environment: getEnvironment(),
    baseUrl: getBaseUrl(),
    urls: getPaymentUrls(),
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL || 'No disponible',
    customSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'No definida'
  };
};