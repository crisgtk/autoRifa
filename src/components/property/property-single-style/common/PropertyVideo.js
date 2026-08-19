"use client";
import React, { useState } from "react";
import listings from "@/data/listings";

/**
 * @typedef {Object} PropertyVideoProps
 * @property {number|string} [id] - El ID de la propiedad/auto para obtener la imagen de vista previa.
 */

/**
 * Componente PropertyVideo
 * Muestra el banner con el botón de reproducción del video del auto,
 * usando la imagen del auto como fondo dinámico en lugar de un marcador de posición estático.
 * 
 * @component
 * @param {PropertyVideoProps} props - Propiedades del componente.
 * @returns {React.JSX.Element} El componente de video renderizado.
 */
const PropertyVideo = ({ id }) => {
  const [isOpen, setOpen] = useState(false);

  const data = listings.find((elm) => elm.id == id) || listings[0];
  const videoPreviewImage = data?.image || "/images/car/ssangyong_tivoli/tivoli_1.jpg";

  return (
    <>
      {isOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 99999 }}
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 mt-2"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-3">
                <div className="ratio ratio-16x9 bdrs12 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/file/d/14TuiqUmtNZdJQ3QjwzCjT0FRCJTPOK5H/preview"
                    title="Video del Auto"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: 0, width: "100%", height: "100%" }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="col-md-12">
        <div 
          className="property_video bdrs12 w-100"
          style={{ backgroundImage: `url(${videoPreviewImage})` }}
        >
          <button
            className="video_popup_btn mx-auto popup-img"
            onClick={() => setOpen(true)}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <span className="flaticon-play" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertyVideo;
