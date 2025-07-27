import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center py-5">
              {/* Icono de éxito */}
              <div className="mb-4">
                <i 
                  className="fas fa-check-circle text-success" 
                  style={{ fontSize: '4rem' }}
                ></i>
              </div>

              {/* Título */}
              <h2 className="text-success mb-3">¡Pago Exitoso!</h2>
              
              {/* Mensaje */}
              <p className="text-muted mb-4">
                Tu compra de tickets ha sido procesada correctamente.
                <br />
                En breve recibirás un email con los detalles de tu compra.
              </p>

              {/* Información del pago */}
              <div className="bg-light rounded p-3 mb-4">
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Estado:</small>
                    <div className="fw-bold text-success">Aprobado</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Método:</small>
                    <div className="fw-bold">MercadoPago</div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="alert alert-info border-0 mb-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>¿Qué sigue?</strong>
                <ul className="list-unstyled mt-2 mb-0 text-start">
                  <li>✓ Recibirás un email de confirmación</li>
                  <li>✓ Tus tickets estarán disponibles en tu cuenta</li>
                  <li>✓ Podrás ver el sorteo en tiempo real</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="d-grid gap-2">
                <Link 
                  href="/dashboard-my-properties" 
                  className="btn btn-primary btn-lg"
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Ver Mis Tickets
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
                  ¿Tienes algún problema? 
                  <Link href="/contact" className="text-primary ms-1">
                    Contáctanos
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

export default function PaymentSuccess() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Pago Exitoso - AutoRifa',
  description: 'Tu pago ha sido procesado exitosamente',
}; 