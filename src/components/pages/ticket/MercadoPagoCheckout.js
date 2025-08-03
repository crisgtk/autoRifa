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
        <div className="alert alert-success" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>¡Pago exitoso!</strong>
          <div className="mt-2">
            <small>ID de transacción: {paymentResult.id}</small>
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