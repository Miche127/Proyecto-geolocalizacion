// backend/src/utils/geocode.js
const axios = require('axios');

// Nominatim API de OpenStreetMap (no requiere clave API para uso básico, pero respeta sus límites)
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
                addressdetails: 1 // Incluir detalles de la dirección
            },
            headers: {
                // Es buena práctica incluir un User-Agent
                'User-Agent': 'GeoTubeApp/1.0 (tu-email@example.com)' 
            }
        });

        const data = response.data;

        if (data && data.address) {
            // Intentar obtener el nombre de la ciudad o una región relevante
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state || data.address.county;
            const country = data.address.country;

            if (city) return city;
            if (state) return state;
            if (country) return country;
        }
        
        // Si no se encuentra un nombre específico, devolver un término genérico o el display_name completo
        return data.display_name || 'Mundo';

    } catch (error) {
        console.error('Error al hacer geocodificación inversa:', error.message);
        // Si hay un error, devolvemos un término de búsqueda genérico
        return 'Mundo'; 
    }
}

module.exports = { reverseGeocode };