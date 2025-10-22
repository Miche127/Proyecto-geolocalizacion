// backend/src/utils/geocode.js
const axios = require('axios');

// Nominatim API de OpenStreetMap
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// Función para obtener el nombre de una ubicación a partir de latitud y longitud
async function reverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                zoom: 10, // Nivel de detalle (10 para ciudad/estado)
                addressdetails: 1, // Incluir detalles de la dirección
                // --- ¡CAMBIO AQUÍ! ---
                // Le pedimos a la API que prefiera los nombres en español
                'accept-language': 'es'
            },
            headers: {
                'User-Agent': 'GeoTubeApp/1.0 (tu-email@example.com)' 
            }
        });

        const data = response.data;
        let locationName = 'Mundo';
        let countryCode = 'MX'; // Código por defecto

        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state || data.address.county;
            const country = data.address.country;

            if (city) locationName = city;
            else if (state) locationName = state;
            else if (country) locationName = country;

            if (data.address.country_code) {
                countryCode = data.address.country_code.toLowerCase();
            }
        }
        
        return { locationName, countryCode };

    } catch (error) {
        console.error('Error al hacer geocodificación inversa:', error.message);
        return { locationName: 'Mundo', countryCode: 'mx' }; 
    }
}

module.exports = { reverseGeocode };