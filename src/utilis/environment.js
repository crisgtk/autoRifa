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

// Obtener la URL base según el entorno (funciona en cliente y servidor)
export const getBaseUrl = () => {
  // Cliente: usar window.location si está disponible
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Servidor: comportamiento original
  // Si hay una URL personalizada definida, usarla
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''); // Remover slash final
  }
  
  // En Vercel - usar VERCEL_URL con https
  if (process.env.VERCEL_URL) {
    // VERCEL_URL ya incluye el dominio sin protocolo
    const url = `https://${process.env.VERCEL_URL}`;
    return url.replace(/\/$/, ''); // Remover slash final si existe
  }
  
  // Para desarrollo local - detectar puerto de Next.js
  // Prioridad: NEXT_PUBLIC_SITE_URL > PORT > NEXT_PUBLIC_PORT > 3000 (puerto por defecto de Next.js)
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3000';
  return `http://localhost:${port}`;
};

// Obtener URLs de pago (para MercadoPago)
export const getPaymentUrls = () => {
  const baseUrl = getBaseUrl();
  const environment = getEnvironment();
  
  // Validar que la URL base sea válida
  if (!baseUrl || baseUrl.includes('localhost') && environment !== 'development') {
    console.warn('URL base no válida para webhooks de MercadoPago:', baseUrl);
  }
  
  const urls = {
    success: `${baseUrl}/payment/success`,
    failure: `${baseUrl}/payment/failure`, 
    pending: `${baseUrl}/payment/pending`,
    // Para desarrollo local, no incluir webhook (MercadoPago no acepta localhost)
    webhook: environment === 'development' ? null : `${baseUrl}/api/mercadopago/webhook`
  };
  
  // Validar que la URL del webhook sea válida si está definida
  if (urls.webhook) {
    const validation = validateMercadoPagoUrl(urls.webhook);
    if (validation.valid) {
      console.log('URL del webhook válida:', urls.webhook);
    } else {
      console.error('URL del webhook inválida:', urls.webhook, 'Razón:', validation.reason);
      urls.webhook = null;
    }
  }
  
  return urls;
};

// Validar URL específicamente para MercadoPago
export const validateMercadoPagoUrl = (url) => {
  if (!url) return { valid: false, reason: 'URL vacía' };
  
  try {
    const parsedUrl = new URL(url);
    
    // MercadoPago requiere HTTPS en producción
    if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost') {
      return { valid: false, reason: 'MercadoPago requiere HTTPS para URLs públicas' };
    }
    
    // No puede ser localhost en producción
    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
      return { valid: false, reason: 'MercadoPago no acepta URLs localhost' };
    }
    
    // Debe tener un dominio válido
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
      return { valid: false, reason: 'Dominio inválido' };
    }
    
    return { valid: true, url: parsedUrl.href };
  } catch (error) {
    return { valid: false, reason: `URL malformada: ${error.message}` };
  }
};

// Información del entorno actual (para debugging)
export const getEnvironmentInfo = () => {
  const urls = getPaymentUrls();
  const webhookValidation = urls.webhook ? validateMercadoPagoUrl(urls.webhook) : { valid: false, reason: 'No definida' };
  
  return {
    environment: getEnvironment(),
    baseUrl: getBaseUrl(),
    urls: urls,
    webhookValidation: webhookValidation,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL || 'No disponible',
    customSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'No definida'
  };
};