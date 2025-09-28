// backend/controllers/videoController.js
const Video = require('../models/video'); // Importa el modelo de Video
const User = require('../models/user');   // Para obtener info del uploader si es necesario

// @desc    Subir un nuevo video
// @route   POST /api/videos
// @access  Private (requiere autenticación)
exports.uploadVideo = async (req, res) => {
    // Aquí asumimos que ya tienes la lógica para subir el archivo físico del video
    // a un servicio de almacenamiento (ej. AWS S3, Cloudinary) y obtener su URL.
    // Por ahora, solo guardaremos los metadatos.

    const { title, description, videoUrl, thumbnailUrl, country } = req.body;
    // req.user._id vendrá del middleware de autenticación que crearemos después
    const uploaderId = req.user._id; 

    if (!title || !videoUrl || !country) {
        return res.status(400).json({ message: 'Por favor, introduce el título, la URL del video y el país.' });
    }

    try {
        const video = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl: thumbnailUrl || 'default_thumbnail.jpg', // Un thumbnail por defecto
            uploader: uploaderId,
            country // Usamos el país que el usuario indicó o que obtuvimos del frontend
            // Si usas GeoJSON, también necesitarías location: { type: 'Point', coordinates: [long, lat] }
        });

        const createdVideo = await video.save();
        res.status(201).json(createdVideo);
    } catch (error) {
        console.error('Error al subir video:', error);
        res.status(500).json({ message: 'Error del servidor al subir video.' });
    }
};

// @desc    Obtener un video por ID
// @route   GET /api/videos/:id
// @access  Public
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('uploader', 'username'); // Incluye nombre de usuario
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener video por ID:', error);
        res.status(500).json({ message: 'Error del servidor al obtener video.' });
    }
};

// (Más adelante, aquí irán los controladores para 'home videos' y 'search videos')