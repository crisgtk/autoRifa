import Link from 'next/link';
import { Suspense } from 'react';

function PaymentFailureContent() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center py-5">
              {/* Icono de error */}
              <div className="mb-4">
                <i 
                  className="fas fa-times-circle text-danger" 
                  style={{ fontSize: '4rem' }}
                ></i>
              </div>

              {/* Título */}
              <h2 className="text-danger mb-3">Pago Rechazado</h2>
              
              {/* Mensaje */}
              <p className="text-muted mb-4">
                No pudimos procesar tu pago en este momento.
                <br />
                Por favor, intenta nuevamente con otro método de pago.
              </p>

              {/* Información del pago */}
              <div className="bg-light rounded p-3 mb-4">
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Estado:</small>
                    <div className="fw-bold text-danger">Rechazado</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Método:</small>
                    <div className="fw-bold">MercadoPago</div>
                  </div>
                </div>
              </div>

              {/* Posibles causas */}
              <div className="alert alert-warning border-0 mb-4">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Posibles causas:</strong>
                <ul className="list-unstyled mt-2 mb-0 text-start">
                  <li>• Fondos insuficientes en la tarjeta</li>
                  <li>• Datos de la tarjeta incorrectos</li>
                  <li>• Tarjeta vencida o bloqueada</li>
                  <li>• Límites de compra excedidos</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="d-grid gap-2">
                <Link 
                  href="/ticket" 
                  className="btn btn-primary btn-lg"
                >
                  <i className="fas fa-redo me-2"></i>
                  Intentar Nuevamente
                </Link>
                
                <Link 
                  href="/contact" 
                  className="btn btn-outline-warning"
                >
                  <i className="fas fa-headset me-2"></i>
                  Contactar Soporte
                </Link>
                
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
                  Si el problema persiste, 
                  <Link href="/contact" className="text-primary ms-1">
                    contáctanos
                  </Link>
                  {' '}y te ayudaremos a resolverlo.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailure() {
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
      <PaymentFailureContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Pago Rechazado - AutoRifa',
  description: 'Tu pago no pudo ser procesado',
}; 