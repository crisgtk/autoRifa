import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('📧 Probando configuración de email...');
    console.log('✉️ Email destino:', email);
    console.log('👤 Email usuario:', process.env.EMAIL_USER);
    console.log('🔑 Password configurado:', !!process.env.EMAIL_PASSWORD);

    // Configurar el transportador de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('🔧 Verificando conexión...');
    
    // Verificar la conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');

    // Enviar email de prueba
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email || process.env.EMAIL_USER,
      subject: '🧪 Test - Configuración de Email AutoRifa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1565C0;">🎉 ¡Configuración Exitosa!</h2>
          <p>Tu configuración de email para <strong>AutoRifa</strong> está funcionando correctamente.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Configuración Verificada:</h3>
            <ul>
              <li>📧 Servidor: Gmail SMTP</li>
              <li>👤 Usuario: ${process.env.EMAIL_USER}</li>
              <li>🔐 Autenticación: Contraseña de aplicación</li>
              <li>🎯 Estado: ¡Funcionando!</li>
            </ul>
          </div>

          <p>Ahora los tickets se enviarán automáticamente después de cada pago exitoso.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Este es un email de prueba del sistema AutoRifa<br>
            Fecha: ${new Date().toLocaleString('es-CL')}
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado exitosamente:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      details: {
        messageId: result.messageId,
        from: process.env.EMAIL_USER,
        to: email || process.env.EMAIL_USER,
        service: 'Gmail',
        status: 'sent'
      }
    });

  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error enviando email de prueba',
      details: error.message,
      help: [
        '1. Verifica que EMAIL_USER y EMAIL_PASSWORD estén en .env.local',
        '2. Usa una contraseña de aplicación de Google (16 caracteres)',
        '3. Activa la verificación en 2 pasos en tu cuenta Google',
        '4. Ve a: https://myaccount.google.com/apppasswords'
      ]
    }, { status: 500 });
  }
}