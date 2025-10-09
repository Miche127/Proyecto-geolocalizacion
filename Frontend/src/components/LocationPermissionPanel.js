// frontend/src/components/LocationPermissionPanel.js
import React from 'react';
import '../styles/LocationPermissionPanel.css'; 

const LocationPermissionPanel = ({ isOpen, onAccept, onDeny }) => {
  if (!isOpen) return null;

  const handleAccept = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      onDeny();
      return;
    }

    navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      
      localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));

      onAccept({ latitude, longitude });
    },
    (err) => {
      console.error('Error al obtener ubicación:', err);
      onDeny();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

  return (
    <div className="lp-overlay">
      <div className="lp-panel">
        <h2>Informacion sobre tu ubicacion</h2>
        <p>
          Para ayudarte a descubrir contenido local,
          GeoTube solicitara tu ubicacion.
          Tu privacidad es importante; tu ubicacion
          solo se usara para este fin y no se compartira.
        </p>
        <div className="lp-actions">
          <button className="lp-btn lp-accept" onClick={handleAccept}>Permitir</button>
          <button className="lp-btn lp-deny" onClick={onDeny}>Ahora no</button>
        </div>
        <small className="lp-note"></small>
      </div>
    </div>
  );
};

export default LocationPermissionPanel;
