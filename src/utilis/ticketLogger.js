import fs from 'fs/promises';
import path from 'path';

/**
 * Sistema de logging estructurado para tickets
 * Crea archivos JSON con todos los tickets generados
 */

export async function logTicketGeneration(ticketData) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFile = path.join(logDir, `tickets-${today}.json`);
    
    // Crear directorio si no existe
    await fs.mkdir(logDir, { recursive: true });
    
    // Estructura del log
    const logEntry = {
      timestamp: new Date().toISOString(),
      ticketNumber: ticketData.ticketNumber,
      customerEmail: ticketData.email,
      customerName: ticketData.name,
      customerRUT: ticketData.identification,
      paymentId: ticketData.paymentId,
      amount: ticketData.amount,
      items: ticketData.items,
      status: 'generated',
      source: 'mercadopago'
    };
    
    // Leer archivo existente o crear array vacío
    let logs = [];
    try {
      const existingData = await fs.readFile(logFile, 'utf8');
      logs = JSON.parse(existingData);
    } catch (error) {
      // Archivo no existe, empezar con array vacío
      logs = [];
    }
    
    // Agregar nuevo ticket
    logs.push(logEntry);
    
    // Guardar actualizado
    await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    
    console.log(`📝 Ticket registrado en log: ${logFile}`);
    
    return logEntry;
    
  } catch (error) {
    console.error('❌ Error guardando log de ticket:', error);
    // No fallar por esto, solo registrar error
  }
}

export async function getTicketsFromDate(date) {
  try {
    const logFile = path.join(process.cwd(), 'logs', `tickets-${date}.json`);
    const data = await fs.readFile(logFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getTodaysTickets() {
  const today = new Date().toISOString().split('T')[0];
  return await getTicketsFromDate(today);
}

/**
 * Obtiene todos los tickets registrados en todos los archivos de log
 * @returns {Promise<Array>} Lista de todos los tickets
 */
export async function getAllTickets() {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const files = await fs.readdir(logDir);
    const ticketFiles = files.filter(f => f.startsWith('tickets-') && f.endsWith('.json'));
    
    let allTickets = [];
    for (const file of ticketFiles) {
      try {
        const filePath = path.join(logDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const tickets = JSON.parse(fileContent);
        if (Array.isArray(tickets)) {
          allTickets.push(...tickets);
        }
      } catch (e) {
        console.error(`Error al leer archivo de tickets ${file}:`, e);
      }
    }
    return allTickets;
  } catch (error) {
    console.error('Error listando logs de tickets:', error);
    return [];
  }
}

/**
 * Anula un ticket específico buscando en todos los archivos de logs JSON
 * y cambiando su estado a 'cancelled'.
 * @param {string} ticketNumber - El número del ticket a anular.
 * @returns {Promise<boolean>} Retorna true si se encontró y anuló, false de lo contrario.
 */
export async function cancelTicket(ticketNumber) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const files = await fs.readdir(logDir);
    const ticketFiles = files.filter(f => f.startsWith('tickets-') && f.endsWith('.json'));
    
    for (const file of ticketFiles) {
      const filePath = path.join(logDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const tickets = JSON.parse(fileContent);
      
      if (Array.isArray(tickets)) {
        const ticketIndex = tickets.findIndex(t => t.ticketNumber === ticketNumber);
        if (ticketIndex !== -1) {
          // Cambiar estado a cancelado
          tickets[ticketIndex].status = 'cancelled';
          // Guardar cambios
          await fs.writeFile(filePath, JSON.stringify(tickets, null, 2));
          console.log(`✅ Ticket ${ticketNumber} anulado exitosamente en log: ${file}`);
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error(`❌ Error al anular ticket ${ticketNumber}:`, error);
    throw error;
  }
}