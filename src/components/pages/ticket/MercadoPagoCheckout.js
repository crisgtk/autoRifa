"use client";
import React, { useState, useEffect } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

const MercadoPagoCheckout = ({ 
  items, 
  total, 
  onSuccess = () => {}, 
  onError = () => {},
  onPending = () => {} 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [ticketGenerated, setTicketGenerated] = useState(false);

  // Inicializar MercadoPago con la public key
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey, {
        locale: 'es-CL'
      });
      console.log('MercadoPago inicializado con Checkout Bricks');
    } else {
      setError('Error: No se encontró la clave pública de MercadoPago');
    }
  }, []);

  // Función para generar y descargar ticket
  const generateAndSendTicket = async (userData) => {
    try {
      console.log('🎟️ Generando ticket para:', userData);
      
      const response = await fetch('/api/tickets/generate', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Ticket generado y enviado por email exitosamente');
        setTicketGenerated(true);
      } else {
        console.error('❌ Error generando ticket:', result.error);
        setError('Error generando el ticket: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en generateAndSendTicket:', error);
      setError('Error de conexión al generar ticket');
    }
  };

  // Configuración para el CardPayment
  const cardPaymentBricksOptions = {
    amount: total,
    locale: 'es-CL',
    processingMode: 'aggregator',
    callbacks: {
      onReady: () => {
        console.log('CardPayment Brick está listo');
        setLoading(false);
      },
      onSubmit: async (cardFormData) => {
        setLoading(true);
        console.log('Datos del formulario de tarjeta:', cardFormData);
        
        try {
          const response = await fetch('/api/mercadopago/create-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...cardFormData,
              items: items,
              total: total,
              description: `Compra de tickets - ${items.map(item => item.title).join(', ')}`
            }),
          });

          const result = await response.json();
          
          if (result.error) {
            setError(result.error);
            onError(new Error(result.error));
            return;
          }

          setPaymentResult(result);
          
          if (result.status === 'approved') {
            console.log('Pago aprobado:', result);
            
            // Capturar datos del usuario para generar ticket
            const userData = {
              name: cardFormData.payer?.first_name || cardFormData.cardholder?.name || 'Usuario',
              email: cardFormData.payer?.email || 'usuario@ejemplo.com',
              identification: cardFormData.payer?.identification?.number || cardFormData.payer?.identification || 'Sin RUT',
              paymentId: result.id,
              amount: result.transaction_amount || total,
              ticketNumber: `TICKET-${Date.now()}`,
              purchaseDate: new Date().toLocaleString('es-CL'),
              items: items // Agregar información de los items comprados
            };
            
            console.log('Datos del usuario capturados:', userData);
            
            // Llamar al sistema de tickets
            await generateAndSendTicket(userData);
            
            onSuccess(result);
          } else if (result.status === 'pending') {
            console.log('Pago pendiente:', result);
            onPending(result);
          } else {
            console.log('Pago rechazado:', result);
            onError(new Error('Pago rechazado'));
          }
        } catch (err) {
          console.error('Error procesando pago:', err);
          setError('Error al procesar el pago');
          onError(err);
        } finally {
          setLoading(false);
        }
      },
      onError: (error) => {
        console.error('Error en CardPayment Brick:', error);
        setError('Error en el formulario de pago');
        onError(error);
        setLoading(false);
      }
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={() => {
            setError(null);
            setPaymentResult(null);
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (paymentResult) {
    if (paymentResult.status === 'approved') {
      return (
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <i className="fas fa-check-circle me-2"></i>
            <strong>¡Pago Exitoso!</strong>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-success">💳 Información del Pago</h6>
                <p className="mb-1"><strong>ID:</strong> {paymentResult.id}</p>
                <p className="mb-1"><strong>Monto:</strong> ${total.toLocaleString('es-CL')} CLP</p>
                <p className="mb-3"><strong>Estado:</strong> <span className="badge bg-success">Aprobado</span></p>
              </div>
              <div className="col-md-6">
                <h6 className="text-primary">🎟️ Tu Ticket</h6>
                {ticketGenerated ? (
                  <div className="alert alert-info">
                    <i className="fas fa-paper-plane me-2"></i>
                    <strong>¡Ticket enviado por email!</strong>
                    <div className="mt-2">
                      <small>Revisa tu bandeja de entrada (y spam)</small>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    <small>Generando y enviando ticket...</small>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="mb-2">🍀 ¡Felicitaciones!</h6>
              <p className="mb-2">Tu participación en el sorteo ha sido registrada exitosamente.</p>
              {ticketGenerated ? (
                <div className="alert alert-success mb-0">
                  <i className="fas fa-envelope me-2"></i>
                  <strong>✅ Ticket enviado por email exitosamente</strong>
                  <div className="mt-1">
                    <small>Revisa tu bandeja de entrada para encontrar tu ticket PDF con código QR</small>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info mb-0">
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm text-info me-2" role="status">
                      <span className="visually-hidden">Generando ticket...</span>
                    </div>
                    <span>Generando PDF y enviando por email...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (paymentResult.status === 'pending') {
      return (
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-clock me-2"></i>
          <strong>Pago pendiente</strong>
          <div className="mt-2">
            <small>Tu pago está siendo procesado</small>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="mercadopago-checkout">
      {loading && (
        <div className="d-flex align-items-center justify-content-center py-3">
          <div className="spinner-border text-primary me-3" role="status">
            <span className="visually-hidden">Procesando pago...</span>
          </div>
          <span>Procesando tu pago...</span>
        </div>
      )}

      <div className="mb-3">
        <h5 className="mb-3">Completa tu pago</h5>
        <div className="p-3 bg-light rounded mb-3">
          <div className="d-flex justify-content-between">
            <span>Total a pagar:</span>
            <strong>${total.toLocaleString('es-CL')} CLP</strong>
          </div>
        </div>
      </div>

      {/* CardPayment Brick */}
      <div className="card-payment-brick">
        <CardPayment 
          initialization={cardPaymentBricksOptions}
          onReady={cardPaymentBricksOptions.callbacks.onReady}
          onSubmit={cardPaymentBricksOptions.callbacks.onSubmit}
          onError={cardPaymentBricksOptions.callbacks.onError}
        />
      </div>

      {/* Información de prueba actualizada para TEST */}
      <div className="mt-3 p-3 bg-light rounded">
        <h6 className="text-muted mb-2">
          <i className="fas fa-info-circle me-2"></i>
          Tarjetas de Prueba (TEST)
        </h6>
        <p className="small text-muted mb-2">
          Usa estas tarjetas con credenciales TEST:
        </p>
        <div className="row small text-muted">
          <div className="col-md-6">
            <strong>Visa Aprobada:</strong> 4009 1753 3280 7176<br/>
            <strong>Mastercard Aprobada:</strong> 5031 7557 3453 0604<br/>
            <strong>Visa Rechazada:</strong> 4774 0614 1078 7852
          </div>
          <div className="col-md-6">
            <strong>CVV:</strong> 123<br/>
            <strong>Fecha:</strong> 12/25<br/>
            <strong>Nombre:</strong> APRO (aprobada) / OTHE (rechazada)
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckout;