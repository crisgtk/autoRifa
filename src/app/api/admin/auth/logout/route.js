import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Maneja el cierre de sesión del panel administrativo.
 * Elimina la cookie de sesión admin_session.
 * @param {Request} request - Solicitud HTTP de Next.js
 * @returns {Promise<NextResponse>} Respuesta JSON indicando éxito.
 */
export async function POST(request) {
  try {
    const cookieStore = cookies();
    
    // Eliminar la cookie seteando su expiración a 0
    cookieStore.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'strict'
    });
    
    return NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error en API de logout de admin:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
