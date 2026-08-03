"use client";
import { useState } from "react";

const VideoBox = () => {
  const [isOpen, setOpen] = useState(false);

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

      <div className="img-box-9 d-flex justify-content-center align-items-center">
        <button
          className="popup-iframe popup-youtube"
          role="button"
          onClick={() => setOpen(true)}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <i className="fas fa-circle-play mr15" />
        </button>
        <h6
          className="fz14 mb-0 text-white cursor-pointer"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        >
          Ver Video
        </h6>
      </div>
    </>
  );
};

export default VideoBox;
