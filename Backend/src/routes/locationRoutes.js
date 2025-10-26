// backend/src/routes/locationRoutes.js
const express = require('express');
const { reverseGeocode } = require('../utils/geocode');
const router = express.Router();

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
        // Ahora reverseGeocode devuelve un string (texto)
        const locationName = await reverseGeocode(latNum, lonNum);

        if (!locationName) {
            return res.status(404).json({ message: 'No se pudo determinar la ubicación.' });
        }
        
        // Y lo enviamos al frontend de la forma que espera
        res.json({ locationName: locationName });

    } catch (error) {
        console.error('Error en el endpoint /geocode:', error.message);
        res.status(500).json({ message: 'Error del servidor al obtener el nombre de la ubicación.' });
    }
});

module.exports = router;