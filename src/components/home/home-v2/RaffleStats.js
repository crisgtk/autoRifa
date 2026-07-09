"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import styles from "./RaffleStats.module.scss";

/**
 * @typedef {Object} RaffleStatsData
 * @property {number} raffleNumber - El número identificador del sorteo.
 * @property {number} totalSold - Total de tickets vendidos (incluye físicos y online).
 * @property {number} ticketGoal - Meta de tickets a vender.
 * @property {string} raffleDate - Fecha programada del sorteo.
 */

/**
 * Componente RaffleStats
 * Muestra las estadísticas generales del sorteo actual, incluyendo número del sorteo,
 * cantidad de boletos vendidos y barra de progreso de la meta de ventas.
 * 
 * @component
 * @returns {React.JSX.Element} El componente de estadísticas renderizado.
 */
const RaffleStats = () => {
  /** @type {[RaffleStatsData, React.Dispatch<React.SetStateAction<RaffleStatsData>>]} */
  const [stats, setStats] = useState({
    raffleNumber: 1,
    totalSold: 0,
    ticketGoal: 1000,
    raffleDate: "Por confirmar",
  });
  
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Obtiene las estadísticas desde el endpoint de la API
     * @async
     * @function fetchStats
     * @returns {Promise<void>}
     */
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/tickets/stats");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats({
              raffleNumber: data.raffleNumber || 1,
              totalSold: data.totalSold || 0,
              ticketGoal: data.ticketGoal || 1000,
              raffleDate: data.raffleDate || "Por confirmar",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener estadísticas del sorteo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section id="estado-sorteo" className={styles.statsSection}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.sectionHeader} data-aos="fade-up">
              <span className={styles.badge}>Rendimiento del Sorteo</span>
              <h2 className={styles.title}>Estado del Sorteo en Vivo</h2>
              <p className={styles.subtitle}>
                Monitoreo en tiempo real del progreso de nuestra rifa benéfica.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid} data-aos="fade-up" data-aos-delay="100">
          {/* Card 1: Número de Sorteo */}
          <div className={styles.statCard}>
            <div className={styles.iconWrapper}>
              <i className="fal fa-trophy" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Sorteo Activo</span>
              <h3 className={styles.cardValue}>Sorteo N° {stats.raffleNumber}</h3>
            </div>
          </div>

          {/* Card 2: Boletos Comprados */}
          <div className={styles.statCard}>
            <div className={styles.iconWrapper}>
              <i className="fal fa-ticket" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Boletos Comprados</span>
              <h3 className={styles.cardValue}>
                {loading ? (
                  "..."
                ) : (
                  <CountUp 
                    end={stats.totalSold} 
                    duration={2.5} 
                    separator="." 
                  />
                )}
              </h3>
            </div>
          </div>

          {/* Card 3: Fecha del Sorteo */}
          <div className={styles.statCard}>
            <div className={styles.iconWrapper}>
              <i className="fal fa-calendar-alt" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Fecha de Sorteo</span>
              <h3 className={styles.cardValue}>{stats.raffleDate}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RaffleStats;
