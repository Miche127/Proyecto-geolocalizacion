// backend/src/controllers/userController.js
const User = require('../models/user');

// @desc    Añadir un video al historial del usuario
// @route   POST /api/users/history
// @access  Private
exports.addVideoToHistory = async (req, res) => {
    const { videoId, title, thumbnail, channelTitle } = req.body;
    
    if (!videoId || !title || !thumbnail || !channelTitle) {
        return res.status(400).json({ message: 'Faltan datos del video para añadir al historial.' });
    }

    try {
        const user = req.user; // req.user viene del middleware de autenticación

        // Verificar si el video ya está en el historial para evitar duplicados recientes
        const existingEntryIndex = user.history.findIndex(
            (item) => item.videoId === videoId
        );

        if (existingEntryIndex !== -1) {
            // Si el video ya está, lo quitamos para moverlo al principio (más reciente)
            user.history.splice(existingEntryIndex, 1);
        }

        // Añadir el nuevo video al principio del historial
        user.history.unshift({
            videoId,
            title,
            thumbnail,
            channelTitle,
            watchedAt: new Date(),
        });

        // Limitar el historial a un número razonable de videos (ej. los últimos 50)
        if (user.history.length > 50) {
            user.history.pop(); // Elimina el video más antiguo
        }

        await user.save();
        res.status(200).json({ message: 'Video añadido al historial.', history: user.history });

    } catch (error) {
        console.error('Error al añadir video al historial:', error);
        res.status(500).json({ message: 'Error del servidor al añadir video al historial.' });
    }
};

// @desc    Obtener el historial de videos del usuario
// @route   GET /api/users/history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('history');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        // El historial ya está ordenado por watchedAt descendente gracias a unshift
        res.status(200).json(user.history);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ message: 'Error del servidor al obtener historial.' });
    }
};