import { NextResponse } from 'next/server';
import { getTicketsFromDate, getTodaysTickets } from '../../../../utilis/ticketLogger';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // YYYY-MM-DD format
    const action = searchParams.get('action') || 'today';

    let tickets = [];
    let reportType = '';

    switch (action) {
      case 'today':
        tickets = await getTodaysTickets();
        reportType = 'Tickets de Hoy';
        break;
        
      case 'date':
        if (!date) {
          return NextResponse.json(
            { error: 'Fecha requerida para consulta por fecha (formato: YYYY-MM-DD)' },
            { status: 400 }
          );
        }
        tickets = await getTicketsFromDate(date);
        reportType = `Tickets del ${date}`;
        break;
        
      default:
        tickets = await getTodaysTickets();
        reportType = 'Tickets de Hoy';
    }

    // Calcular estadísticas
    const stats = {
      totalTickets: tickets.length,
      totalRevenue: tickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0),
      uniqueCustomers: new Set(tickets.map(t => t.customerEmail)).size,
      averageTicketValue: tickets.length > 0 
        ? tickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0) / tickets.length 
        : 0
    };

    return NextResponse.json({
      success: true,
      reportType,
      date: date || new Date().toISOString().split('T')[0],
      stats,
      tickets,
      message: `Reporte generado exitosamente: ${tickets.length} tickets encontrados`
    });

  } catch (error) {
    console.error('Error generando reporte:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar reporte',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Endpoint para obtener estadísticas rápidas
export async function POST(request) {
  try {
    const body = await request.json();
    const { startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate y endDate son requeridos' },
        { status: 400 }
      );
    }

    // Generar array de fechas entre startDate y endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(dt.toISOString().split('T')[0]);
    }

    // Obtener tickets de cada fecha
    const allTickets = [];
    for (const date of dateArray) {
      const dayTickets = await getTicketsFromDate(date);
      allTickets.push(...dayTickets);
    }

    // Agrupar por fecha
    const ticketsByDate = {};
    allTickets.forEach(ticket => {
      const ticketDate = ticket.timestamp.split('T')[0];
      if (!ticketsByDate[ticketDate]) {
        ticketsByDate[ticketDate] = [];
      }
      ticketsByDate[ticketDate].push(ticket);
    });

    // Estadísticas generales
    const totalRevenue = allTickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0);
    const uniqueCustomers = new Set(allTickets.map(t => t.customerEmail)).size;

    return NextResponse.json({
      success: true,
      dateRange: { startDate, endDate },
      summary: {
        totalTickets: allTickets.length,
        totalRevenue,
        uniqueCustomers,
        averageTicketValue: allTickets.length > 0 ? totalRevenue / allTickets.length : 0,
        daysInRange: dateArray.length
      },
      ticketsByDate,
      message: `Reporte de rango generado: ${allTickets.length} tickets en ${dateArray.length} días`
    });

  } catch (error) {
    console.error('Error generando reporte de rango:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar reporte de rango',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}