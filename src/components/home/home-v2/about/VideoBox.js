"use client";
import { useState } from "react";
import ModalVideo from "react-modal-video";

const VideoBox = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="7wLACyToIhE"
        onClose={() => setOpen(false)}
      />

      <div className="img-box-9 d-flex justify-content-center align-items-center">
        <button
          className="popup-iframe popup-youtube"
          role="button"
          onClick={() => setOpen(true)}
        >
          <i className="fas fa-circle-play mr15" />
        </button>
        <h6 className="fz14 mb-0">Ver Video</h6>
      </div>
    </>
  );
};

export default VideoBox;
