// frontend/src/components/AgePrompt.js
import React, { useState } from 'react';
import '../styles/AgePrompt.css'; // (opcional) estilos

const AgePrompt = ({ isOpen, onConfirm, onCancel, videoTitle }) => {
  const [birthYear, setBirthYear] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const year = parseInt(birthYear, 10);
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      alert('Introduce un año de nacimiento válido.');
      return;
    }
    const age = new Date().getFullYear() - year;
    onConfirm(age >= 18);
  };

  return (
    <div className="age-overlay">
      <div className="age-panel">
        <h3>Verificacion de edad</h3>
        <p>El video "<strong>{videoTitle}</strong>" está marcado como no apto para menores.</p>
        <p>Por favor, ingresa tu año de nacimiento para continuar.</p>
        <input
          type="number"
          placeholder="Ej. 1995"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        />
        <div className="age-actions">
          <button className="age-btn" onClick={handleConfirm}>Confirmar</button>
          <button className="age-btn cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AgePrompt;
