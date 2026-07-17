import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../../utilis/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * Verifica si el usuario actual está autenticado como administrador.
 * @param {Request} request - Solicitud HTTP de Next.js
 * @returns {Promise<NextResponse>} Respuesta JSON indicando estado de autenticación.
 */
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('admin_session');
    
    if (!tokenCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const username = verifyToken(tokenCookie.value);
    
    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({ authenticated: true, username });
  } catch (error) {
    console.error('Error verificando sesión de admin:', error);
    return NextResponse.json({ authenticated: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
