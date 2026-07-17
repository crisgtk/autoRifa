import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken } from '../../../../../utilis/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * Maneja el inicio de sesión para el panel administrativo.
 * Verifica las credenciales contra las variables de entorno y establece una cookie HTTP-only.
 * @param {Request} request - Solicitud HTTP de Next.js
 * @returns {Promise<NextResponse>} Respuesta JSON indicando éxito o fracaso.
 */
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Obtener credenciales esperadas de variables de entorno (con fallbacks)
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || '*.admin.2026';
    
    if (username === expectedUsername && password === expectedPassword) {
      // Generar token firmado con HMAC
      const token = signToken(username);
      
      // Configurar cookie
      const cookieStore = cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/',
        sameSite: 'strict'
      });
      
      return NextResponse.json({ success: true, message: 'Inicio de sesión exitoso' });
    }
    
    return NextResponse.json(
      { success: false, error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error en API de login de admin:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
