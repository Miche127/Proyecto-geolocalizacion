// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const locationRoutes = require('./src/routes/locationRoutes'); 
const videoRoutes = require('./src/routes/videoRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes'); 


const dotenv = require('dotenv');

dotenv.config();

console.log('authRoutes importado:', authRoutes); 

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Middleware
app.use(express.json());
app.use('/api/users', userRoutes); 

// Conexión a la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube_geo';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado exitosamente a MongoDB.');
        mongoose.connection.on('error', err => console.error('Error de conexión a MongoDB:', err));
        mongoose.connection.on('disconnected', () => console.warn('MongoDB se ha desconectado. Intentando reconectar...'));
    })
    .catch(err => {
        console.error('ERROR al conectar a MongoDB:', err);
        process.exit(1);
    });

// --- Usar Rutas ---
app.use('/api/auth', authRoutes); 

app.use('/api/location', locationRoutes); 
app.use('/api/videos', videoRoutes); 

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de YouTube Geo en funcionamiento!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
