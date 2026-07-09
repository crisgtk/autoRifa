import React from "react";
import Image from "next/image";
import styles from "./QuienesSomos.module.scss";

/**
 * QuienesSomos Component
 * Renders the "Quiénes somos" section containing information about the
 * "Corporación de discapacitados vulnerados del beneficio ley 20422".
 * 
 * @component
 * @returns {React.ReactElement} The QuienesSomos section component.
 */
const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className={styles.quienesSomosSection}>
      <div className="container">
        <div className="row align-items-stretch">
          {/* Card Left */}
          <div className="col-lg-5" data-aos="fade-right" data-aos-delay="100">
            <div className={styles.cardContainer}>
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <i className="fal fa-hand-holding-heart" />
                </div>
                <span className={styles.cardBadge}>Iniciativa Solidaria</span>
                <h3 className={styles.cardTitle}>Rifa Benéfica AutoImporta</h3>
                <p className={styles.cardDesc}>
                  A beneficio de la Corporación de Discapacitados Vulnerados por la Ley 20.422.
                </p>
                <div className={styles.logoContainer}>
                  <Image
                    width={320}
                    height={175}
                    src="/images/logo/logo-corporacion.jpeg"
                    alt="Logo Corporación de Discapacitados"
                    className={styles.corpLogo}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Right */}
          <div className="col-lg-7" data-aos="fade-left" data-aos-delay="200">
            <div className={styles.contentWrapper}>
              <span className={styles.preTitle}>
                Corporación de discapacitados vulnerados del beneficio ley 20422
              </span>
              <h2 className={styles.mainTitle}>Quiénes somos</h2>
              
              <div className={styles.featureBox}>
                <div className={styles.featureIcon}>
                  <i className="fal fa-scale-balanced" />
                </div>
                <p className={styles.featureText}>
                  Nacimos como respuesta a los vacíos legales e institucionales de la Ley 20.422, específicamente en el inciso que permite a las personas con discapacidad importar un vehículo (nuevo o usado) pagando solo el 50% del arancel aduanero.
                </p>
              </div>
              
              <div className={styles.featureBox}>
                <div className={styles.featureIcon}>
                  <i className="fal fa-shield-heart" />
                </div>
                <p className={styles.featureText}>
                  Representamos y defendemos a un grupo de personas cuyos derechos e inclusión técnica han sido vulnerados, buscando visibilizar su situación y generar soluciones concretas a través de esta iniciativa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienesSomos;
