// frontend/src/components/AgePrompt.js
import React, { useState } from 'react';
import '../styles/AgePrompt.css'; // (opcional) estilos

const AgePrompt = ({ isOpen, onConfirm, onCancel, videoTitle }) => {
  const [birthYear, setBirthYear] = useState('');

  if (!isOpen) return null;

    const years = Array.from(
    { length: 2007 - 1900 + 1 },
    (_, i) => 1900 + i
  );

  const handleConfirm = () => {
    const year = parseInt(birthYear, 10);
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      alert('Introduce un año de nacimiento válido.');
      return;
    }
    const age = new Date().getFullYear() - year;
    const isAdult = age >= 18;
    onConfirm(isAdult);
  };

  return (
    <div className="age-overlay">
      <div className="age-panel">
        <h3>Verificación de edad</h3>
        <p>
          El video <strong>{videoTitle}</strong> está marcado como no apto
          para menores.
        </p>
        <p>Selecciona tu año de nacimiento para continuar:</p>

        <select
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="age-select"
        >
          <option value="">Selecciona año</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="age-actions">
          <button className="age-btn" onClick={handleConfirm}>
            Confirmar
          </button>
          <button className="age-btn cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
export default AgePrompt;
