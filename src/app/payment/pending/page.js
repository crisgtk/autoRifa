"use client";
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentPendingContent() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center py-5">
              {/* Icono de espera */}
              <div className="mb-4">
                <i 
                  className="fas fa-clock text-warning" 
                  style={{ fontSize: '4rem' }}
                ></i>
              </div>

              {/* Título */}
              <h2 className="text-warning mb-3">Pago Pendiente</h2>
              
              {/* Mensaje */}
              <p className="text-muted mb-4">
                Tu pago está siendo procesado.
                <br />
                Te notificaremos una vez que se complete la transacción.
              </p>

              {/* Información del pago */}
              <div className="bg-light rounded p-3 mb-4">
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Estado:</small>
                    <div className="fw-bold text-warning">Pendiente</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Método:</small>
                    <div className="fw-bold">MercadoPago</div>
                  </div>
                </div>
              </div>

              {/* Información del proceso */}
              <div className="alert alert-info border-0 mb-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>¿Qué está pasando?</strong>
                <ul className="list-unstyled mt-2 mb-0 text-start">
                  <li>• Tu pago está siendo verificado</li>
                  <li>• Esto puede tomar unos minutos</li>
                  <li>• Recibirás una notificación por email</li>
                  <li>• No es necesario que hagas nada más</li>
                </ul>
              </div>

              {/* Barra de progreso animada */}
              <div className="mb-4">
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                    role="progressbar" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <small className="text-muted mt-2 d-block">Procesando...</small>
              </div>

              {/* Botones de acción */}
              <div className="d-grid gap-2">
                <Link 
                  href="/dashboard-my-properties" 
                  className="btn btn-primary btn-lg"
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Ver Mi Cuenta
                </Link>
                
                <button 
                  className="btn btn-outline-info"
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Actualizar Estado
                </button>
                
                <Link 
                  href="/" 
                  className="btn btn-outline-secondary"
                >
                  <i className="fas fa-home me-2"></i>
                  Volver al Inicio
                </Link>
              </div>

              {/* Información de soporte */}
              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  Si después de 10 minutos no recibes confirmación,
                  <Link href="/contact" className="text-primary ms-1">
                    contáctanos
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPending() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}

// Metadata removed - Client Components cannot export metadata 