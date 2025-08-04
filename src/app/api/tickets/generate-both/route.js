import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { logTicketGeneration } from '../../../../utilis/ticketLogger';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      identification, 
      paymentId, 
      amount, 
      ticketNumber, 
      purchaseDate 
    } = body;

    console.log('🎟️✉️ Generando ticket para EMAIL + DESCARGA:', body);

    // Validaciones básicas
    if (!email || !ticketNumber) {
      return NextResponse.json(
        { error: 'Email y número de ticket son requeridos' },
        { status: 400 }
      );
    }

    // Generar código QR con la información del ticket
    const qrData = JSON.stringify({
      ticket: ticketNumber,
      payment: paymentId,
      amount: amount,
      date: purchaseDate
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    // Generar PDF usando la función compartida
    const pdfBuffer = await generateTicketPDF({
      name,
      email,
      identification,
      paymentId,
      amount,
      ticketNumber,
      purchaseDate,
      qrCodeDataURL
    });

    // PASO 1: Enviar email con el PDF adjunto (en background)
    try {
      await sendTicketEmail({
        email,
        name,
        ticketNumber,
        pdfBuffer
      });
      console.log('✅ Email enviado exitosamente a:', email);
    } catch (emailError) {
      console.error('⚠️ Error enviando email (continuando con descarga):', emailError);
    }

    // PASO 2: Registrar ticket en logs
    await logTicketGeneration(body);

    // PASO 3: Retornar PDF para descarga automática
    console.log('📥 Retornando PDF para descarga automática');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticketNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        // Headers adicionales para indicar que también se envió por email
        'X-Email-Sent': 'true',
        'X-Ticket-Number': ticketNumber,
        'X-Success-Message': 'Ticket generado: PDF descargado y email enviado'
      }
    });

  } catch (error) {
    console.error('Error generando ticket (email + descarga):', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar ticket',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Función para generar el PDF del ticket usando jsPDF
async function generateTicketPDF(ticketData) {
  try {
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Header del ticket
    doc.setFontSize(24);
    doc.setTextColor(21, 101, 192); // Azul
    doc.text('TICKET DE SORTEO', 105, 30, { align: 'center' });
    
    // Línea decorativa
    doc.setDrawColor(21, 101, 192);
    doc.setLineWidth(2);
    doc.line(20, 40, 190, 40);
    
    // Número de ticket (destacado)
    doc.setFontSize(18);
    doc.setTextColor(21, 101, 192);
    doc.text('Numero de Ticket:', 20, 60);
    
    doc.setFontSize(24);
    doc.setTextColor(211, 47, 47); // Rojo
    doc.text(String(ticketData.ticketNumber || 'N/A'), 20, 75);
    
    // Información del comprador
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro
    
    const info = [
      ['Nombre:', String(ticketData.name || 'N/A')],
      ['Email:', String(ticketData.email || 'N/A')],
      ['RUT:', String(ticketData.identification || 'N/A')],
      ['Fecha de Compra:', String(ticketData.purchaseDate || 'N/A')],
      ['ID de Pago:', String(ticketData.paymentId || 'N/A')],
      ['Monto Pagado:', `$${(ticketData.amount || 0).toLocaleString('es-CL')} CLP`]
    ];
    
    let currentY = 95;
    info.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(String(label), 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 80, currentY);
      currentY += 15;
    });
    
    // Agregar código QR si está disponible
    if (ticketData.qrCodeDataURL) {
      try {
        doc.setFont('helvetica', 'bold');
        doc.text('Codigo QR del Ticket:', 20, currentY + 10);
        
        // Agregar imagen QR
        doc.addImage(ticketData.qrCodeDataURL, 'PNG', 20, currentY + 20, 50, 50);
      } catch (qrError) {
        console.error('Error agregando QR al PDF:', qrError);
        doc.text('(Codigo QR no disponible)', 20, currentY + 20);
      }
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102); // Gris
    doc.text('Este ticket es valido para participar en el sorteo.', 105, 250, { align: 'center' });
    doc.text('Conserva este documento como comprobante de tu participacion.', 105, 260, { align: 'center' });
    doc.text('✅ PDF descargado automaticamente + Email enviado', 105, 270, { align: 'center' });
    
    // Convertir a buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
}

// Función para enviar email
async function sendTicketEmail({ email, name, ticketNumber, pdfBuffer }) {
  // Configurar el transportador de email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Configurar el email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    bcc: 'autorifadeautoimporta@gmail.com',
    subject: `🎟️ Tu Ticket de Sorteo - ${ticketNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%); color: white; padding: 20px; text-align: center;">
          <h1>🎟️ ¡Ticket Generado Exitosamente!</h1>
        </div>
        
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>Hola ${name},</h2>
          
          <p>¡Gracias por tu compra! Tu ticket para el sorteo ha sido generado exitosamente.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1565C0;">Detalles de tu Ticket:</h3>
            <p><strong>Número de Ticket:</strong> <span style="color: #D32F2F; font-size: 18px;">${ticketNumber}</span></p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
          </div>
          
          <div style="background: #E8F5E8; padding: 15px; border-radius: 8px; margin: 20px 0; color: #2E7D32;">
            <p><strong>📥 Tu ticket también se descargó automáticamente en tu navegador</strong></p>
            <p>Si no se descargó, encuentra el PDF adjunto en este email.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="background: #E8F5E8; padding: 15px; border-radius: 8px; color: #2E7D32;">
              🍀 ¡Mucha suerte en el sorteo! 🍀
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666;">
          <p>Este es un email automático, no responder.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `ticket-${ticketNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  // Enviar el email
  await transporter.sendMail(mailOptions);
  console.log(`📧 Ticket enviado a cliente: ${email}`);
}