// backend/src/routes/locationRoutes.js
const express = require('express');
const { reverseGeocode } = require('../utils/geocode');
const router = express.Router();

// @route   GET /api/location/geocode
// @desc    Obtener nombre de ubicación a partir de coordenadas
// @access  Public (o Private si quieres protegerla con el middleware 'protect')
router.get('/geocode', async (req, res) => {
    const { lat, lon } = req.query; 

    if (!lat || !lon) {
        return res.status(400).json({ message: 'Se requieren latitud y longitud.' });
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
        return res.status(400).json({ message: 'Latitud o longitud inválida.' });
    }

    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        return res.status(400).json({ message: 'Coordenadas fuera de rango válido.' });
    }

    try {
        // --- ¡CAMBIO AQUÍ! ---
        // Antes: const locationName = await reverseGeocode(latNum, lonNum);
        // reverseGeocode ahora devuelve un objeto, así que lo desestructuramos:
        const { locationName, countryCode } = await reverseGeocode(latNum, lonNum);

        if (!locationName) {
            return res.status(404).json({ message: 'No se pudo determinar la ubicación.' });
        }
        
        // Antes: res.json({ locationName });
        // Ahora, tu frontend (el que revertimos) espera un objeto { locationName: "..." }
        // Así que nos aseguramos de enviar solo eso:
        res.json({ locationName: locationName });

        // NOTA: countryCode se obtiene pero no se envía al frontend
        // porque tu frontend revertido ya no lo espera. Esto es correcto.

    } catch (error) {
        console.error('Error en el endpoint /geocode:', error.message);
        res.status(500).json({ message: 'Error del servidor al obtener el nombre de la ubicación.' });
    }
});

module.exports = router;