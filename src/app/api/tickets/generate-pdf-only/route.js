import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
      purchaseDate,
      items
    } = body;

    console.log('📋 Generando PDF para:', { name, email, paymentId, ticketNumber });

    // Generar código QR
    const qrData = JSON.stringify({
      ticket: ticketNumber,
      payment: paymentId,
      amount: amount,
      date: purchaseDate,
      user: name
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

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
    doc.text(String(ticketNumber || 'N/A'), 20, 75);
    
    // Información del comprador
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro
    
    const info = [
      ['Nombre:', String(name || 'N/A')],
      ['Email:', String(email || 'N/A')],
      ['RUT:', String(identification || 'N/A')],
      ['Fecha de Compra:', String(purchaseDate || 'N/A')],
      ['ID de Pago:', String(paymentId || 'N/A')],
      ['Monto Pagado:', `$${(amount || 0).toLocaleString('es-CL')} CLP`]
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
    if (qrCodeDataURL) {
      doc.setFont('helvetica', 'bold');
      doc.text('Codigo QR del Ticket:', 20, currentY + 10);
      
      // Agregar imagen QR
      doc.addImage(qrCodeDataURL, 'PNG', 20, currentY + 20, 50, 50);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102); // Gris
    doc.text('Este ticket es valido para participar en el sorteo.', 105, 250, { align: 'center' });
    doc.text('Conserva este documento como comprobante de tu participacion.', 105, 260, { align: 'center' });
    
    // Generar el PDF como buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    console.log('✅ PDF generado exitosamente');
    console.log('📄 Tamaño del PDF:', pdfBuffer.length, 'bytes');

    // Retornar el PDF como descarga directa
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticketNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    
    return NextResponse.json({
      error: 'Error interno del servidor al generar ticket',
      details: error.message
    }, { status: 500 });
  }
}