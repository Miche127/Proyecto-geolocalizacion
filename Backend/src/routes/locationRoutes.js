// backend/src/routes/locationRoutes.js
const express = require('express');
const { reverseGeocode } = require('../utils/geocode'); 
const router = express.Router();

// @route   GET /api/location/geocode
// @desc    Obtener nombre de ubicación a partir de coordenadas
// @access  Public (o Private si quieres protegerla con el middleware 'protect')
router.get('/geocode', async (req, res) => {
    const { lat, lon } = req.query; // Esperamos lat y lon como parámetros de consulta

    if (!lat || !lon) {
        return res.status(400).json({ message: 'Se requieren latitud y longitud.' });
    }

    try {
        const locationName = await reverseGeocode(parseFloat(lat), parseFloat(lon));
        res.json({ locationName });
    } catch (error) {
        console.error('Error en el endpoint /geocode:', error.message);
        res.status(500).json({ message: 'Error del servidor al obtener el nombre de la ubicación.' });
    }
});

module.exports = router;