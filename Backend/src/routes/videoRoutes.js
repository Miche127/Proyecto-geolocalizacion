// backend/src/routes/videoRoutes.js
const express = require('express');
const { searchYoutubeVideos } = require('../utils/youtube');

const router = express.Router();

router.get('/search', async (req, res) => {
    // --- CAMBIO AQUÍ ---
    // Recibimos searchTerm y location por separado
    const { searchTerm, location, maxResults } = req.query;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Se requiere un término de búsqueda.' });
    }

    try {
        const videos = await searchYoutubeVideos(searchTerm, location, maxResults ? parseInt(maxResults) : 10);
        res.json(videos);
    } catch (error) {
        console.error('Error en el endpoint /videos/search:', error.message);
        res.status(500).json({ message: 'Error del servidor al buscar videos.' });
    }
});


module.exports = router;