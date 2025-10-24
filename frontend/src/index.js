// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App'; // Importa el AppWrapper
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';
Bugsnag.start({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact(React)], // Pasa React al plugin
  appType: 'frontend', // Opcional, ayuda a clasificar en Bugsnag
  releaseStage: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});

// 3. Inicializa Bugsnag Performance (si quieres monitoreo de rendimiento)
BugsnagPerformance.start({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY, // Usa la misma API Key
  // Puedes añadir más opciones si lo necesitas
});

// 4. Obtiene el componente ErrorBoundary de Bugsnag
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     {/* 5. Envuelve tu componente principal (AppWrapper) con el ErrorBoundary */}
    <ErrorBoundary>
        <AppWrapper />
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();