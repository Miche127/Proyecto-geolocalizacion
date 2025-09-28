// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App'; // Importa el AppWrapper
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();