import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';

/**
 * Genera un buffer de PDF para un ticket de sorteo.
 * @param {Object} ticketData - Datos del ticket a incorporar en el PDF.
 * @param {string} ticketData.name - Nombre del comprador.
 * @param {string} ticketData.email - Correo del comprador.
 * @param {string} ticketData.identification - RUT del comprador.
 * @param {number|string} ticketData.paymentId - ID de la transacción de pago.
 * @param {number} ticketData.amount - Monto pagado.
 * @param {string} ticketData.ticketNumber - Número de ticket único.
 * @param {string} ticketData.purchaseDate - Fecha de la compra formateada.
 * @param {string} [ticketData.qrCodeDataURL] - URL de datos del código QR.
 * @returns {Promise<Buffer>} Buffer del documento PDF generado.
 */
export async function generateTicketPDF(ticketData) {
  try {
    // Si no viene el código QR generado, generarlo ahora
    let qrCodeUrl = ticketData.qrCodeDataURL;
    if (!qrCodeUrl) {
      const qrData = JSON.stringify({
        ticket: ticketData.ticketNumber,
        payment: ticketData.paymentId,
        amount: ticketData.amount,
        date: ticketData.purchaseDate,
        user: ticketData.name
      });
      qrCodeUrl = await QRCode.toDataURL(qrData);
    }

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
    
    // Agregar código QR
    if (qrCodeUrl) {
      try {
        doc.setFont('helvetica', 'bold');
        doc.text('Codigo QR del Ticket:', 20, currentY + 10);
        
        // Agregar imagen QR
        doc.addImage(qrCodeUrl, 'PNG', 20, currentY + 20, 50, 50);
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
    
    // Convertir a buffer
    return Buffer.from(doc.output('arraybuffer'));
  } catch (error) {
    console.error('Error generando PDF en ticketService:', error);
    throw error;
  }
}

/**
 * Envía por correo electrónico un ticket de sorteo adjunto como PDF.
 * @param {Object} params - Parámetros del envío.
 * @param {string} params.email - Destinatario.
 * @param {string} params.name - Nombre del destinatario.
 * @param {string} params.ticketNumber - Número de ticket.
 * @param {Buffer} params.pdfBuffer - Buffer del PDF generado.
 * @returns {Promise<void>}
 */
export async function sendTicketEmail({ email, name, ticketNumber, pdfBuffer }) {
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
          
          <p>¡Gracias por participar! Tu ticket para el sorteo ha sido generado/re-enviado.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1565C0;">Detalles de tu Ticket:</h3>
            <p><strong>Número de Ticket:</strong> <span style="color: #D32F2F; font-size: 18px;">${ticketNumber}</span></p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha de Emisión:</strong> ${new Date().toLocaleString('es-CL')}</p>
          </div>
          
          <p>Adjunto encontrarás tu ticket en formato PDF. ¡Guárdalo como comprobante de tu participación!</p>
          
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
