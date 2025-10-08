import React from "react";
import "../styles/VideoPlayer.css";

const VideoPlayer = ({ videoId, onClose }) => {
  if (!videoId) return null;

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <button className="close-btn" onClick={onClose}>✕</button>
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Reproductor de video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
