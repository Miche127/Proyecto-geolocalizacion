// backend/models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    videoUrl: { // URL del video (ej. de YouTube embed, Vimeo, etc.)
        type: String,
        required: true
    },
    thumbnailUrl: { // URL de la miniatura del video
        type: String
    },
    uploader: { // Referencia al usuario (aunque no subamos, cada video "pertenece" a alguien)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    // Campo para la geolocalización por país (más sencillo para tu requerimiento actual)
    country: {
        type: String,
        required: true,
        trim: true
    },
    // Opcional: Campo para geolocalización por coordenadas si quieres más granularidad
    // location: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         default: 'Point'
    //     },
    //     coordinates: { // [longitud, latitud]
    //         type: [Number],
    //         index: '2dsphere' // Para búsquedas geoespaciales eficientes
    //     }
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', videoSchema);