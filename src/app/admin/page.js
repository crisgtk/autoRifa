"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';

/**
 * @typedef {Object} TicketItem
 * @property {string} title - Título del item.
 * @property {number} quantity - Cantidad de números.
 * @property {number} unit_price - Precio unitario.
 */

/**
 * @typedef {Object} Ticket
 * @property {string} timestamp - Fecha y hora del registro.
 * @property {string} ticketNumber - Número identificador único del ticket.
 * @property {string} customerEmail - Correo del comprador.
 * @property {string} customerName - Nombre del comprador.
 * @property {string} customerRUT - RUT / Documento del comprador.
 * @property {string|number} paymentId - Identificador del pago.
 * @property {number} amount - Monto total pagado.
 * @property {TicketItem[]} items - Items asociados.
 * @property {string} status - Estado ('generated' | 'cancelled').
 * @property {string} source - Origen ('mercadopago' | 'manual').
 */

/**
 * Panel de control principal (Dashboard) para el administrador.
 * Permite visualizar métricas, buscar tickets, emitir tickets manuales, reenviar emails y anular tickets.
 * @returns {React.ReactElement} Dashboard administrativo.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Datos y filtros
  /** @type {[Ticket[], React.Dispatch<React.SetStateAction<Ticket[]>>]} */
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear a la página 1 cuando cambian los filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sourceFilter]);

  // Modal para emisión manual
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualRUT, setManualRUT] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualQuantity, setManualQuantity] = useState('1');
  const [submittingManual, setSubmittingManual] = useState(false);

  // Modal para confirmación de anulación
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  /** @type {[Ticket|null, React.Dispatch<React.SetStateAction<Ticket|null>>]} */
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // Sistema de toasts/alertas
  const [toasts, setToasts] = useState([]);

  /**
   * Agrega una notificación visual temporal en pantalla.
   * @param {string} message - Mensaje a mostrar.
   * @param {'success'|'error'} type - Tipo de notificación.
   */
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Verificar sesión al cargar
  useEffect(() => {
    async function verifySession() {
      try {
        const response = await fetch('/api/admin/auth/verify');
        if (response.ok) {
          setAuthenticated(true);
          fetchTickets();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
        router.push('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifySession();
  }, [router]);

  /**
   * Obtiene la lista completa de tickets desde la API.
   */
  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await fetch('/api/admin/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        showToast('Error al cargar la lista de tickets', 'error');
      }
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      showToast('Error de conexión al obtener tickets', 'error');
    } finally {
      setLoadingTickets(false);
    }
  };

  /**
   * Realiza el cierre de sesión del usuario administrador.
   */
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/admin/login');
      } else {
        showToast('Error al cerrar sesión', 'error');
      }
    } catch (err) {
      console.error('Error cerrando sesión:', err);
      showToast('Error de conexión', 'error');
    }
  };

  /**
   * Envía la solicitud para emitir un ticket manual de forma offline.
   * @param {React.FormEvent} e - Evento de formulario de React.
   */
  const handleCreateManualTicket = async (e) => {
    e.preventDefault();
    setSubmittingManual(true);

    try {
      const response = await fetch('/api/admin/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: manualName,
          email: manualEmail || undefined,
          identification: manualRUT || undefined,
          amount: parseFloat(manualAmount),
          quantity: parseInt(manualQuantity, 10),
        }),
      });

      if (response.ok) {
        const ticketNumber = response.headers.get('X-Ticket-Number');
        
        // Descargar PDF retornado directamente
        const pdfBlob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `ticket-${ticketNumber || 'manual'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(pdfUrl);

        showToast('Ticket manual emitido y descargado exitosamente');
        setIsManualModalOpen(false);
        // Limpiar campos
        setManualName('');
        setManualEmail('');
        setManualRUT('');
        setManualAmount('');
        setManualQuantity('1');
        // Recargar lista
        fetchTickets();
      } else {
        const errResult = await response.json();
        showToast(errResult.error || 'Error al emitir ticket manual', 'error');
      }
    } catch (err) {
      console.error('Error creando ticket manual:', err);
      showToast('Error al conectar con el servidor', 'error');
    } finally {
      setSubmittingManual(false);
    }
  };

  /**
   * Confirma y procesa la anulación de un ticket.
   */
  const handleCancelTicketConfirm = async () => {
    if (!ticketToCancel) return;
    setSubmittingCancel(true);

    try {
      const response = await fetch('/api/admin/tickets/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketNumber: ticketToCancel.ticketNumber }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(`Ticket ${ticketToCancel.ticketNumber} anulado correctamente`);
        setIsCancelModalOpen(false);
        setTicketToCancel(null);
        fetchTickets();
      } else {
        showToast(result.error || 'Error al anular el ticket', 'error');
      }
    } catch (err) {
      console.error('Error anulando ticket:', err);
      showToast('Error de conexión con el servidor', 'error');
    } finally {
      setSubmittingCancel(false);
    }
  };

  /**
   * Reenvía el email con el ticket adjunto al comprador.
   * @param {string} ticketNumber - Número de ticket a reenviar.
   */
  const handleResendEmail = async (ticketNumber) => {
    try {
      showToast(`Reenviando correo del ticket ${ticketNumber}...`);
      const response = await fetch('/api/admin/tickets/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketNumber }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || 'Correo reenviado exitosamente');
      } else {
        showToast(result.error || 'Error al reenviar correo', 'error');
      }
    } catch (err) {
      console.error('Error reenviando email:', err);
      showToast('Error de conexión al intentar reenviar', 'error');
    }
  };

  /**
   * Regenera y descarga el PDF de un ticket en la lista.
   * @param {Ticket} ticket - Objeto ticket a descargar.
   */
  const handleDownloadPDF = async (ticket) => {
    try {
      showToast(`Generando PDF para ${ticket.ticketNumber}...`);
      const response = await fetch('/api/tickets/generate-pdf-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: ticket.customerName,
          email: ticket.customerEmail,
          identification: ticket.customerRUT,
          paymentId: ticket.paymentId,
          amount: ticket.amount,
          ticketNumber: ticket.ticketNumber,
          purchaseDate: ticket.timestamp ? new Date(ticket.timestamp).toLocaleString('es-CL') : 'N/A',
          items: ticket.items
        }),
      });

      if (response.ok) {
        const pdfBlob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `ticket-${ticket.ticketNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(pdfUrl);
        showToast('PDF descargado con éxito');
      } else {
        showToast('Error al descargar el PDF', 'error');
      }
    } catch (err) {
      console.error('Error descargando PDF:', err);
      showToast('Error de conexión al descargar el PDF', 'error');
    }
  };

  // Filtrado y búsqueda local de tickets
  const filteredTickets = tickets.filter((ticket) => {
    // Buscar
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.customerRUT && ticket.customerRUT.includes(searchTerm));

    // Estado
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && ticket.status !== 'cancelled') ||
      (statusFilter === 'cancelled' && ticket.status === 'cancelled');

    // Origen
    const matchesSource = 
      sourceFilter === 'all' ||
      ticket.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Paginación
  const ITEMS_PER_PAGE = 10;
  const totalTickets = filteredTickets.length;
  const totalPages = Math.ceil(totalTickets / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalTickets);
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  /**
   * Genera los números de página a mostrar en la paginación con elipses
   * @returns {(number|string)[]} Array de números de página y elipses
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Cantidad de páginas alrededor de la página actual
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  // Estadísticas globales basadas en los tickets obtenidos
  const activeTickets = tickets.filter(t => t.status !== 'cancelled');
  const cancelledTicketsCount = tickets.filter(t => t.status === 'cancelled').length;
  
  // Total de ingresos de tickets activos (no anulados)
  const totalRevenue = activeTickets.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  // Cantidad total de números vendidos (tickets individuales o cantidades dentro del ticket)
  const totalNumbersSold = activeTickets.reduce((sum, t) => {
    if (Array.isArray(t.items)) {
      return sum + t.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
    }
    return sum + 1;
  }, 0);

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Verificando autenticación de administrador...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className={styles.container}>
      {/* HEADER DE ADMISTRACION */}
      <header className={styles.dashboardHeader}>
        <div className={styles.brandInfo}>
          <h1>🎟️ AutoRifa Admin</h1>
          <p>Panel de Control y Gestión de Ventas de Tickets</p>
        </div>
        <div className={styles.userActions}>
          <span className={styles.userInfo}>Sesión: <strong>Administrador</strong></span>
          <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
        </div>
      </header>

      {/* METRICAS RAPIDAS */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span>Números Vendidos</span>
            <h3>{totalNumbersSold}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconBlue}`}>🎫</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span>Monto Recaudado</span>
            <h3>${totalRevenue.toLocaleString('es-CL')} CLP</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconGreen}`}>💰</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span>Tickets Activos</span>
            <h3>{activeTickets.length}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconOrange}`}>✅</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span>Tickets Anulados</span>
            <h3>{cancelledTicketsCount}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconRed}`}>❌</div>
        </div>
      </section>

      {/* FILTROS Y BUSQUEDA */}
      <section className={styles.controlsRow}>
        <div className={styles.searchFilterGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por Ticket, Nombre, Email o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className={styles.selectFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="cancelled">Anulados</option>
          </select>

          <select
            className={styles.selectFilter}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">Todos los Orígenes</option>
            <option value="mercadopago">MercadoPago</option>
            <option value="manual">Venta Manual</option>
          </select>
        </div>

        <button onClick={() => setIsManualModalOpen(true)} className={styles.createButton}>
          <span>+</span> Emitir Ticket Manual
        </button>
      </section>

      {/* TABLA DE TICKETS */}
      <section className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {loadingTickets ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              Cargando listado de tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              No se encontraron tickets con los filtros aplicados.
            </div>
          ) : (
            <>
              <table className={styles.ticketsTable}>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>RUT</th>
                    <th>Origen</th>
                    <th>Monto</th>
                    <th>Números</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => {
                    const qty = Array.isArray(ticket.items)
                      ? ticket.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                      : 1;

                    return (
                      <tr key={ticket.ticketNumber}>
                        <td style={{ fontWeight: '600' }}>{ticket.ticketNumber}</td>
                        <td>
                          {ticket.timestamp
                            ? new Date(ticket.timestamp).toLocaleDateString('es-CL', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        <td>
                          <div style={{ fontWeight: '500' }}>{ticket.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ticket.customerEmail}</div>
                        </td>
                        <td>{ticket.customerRUT || '-'}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              ticket.source === 'manual' ? styles.sourceManual : styles.sourceMp
                            }`}
                          >
                            {ticket.source === 'manual' ? 'Manual' : 'Web / MP'}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>${ticket.amount.toLocaleString('es-CL')}</td>
                        <td>{qty}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              ticket.status === 'cancelled' ? styles.cancelled : styles.active
                            }`}
                          >
                            {ticket.status === 'cancelled' ? 'Anulado' : 'Activo'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionsCell}>
                            <button
                              onClick={() => handleDownloadPDF(ticket)}
                              className={`${styles.actionBtn} ${styles.downloadBtn}`}
                              title="Descargar / Imprimir PDF"
                            >
                              🖨️
                            </button>
                            <button
                              onClick={() => handleResendEmail(ticket.ticketNumber)}
                              className={`${styles.actionBtn} ${styles.resendBtn}`}
                              title="Reenviar por Email"
                              disabled={
                                ticket.status === 'cancelled' ||
                                !ticket.customerEmail ||
                                ticket.customerEmail.includes('sin-correo@ejemplo.com')
                              }
                            >
                              📧
                            </button>
                            <button
                              onClick={() => {
                                setTicketToCancel(ticket);
                                setIsCancelModalOpen(true);
                              }}
                              className={`${styles.actionBtn} ${styles.cancelBtn}`}
                              title="Anular Ticket"
                              disabled={ticket.status === 'cancelled'}
                            >
                              🚫
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINACION */}
              <div className={styles.paginationRow}>
                <div className={styles.paginationInfo}>
                  Mostrando <strong>{totalTickets === 0 ? 0 : startIndex + 1}</strong> a{' '}
                  <strong>{endIndex}</strong> de <strong>{totalTickets}</strong> tickets
                </div>
                <div className={styles.paginationButtons}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageBtn}
                    title="Página anterior"
                  >
                    &lsaquo;
                  </button>
                  {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`${styles.pageBtn} ${
                          currentPage === pageNum ? styles.activePage : ''
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageBtn}
                    title="Siguiente página"
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL: EMITIR TICKET MANUAL */}
      {isManualModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Emitir Nuevo Ticket Manual</h2>
              <button onClick={() => setIsManualModalOpen(false)} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleCreateManualTicket}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Nombre del Comprador *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email (Opcional, para enviar ticket)</label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="Ej. juan.perez@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>RUT / Documento (Opcional)</label>
                  <input
                    type="text"
                    value={manualRUT}
                    onChange={(e) => setManualRUT(e.target.value)}
                    placeholder="Ej. 12.345.678-9"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label>Monto Total ($ CLP) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder="Ej. 5000"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cantidad Números *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(e.target.value)}
                      placeholder="Ej. 1"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className={styles.cancelActionBtn}
                  disabled={submittingManual}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitActionBtn}
                  disabled={submittingManual}
                >
                  {submittingManual ? 'Emitiendo...' : 'Emitir e Imprimir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN ANULACIÓN */}
      {isCancelModalOpen && ticketToCancel && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ color: '#dc2626' }}>⚠️ Confirmar Anulación de Ticket</h2>
              <button onClick={() => setIsCancelModalOpen(false)} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p>¿Estás seguro de que deseas anular el ticket <strong>{ticketToCancel.ticketNumber}</strong>?</p>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                Esta acción es irreversible. El ticket se marcará como anulado y sus números asociados ya no se considerarán activos para el sorteo.
              </p>
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div><strong>Comprador:</strong> {ticketToCancel.customerName}</div>
                <div><strong>Monto:</strong> ${ticketToCancel.amount.toLocaleString('es-CL')} CLP</div>
                <div><strong>Email:</strong> {ticketToCancel.customerEmail}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className={styles.cancelActionBtn}
                disabled={submittingCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCancelTicketConfirm}
                className={`${styles.submitActionBtn} ${styles.dangerBtn}`}
                disabled={submittingCancel}
              >
                {submittingCancel ? 'Anulando...' : 'Sí, Anular Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIONES TOAST */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.type === 'error' ? styles.toastError : styles.toastSuccess
            }`}
          >
            <span>{toast.type === 'error' ? '❌' : '✅'}</span>
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
