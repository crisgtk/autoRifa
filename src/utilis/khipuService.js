import crypto from 'crypto';

/**
 * Codifica una cadena según el estándar RFC 3986 para firmas de Khipu.
 * @param {string|number|boolean} str - El valor a codificar.
 * @returns {string} El valor codificado.
 */
function percentEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, '%20');
}

/**
 * Genera la firma digital HMAC-SHA256 requerida por la API v2.0 de Khipu.
 * @param {Object} params - Parámetros para la generación de la firma.
 * @param {string} params.method - El método HTTP (GET, POST, etc.).
 * @param {string} params.url - La URL completa del endpoint sin parámetros de consulta.
 * @param {Object} params.params - Los parámetros de consulta o del formulario.
 * @param {string} params.secret - La llave secreta de Khipu.
 * @param {string|number} params.receiverId - El ID de cobrador de Khipu.
 * @returns {string} El encabezado de autorización resultante.
 */
export function generateSignature({ method, url, params, secret, receiverId }) {
  const encoded = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      encoded[percentEncode(key)] = percentEncode(val);
    }
  }

  let toSign = method.toUpperCase() + '&' + percentEncode(url);

  const sortedKeys = Object.keys(encoded).sort();
  for (const key of sortedKeys) {
    toSign += `&${key}=${encoded[key]}`;
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(toSign)
    .digest('hex');

  return `${receiverId}:${hash}`;
}

/**
 * Crea una solicitud de pago en Khipu.
 * @param {Object} paymentData - Datos de la solicitud de pago.
 * @param {number} paymentData.amount - El monto total a pagar en CLP.
 * @param {string} paymentData.subject - El motivo o descripción del cobro.
 * @param {string} paymentData.name - Nombre completo del pagador.
 * @param {string} paymentData.email - Correo electrónico del pagador.
 * @param {string} paymentData.RUT - RUT/Identificación del pagador.
 * @param {Array} paymentData.items - Los productos comprados.
 * @returns {Promise<Object>} La respuesta de Khipu con la URL de pago.
 */
export async function createKhipuPayment({ amount, subject, name, email, RUT, items }) {
  const receiverId = process.env.KHIPU_RECEIVER_ID;
  const secret = process.env.KHIPU_SECRET;
  
  if (!receiverId || !secret) {
    throw new Error('Credenciales de Khipu no configuradas en el entorno');
  }

  const host = 'https://khipu.com/api/2.0';
  const path = '/payments';
  
  const { getPaymentUrls } = await import('./environment');
  const urls = getPaymentUrls();

  const params = {
    subject,
    amount: Math.round(amount),
    currency: 'CLP',
    transaction_id: `RIFA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    return_url: urls.success,
    cancel_url: urls.failure,
    notify_url: urls.khipuWebhook || 'https://autorifa.cl/api/khipu/webhook', // URL por defecto si es desarrollo
    payer_name: name,
    payer_email: email,
    custom: JSON.stringify({ name, email, identification: RUT, items })
  };

  const authorization = generateSignature({
    method: 'POST',
    url: host + path,
    params,
    secret,
    receiverId
  });

  const body = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    body.append(key, String(val));
  }

  const response = await fetch(host + path, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al crear pago en Khipu:', errorText);
    throw new Error(`Khipu API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Obtiene los detalles de un pago en Khipu usando su token de notificación.
 * @param {string} notificationToken - El token provisto por la notificación de Khipu.
 * @returns {Promise<Object>} Los detalles completos de la transacción.
 */
export async function getKhipuPaymentDetails(notificationToken) {
  const receiverId = process.env.KHIPU_RECEIVER_ID;
  const secret = process.env.KHIPU_SECRET;

  if (!receiverId || !secret) {
    throw new Error('Credenciales de Khipu no configuradas en el entorno');
  }

  const host = 'https://khipu.com/api/2.0';
  const path = '/payments';
  
  const params = {
    notification_token: notificationToken
  };

  const authorization = generateSignature({
    method: 'GET',
    url: host + path,
    params,
    secret,
    receiverId
  });

  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${host}${path}?${query}`, {
    method: 'GET',
    headers: {
      'Authorization': authorization,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al obtener detalles del pago en Khipu:', errorText);
    throw new Error(`Khipu API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
