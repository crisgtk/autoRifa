"use client";
import React, { useState } from "react";

const QuantitySelector = ({ 
  initialValue = 1, 
  minValue = 1, 
  maxValue = 99, 
  onChange = () => {} 
}) => {
  const [quantity, setQuantity] = useState(initialValue);

  const handleIncrement = () => {
    if (quantity < maxValue) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > minValue) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  return (
    <div className="quantity-selector d-flex align-items-center">
      <button
        type="button"
        className="quantity-btn decrement-btn"
        onClick={handleDecrement}
        disabled={quantity <= minValue}
        style={{
          width: "40px",
          height: "40px",
          border: "1px solid #e9ecef",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#6c757d"
        }}
      >
        −
      </button>
      
      <div
        className="quantity-display"
        style={{
          width: "60px",
          height: "40px",
          border: "1px solid #e9ecef",
          borderLeft: "none",
          borderRight: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: "16px",
          fontWeight: "500"
        }}
      >
        {quantity}
      </div>
      
      <button
        type="button"
        className="quantity-btn increment-btn"
        onClick={handleIncrement}
        disabled={quantity >= maxValue}
        style={{
          width: "40px",
          height: "40px",
          border: "1px solid #e9ecef",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#6c757d"
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector; 