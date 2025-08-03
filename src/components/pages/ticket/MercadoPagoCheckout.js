"use client";
import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const MercadoPagoCheckout = ({ 
  items, 
  total, 
  onSuccess = () => {}, 
  onError = () => {},
  onPending = () => {} 
}) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar MercadoPago con la public key
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey, {
        locale: 'es-CL'
      });
    } else {
      setError('Error: No se encontró la clave pública de MercadoPago');
    }
  }, []);

  // Crear preferencia de pago
  const createPreference = async () => {
    setLoading(true);
    setError(null);

    // Debug: verificar variables de entorno
    console.log('Variables de entorno del frontend:', {
      NEXT_PUBLIC_SUCCESS_URL: process.env.NEXT_PUBLIC_SUCCESS_URL,
      NEXT_PUBLIC_FAILURE_URL: process.env.NEXT_PUBLIC_FAILURE_URL,
      NEXT_PUBLIC_PENDING_URL: process.env.NEXT_PUBLIC_PENDING_URL,
      NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ? 'Configurado' : 'NO CONFIGURADO',
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'NO DISPONIBLE'
    });

    try {
      const requestData = {
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'CLP'
        })),
        back_urls: {
          success: process.env.NEXT_PUBLIC_SUCCESS_URL || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/payment/success`,
          failure: process.env.NEXT_PUBLIC_FAILURE_URL || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/payment/failure`,
          pending: process.env.NEXT_PUBLIC_PENDING_URL || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/payment/pending`
        },
        // Temporalmente desactivamos auto_return para probar
        // auto_return: 'approved',
        notification_url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/mercadopago/webhook`,
        metadata: {
          timestamp: Date.now(),
          total: total
        }
      };

      console.log('Datos que se enviarán al API:', JSON.stringify(requestData, null, 2));

      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setPreferenceId(data.id);
      
    } catch (err) {
      console.error('Error creando preferencia:', err);
      setError(err.message || 'Error al procesar el pago');
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar el clic del botón de pago
  const handlePayment = () => {
    if (!preferenceId) {
      createPreference();
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
            setPreferenceId(null);
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mercadopago-checkout">
      {loading && (
        <div className="d-flex align-items-center justify-content-center py-3">
          <div className="spinner-border text-primary me-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span>Preparando el pago...</span>
        </div>
      )}

      {!preferenceId && !loading && (
        <button 
          className="btn btn-primary w-100 py-3"
          onClick={handlePayment}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #00a8e6 0%, #0077c7 100%)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(0, 168, 230, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-credit-card me-2"></i>
          Pagar con MercadoPago
          <div className="small mt-1 opacity-75">
            Total: ${total.toLocaleString('es-CL')} CLP
          </div>
        </button>
      )}

      {preferenceId && !loading && (
        <div className="mercadopago-wallet">
          <Wallet 
            initialization={{ 
              preferenceId: preferenceId,
              redirectMode: 'self'
            }}
            customization={{
              texts: {
                valueProp: 'smart_option'
              }
            }}
            onReady={() => {
              console.log('MercadoPago Wallet está listo');
            }}
            onSubmit={(data) => {
              console.log('Pago enviado:', data);
            }}
            onError={(error) => {
              console.error('Error en MercadoPago Wallet:', error);
              setError('Error al cargar el método de pago');
              onError(error);
            }}
          />
        </div>
      )}

      {/* Información de prueba */}
      <div className="mt-3 p-3 bg-light rounded">
        <h6 className="text-muted mb-2">
          <i className="fas fa-info-circle me-2"></i>
          Modo de Prueba
        </h6>
        <p className="small text-muted mb-2">
          Usa estas tarjetas de prueba para simular pagos:
        </p>
        <div className="row small text-muted">
          <div className="col-md-6">
            <strong>Visa:</strong> 4170 0688 1010 8020<br/>
            <strong>Mastercard:</strong> 5031 7557 3453 0604<br/>
            <strong>Amex:</strong> 3711 803032 57522
          </div>
          <div className="col-md-6">
            <strong>CVV:</strong> 123 (Amex: 1234)<br/>
            <strong>Fecha:</strong> Cualquier fecha futura<br/>
            <strong>Nombre:</strong> APRO (para aprobada)
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckout; 