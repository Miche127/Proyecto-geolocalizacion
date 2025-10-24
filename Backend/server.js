// backend/server.js

require('dotenv').config(); // Cargar variables de entorno al principio

// --- CÓDIGO DE BUGSNAG - INICIO ---
var Bugsnag = require('@bugsnag/js');
var BugsnagPluginExpress = require('@bugsnag/plugin-express'); // <<< Importación correcta del plugin

// 1. Inicializa Bugsnag al principio de tu archivo principal.
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY, // Asegúrate de que esta variable esté en Render
  plugins: [BugsnagPluginExpress], // <<< ¡CORREGIDO! PASA EL PLUGIN DIRECTAMENTE, SIN 'new'
  appType: 'backend', // Para identificar en Bugsnag que es tu backend
  releaseStage: process.env.NODE_ENV === 'production' ? 'production' : 'development', // 'production' en Render
  logger: { // Logger para depuración
      debug: (...args) => console.debug('[Bugsnag Debug]', ...args),
      info: (...args) => console.info('[Bugsnag Info]', ...args),
      warn: (...args) => console.warn('[Bugsnag Warn]', ...args),
      error: (...args) => console.error('[Bugsnag Error]', ...args),
  }
});

// 2. Obtiene el middleware de Bugsnag para Express.
var middleware = Bugsnag.getPlugin('express'); // Obtiene el middleware real
// --- CÓDIGO DE BUGSNAG - FIN ---

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Importación de Rutas ---
const locationRoutes = require('./src/routes/locationRoutes');
const videoRoutes = require('./src/routes/videoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE DE BUGSNAG - INICIO ---
// 3. Request handler de Bugsnag: DEBE ser el PRIMER middleware de Express.
//    Captura errores en middlewares y rutas que vienen después.
app.use(middleware.requestHandler);
// --- MIDDLEWARE DE BUGSNAG - FIN ---

// Otros Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube_geo';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado exitosamente a MongoDB.');
        mongoose.connection.on('error', err => {
            console.error('Error de conexión a MongoDB:', err);
            Bugsnag.notify(err, event => { // Notifica este error a Bugsnag
                event.addMetadata('database', { type: 'MongoDB Connection Error' });
            });
        });
        mongoose.connection.on('disconnected', () => console.warn('MongoDB se ha desconectado. Intentando reconectar...'));
    })
    .catch(err => {
        console.error('ERROR al conectar a MongoDB:', err);
        Bugsnag.notify(err, event => { // Notifica este error crítico a Bugsnag
            event.addMetadata('database', { type: 'MongoDB Initial Connection Failure' });
        });
        process.exit(1);
    });

// --- Uso de Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/videos', videoRoutes);

// Ruta de prueba (original)
app.get('/', (req, res) => {
    res.send('API de YouTube Geo en funcionamiento!');
});

// --- MIDDLEWARE DE BUGSNAG - INICIO ---
// 4. Error handler de Bugsnag: DEBE ser el ÚLTIMO middleware,
//    justo antes de tu app.listen o de cualquier otro manejador de errores final.
app.use(middleware.errorHandler);
// --- MIDDLEWARE DE BUGSNAG - FIN ---

// Manejador de errores final (por si acaso Bugsnag no lo captura o quieres un fallback)
app.use(function onError(err, req, res, next) {
    console.error("Error final capturado por middleware custom:", err.message);
    res.statusCode = 500;
    res.end("Ocurrió un error interno del servidor.\n");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});