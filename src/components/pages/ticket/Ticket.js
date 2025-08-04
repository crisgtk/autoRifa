"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuantitySelector from "./QuantitySelector";
import MercadoPagoCheckout from "./MercadoPagoCheckout";

const propertyData = [
  {
    id: 1,
    title: "STICKET",
    imageSrc: "/images/car/mini_cooper/mini_cooper_1.jpeg",
    location: "sorteo el dd/mm/yyyy",
    price: 5000, // Precio en pesos
  }
];



const Ticket = () => {
  const searchParams = useSearchParams();
  
  // Estado para manejar las cantidades de cada producto
  const [quantities, setQuantities] = useState(
    propertyData.reduce((acc, item) => {
      acc[item.id] = 1; // Cantidad inicial de 1 para cada producto
      return acc;
    }, {})
  );

  // Effect para leer parámetros de URL y establecer cantidad inicial
  useEffect(() => {
    console.log('🔍 Checking URL params...');
    const quantityParam = searchParams.get('quantity');
    console.log('📊 Quantity param from URL:', quantityParam);
    
    if (quantityParam) {
      const initialQuantity = parseInt(quantityParam, 10);
      console.log('🔢 Parsed quantity:', initialQuantity);
      
      if (initialQuantity > 0 && initialQuantity <= 10) {
        console.log('✅ Setting quantity to:', initialQuantity);
        setQuantities(prev => {
          const newQuantities = {
            ...prev,
            [propertyData[0].id]: initialQuantity
          };
          console.log('📦 New quantities state:', newQuantities);
          return newQuantities;
        });
      } else {
        console.log('❌ Quantity out of range:', initialQuantity);
      }
    } else {
      console.log('⚠️ No quantity parameter found in URL');
    }
  }, [searchParams]);

  // Función para formatear precios en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para calcular precio con promoción (múltiplos de 3)
  const calculatePromotionalPrice = (quantity, basePrice) => {
    const groupsOfThree = Math.floor(quantity / 3);
    const remainingTickets = quantity % 3;
    
    // Precio por grupo de 3: 10000, precio individual: 5000
    const promotionalPrice = (groupsOfThree * 10000) + (remainingTickets * basePrice);
    
    return promotionalPrice;
  };

  // Función para calcular precio unitario efectivo
  const calculateEffectiveUnitPrice = (quantity, basePrice) => {
    const totalPrice = calculatePromotionalPrice(quantity, basePrice);
    const unitPrice = totalPrice / quantity;
    
    // Si hay promoción (múltiplos de 3), redondear a centenas hacia abajo
    if (quantity >= 3 && Math.floor(quantity / 3) > 0) {
      return Math.floor(unitPrice / 100) * 100;
    }
    
    return unitPrice;
  };

  // Función para manejar cambios en cantidad
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Calcular total del carrito
  const calculateTotal = () => {
    return propertyData.reduce((total, product) => {
      return total + calculatePromotionalPrice(quantities[product.id], product.price);
    }, 0);
  };

  return (
    <>
     {/* Información de la promoción */}
     <div className="row mb-4">
       <div className="col-12">
         <div className="alert alert-info border-0" style={{backgroundColor: '#e7f3ff'}}>
           <div className="d-flex align-items-center">
             <i className="fas fa-info-circle text-primary me-3" style={{fontSize: '24px'}}></i>
             <div>
               <h6 className="mb-1 text-primary">¡Oferta Especial!</h6>
               <p className="mb-0">
                 <strong>Promoción múltiplos de 3:</strong> Por cada 3 tickets paga solo $10.000 
                 (en lugar de $15.000) • 6 tickets = $20.000 • 9 tickets = $30.000
               </p>
             </div>
           </div>
         </div>
       </div>
     </div>

     <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Precio Unitario</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Subtotal</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {propertyData.map((property) => (
          <tr key={property.id}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-thumb">
                  <Image
                    width={110}
                    height={94}
                    className="w-100"
                    src={property.imageSrc}
                    alt="property"
                  />
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/single-v1/${property.id}`}>{property.title}</Link>
                  </div>
                  <p className="list-text mb-0">{property.location}</p>
                </div>
              </div>
            </th>
                         <td className="vam">
               <div>
                 <span className="fw-semibold">
                   {formatPrice(calculateEffectiveUnitPrice(quantities[property.id], property.price))}
                 </span>
                 {quantities[property.id] >= 3 && quantities[property.id] % 3 === 0 && (
                   <div className="small text-success mt-1">
                     <i className="fas fa-tag me-1"></i>
                     ¡Promoción aplicada!
                   </div>
                 )}
                 {quantities[property.id] < 3 && (
                   <div className="small text-muted mt-1">
                     Precio normal: {formatPrice(property.price)}
                   </div>
                 )}
               </div>
             </td>
             <td className="vam">
               <QuantitySelector
                 initialValue={quantities[property.id]}
                 minValue={1}
                 maxValue={10}
                 onChange={(quantity) => handleQuantityChange(property.id, quantity)}
               />
             </td>
             <td className="vam">
               <div>
                 <span className="fw-bold text-primary">
                   {formatPrice(calculatePromotionalPrice(quantities[property.id], property.price))}
                 </span>
                 {quantities[property.id] >= 3 && (
                   <div className="small text-success mt-1">
                     Ahorro: {formatPrice((property.price * quantities[property.id]) - calculatePromotionalPrice(quantities[property.id], property.price))}
                   </div>
                 )}
               </div>
             </td>
          </tr>
        ))}
      </tbody>
    </table>
    
         {/* Total del carrito */}
     <div className="row mt-4">
       <div className="col-lg-6 offset-lg-6">
         <div className="card">
           <div className="card-body">
             {(() => {
               const totalWithoutPromo = propertyData.reduce((total, product) => {
                 return total + (product.price * quantities[product.id]);
               }, 0);
               const totalWithPromo = calculateTotal();
               const totalSavings = totalWithoutPromo - totalWithPromo;
               
               return (
                 <>
                   {totalSavings > 0 && (
                     <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                       <span className="text-muted">Precio sin promoción:</span>
                       <span className="text-muted text-decoration-line-through">
                         {formatPrice(totalWithoutPromo)}
                       </span>
                     </div>
                   )}
                   {totalSavings > 0 && (
                     <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                       <span className="text-success fw-semibold">Tu ahorro:</span>
                       <span className="text-success fw-bold">
                         -{formatPrice(totalSavings)}
                       </span>
                     </div>
                   )}
                   <div className="d-flex justify-content-between align-items-center">
                     <h5 className="mb-0">Total a pagar:</h5>
                     <h4 className="mb-0 text-primary">{formatPrice(totalWithPromo)}</h4>
                   </div>
                                       <div className="mt-3">
                      <MercadoPagoCheckout
                        items={propertyData.map(product => ({
                          title: product.title,
                          quantity: quantities[product.id],
                          unit_price: calculateEffectiveUnitPrice(quantities[product.id], product.price)
                        }))}
                        total={totalWithPromo}
                        onSuccess={(data) => {
                          console.log('Pago exitoso:', data);
                          // Aquí puedes manejar el éxito del pago
                          // Por ejemplo, limpiar el carrito, guardar en BD, etc.
                        }}
                        onError={(error) => {
                          console.error('Error en el pago:', error);
                          // Manejar errores de pago
                        }}
                        onPending={(data) => {
                          console.log('Pago pendiente:', data);
                          // Manejar pagos pendientes
                        }}
                      />
                    </div>
                 </>
               );
             })()}
           </div>
         </div>
       </div>
     </div>
    </>
  );
};

export default Ticket;
