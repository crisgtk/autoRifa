"use client";
import Image from "next/image";
import React, { useState } from "react";

const Pricing = () => {
  const pricingPackages = [
    {
      packageTitle: "1 ticket",
      price: "$5.000",
      pricePerMonth: "",
      priceIcon: "../images/icon/pricing-icon-2.svg",
      features: [
        "1 muy buena oportunidad para participar en el sorteo",
        "Económico",
        "Muy fácil de comprar",
        "Muy fácil de participar",
        "Sorteo en Vivo",
        "Intranferible",
      ],
    },
    {
      packageTitle: "3 ticket",
      price: "$10.000",
      pricePerMonth: "",
      priceIcon: "../images/icon/pricing-icon-1.svg",
      uniqueClass: "unique-class", // Add a unique class for Professional package
      features: [
        "Triplica tus posibilidades de ganar el auto sorteado",
        "Mas oportunidades de ganar",
        "Muy facil de comprar",
        "Muy dacil de participar",
        "Sorteo en Vivo",
        "Intransferible",
      ],
    },
    {
      packageTitle: " 6 tickets",
      price: "$20.000",
      pricePerMonth: "",
      priceIcon: "../images/icon/pricing-icon-3.svg",
      features: [
        "Lanza 6 veces tus posibilidades de ganar el auto sorteado",
        "muchas mas oportunidades de ganar",
        "Muy facil de comprar",
        "Muy dacil de participar",
        "Sorteo en Vivo",
        "Intransferible",
      ],
    },
  ];

  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  const handleBillingToggle = () => {
    setIsYearlyBilling((prevIsYearlyBilling) => !prevIsYearlyBilling);
  };

  return (
    <>
      {/* <div className="row" data-aos="fade-up" data-aos-delay="200">
        <div className="col-lg-12">
          <div className="pricing_packages_top d-flex align-items-center justify-content-center mb60">
            <div className="toggle-btn">
              <span className="pricing_save1 ff-heading">Billed Monthly</span>
              <label className="switch">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={isYearlyBilling}
                  onChange={handleBillingToggle}
                />
                <span className="pricing_table_switch_slide round" />
              </label>
              <span className="pricing_save2 ff-heading">Billed Yearly</span>
              <span className="pricing_save3">Save 20%</span>
            </div>
          </div>
        </div>
      </div> */}
      {/* End .row */}

      <div className="row" data-aos="fade-up" data-aos-delay="300">
        {pricingPackages.map((item, index) => (
          <div className="col-md-6 col-xl-4" key={index}>
            <div className={`pricing_packages ${index === 1 ? "active" : ""}`}>
              <div className="heading mb60">
                <h4 className={`package_title ${item.uniqueClass || ""}`}>
                  {item.packageTitle}
                </h4>
                <h1 className="text2">
                  {isYearlyBilling
                    ? index === 0
                      ? "Free" // First object shows "Free"
                      : index === 1
                      ? "$599.99" // Second object shows "$599.95"
                      : "$999.99" // Third object shows "$999.95"
                    : item.price}
                </h1>
                <p className="text">{item.pricePerMonth}</p>
                <Image
                  width={70}
                  height={70}
                  className="price-icon"
                  src={item.priceIcon}
                  alt="icon"
                />
              </div>
              <div className="details">
                <p className="text mb35">
                  {item.features[0]} {/* Display the first feature */}
                </p>
                <div className="list-style1 mb40">
                  <ul>
                    {item.features.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <i className="far fa-check text-white bgc-dark fz15" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-grid">
                  <a href="/ticket" className="ud-btn btn-thm-border text-thm">
                    Compra tu ticket
                    <i className="fal fa-arrow-right-long" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* End .row */}
    </>
  );
};

export default Pricing;
