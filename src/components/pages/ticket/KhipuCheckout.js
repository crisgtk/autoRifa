"use client";
import React, { useState } from 'react';
import styles from './KhipuCheckout.module.css';

/**
 * Formatea una cadena como un RUT chileno (ej: 12.345.678-9).
 * @param {string} value - El texto ingresado.
 * @returns {string} El RUT formateado.
 */
function formatRUT(value) {
  let actual = value.replace(/[^0-9kK]/g, '');
  if (actual.length <= 1) return actual;
  
  const dv = actual.slice(-1).toUpperCase();
  const nums = actual.slice(0, -1);
  
  let formattedNums = '';
  for (let i = nums.length - 1, j = 0; i >= 0; i--, j++) {
    formattedNums = nums.charAt(i) + (j > 0 && j % 3 === 0 ? '.' : '') + formattedNums;
  }
  
  return `${formattedNums}-${dv}`;
}

/**
 * Valida un RUT chileno usando el algoritmo de módulo 11.
 * @param {string} rut - El RUT a validar.
 * @returns {boolean} True si el RUT es válido, false en caso contrario.
 */
function validateRUT(rut) {
  if (!rut || typeof rut !== 'string') return false;
  const clean = rut.replace(/[^0-9kK]/g, '');
  if (clean.length < 2) return false;
  
  const dv = clean.slice(-1).toUpperCase();
  const nums = parseInt(clean.slice(0, -1), 10);
  if (isNaN(nums)) return false;
  
  let M = 0, S = 1;
  let T = nums;
  for (; T; T = Math.floor(T / 10)) {
    S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
  }
  const expectedDv = S ? String(S - 1) : 'K';
  
  return dv === expectedDv;
}

/**
 * Componente frontend de checkout para pagos mediante transferencia Khipu.
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.items - Listado de productos en el carrito.
 * @param {number} props.total - El total de la compra en CLP.
 * @param {Function} [props.onError] - Callback en caso de error.
 * @returns {React.JSX.Element} Elemento React renderizado.
 */
const KhipuCheckout = ({ items, total, onError = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    RUT: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  /**
   * Maneja el cambio de valores de los inputs del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'RUT') {
      newValue = formatRUT(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error asociado al cambiar el valor
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Realiza la validación de los datos del formulario de compra.
   * @returns {boolean} True si los datos son correctos.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del correo es inválido';
    }

    const cleanRUT = formData.RUT.replace(/[^0-9kK]/g, '');
    if (!formData.RUT) {
      newErrors.RUT = 'El RUT es requerido';
    } else if (cleanRUT.length < 8 || cleanRUT.length > 9) {
      newErrors.RUT = 'El largo del RUT es inválido';
    } else if (!validateRUT(formData.RUT)) {
      newErrors.RUT = 'El RUT ingresado es inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario de pago.
   * @param {React.FormEvent} e - Evento de envío de formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/khipu/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          RUT: formData.RUT,
          items: items.map(item => ({
            title: item.title || item.name,
            quantity: item.quantity,
            unit_price: item.unit_price || item.price
          }))
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al conectar con la pasarela de pagos');
      }

      if (result.paymentUrl) {
        console.log('Redireccionando a Khipu:', result.paymentUrl);
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('No se recibió la URL de pago desde Khipu');
      }
    } catch (err) {
      console.error('Error al iniciar pago con Khipu:', err);
      setServerError(err.message);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutCard}>
      <h5 className={styles.checkoutTitle}>Completa tus datos para donar</h5>
      
      <div className={styles.priceContainer}>
        <span className={styles.priceLabel}>Total a donar:</span>
        <span className={styles.priceVal}>${total.toLocaleString('es-CL')} CLP</span>
      </div>

      <div className={styles.badgeSecure}>
        <i className={`fas fa-shield-alt ${styles.badgeSecureIcon}`}></i>
        <div>
          <div className={styles.badgeSecureTitle}>Transferencia Bancaria Segura</div>
          <div className={styles.badgeSecureText}>
            Tu donación es procesada de forma 100% segura por Khipu mediante transferencia bancaria directa.
          </div>
        </div>
      </div>

      {serverError && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nombre Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
            placeholder="Ej: Juan Pérez Muñoz"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
            placeholder="Ej: juan.perez@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="RUT" className={styles.formLabel}>RUT</label>
          <input
            type="text"
            id="RUT"
            name="RUT"
            className={`${styles.formInput} ${errors.RUT ? styles.formInputError : ''}`}
            placeholder="Ej: 12.345.678-9"
            value={formData.RUT}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.RUT && <span className={styles.errorText}>{errors.RUT}</span>}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Conectando con Khipu...
            </>
          ) : (
            <>
              <i className="fas fa-university me-1"></i>
              Donar con Khipu (Transferencia)
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default KhipuCheckout;
