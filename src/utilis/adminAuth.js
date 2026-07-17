import crypto from 'crypto';

/**
 * Clave secreta para firmar tokens. 
 * Se prioriza process.env.ADMIN_SECRET y se usa un fallback seguro en desarrollo.
 * @type {string}
 */
const SECRET = process.env.ADMIN_SECRET || 'auto-rifa-secret-key-9876-default';

/**
 * Genera un token firmado para el usuario administrador.
 * @param {string} username - El nombre de usuario que inicia sesión.
 * @returns {string} Token en formato "username:expires:signature"
 */
export function signToken(username) {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  const data = `${username}:${expires}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
  return `${data}:${signature}`;
}

/**
 * Verifica un token de sesión de administración.
 * @param {string|undefined|null} token - El token obtenido de la cookie.
 * @returns {string|null} Nombre de usuario si es válido, o null si es inválido o expiró.
 */
export function verifyToken(token) {
  if (!token) return null;
  
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return null;
    
    const [username, expires, signature] = parts;
    
    // Verificar si expiró
    if (Date.now() > parseInt(expires, 10)) {
      return null;
    }
    
    // Verificar firma
    const data = `${username}:${expires}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    return username;
  } catch (error) {
    console.error('Error verificando token de admin:', error);
    return null;
  }
}
