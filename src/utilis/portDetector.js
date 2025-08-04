/**
 * Utilidad para detectar el puerto correcto en desarrollo local
 */

// Función para detectar el puerto actual del servidor Next.js
export const detectCurrentPort = () => {
  // En el navegador (lado cliente)
  if (typeof window !== 'undefined') {
    return window.location.port || '3000';
  }
  
  // En el servidor (lado servidor)
  // Intentar obtener del entorno
  if (process.env.PORT) {
    return process.env.PORT;
  }
  
  // Puerto por defecto o alternativo común de Next.js
  return process.env.NEXT_PUBLIC_PORT || '3001';
};

// Función para obtener URL completa con puerto correcto
export const getCurrentBaseUrl = () => {
  // En el navegador
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port || '3000'}`;
  }
  
  // En Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // URL personalizada
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Desarrollo local con puerto detectado
  const port = detectCurrentPort();
  return `http://localhost:${port}`;
};