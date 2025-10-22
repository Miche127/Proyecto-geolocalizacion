// backend/src/utils/geocode.js
const axios = require('axios');

// OpenCage Data API
const OPENCAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

async function reverseGeocode(latitude, longitude) {
    try {
        // Obtener la clave API de las variables de entorno de Render
        const opencageApiKey = process.env.OPENCAGE_API_KEY; 

        // Verificar si la clave API está configurada
        if (!opencageApiKey) {
            console.error('Error: OPENCAGE_API_KEY no está definida en las variables de entorno de Render.');
            return { locationName: 'Mundo (API Key Faltante)', countryCode: 'mx' };
        }

        // Realizar la petición a la API de OpenCage Data
        const response = await axios.get(OPENCAGE_API_URL, {
            params: {
                q: `${latitude}+${longitude}`, // Formato de lat/lon para OpenCage
                key: opencageApiKey,           // Tu clave API
                language: 'es',                // Preferir resultados en español
                pretty: 1                      // Formato de respuesta legible
            },
            timeout: 10000 // Timeout de 10 segundos para la petición
        });

        const data = response.data;
        let locationName = 'Mundo';
        let countryCode = 'mx';

        // Procesar la respuesta de OpenCage
        if (data && data.results && data.results.length > 0) {
            const firstResult = data.results[0].components;
            const city = firstResult.city || firstResult.town || firstResult.village;
            const state = firstResult.state || firstResult.county;
            const country = firstResult.country;

            if (city) locationName = city;
            else if (state) locationName = state;
            else if (country) locationName = country;

            if (firstResult.country_code) {
                countryCode = firstResult.country_code.toLowerCase();
            }
        } else {
            // Si no hay resultados de geocodificación
            console.warn('OpenCage Data no encontró resultados para las coordenadas:', latitude, longitude);
        }

        return { locationName, countryCode };

    } catch (error) {
        console.error('Error al hacer geocodificación inversa DETALLADO (OpenCage):');
        console.error(error);
        // Imprimir la respuesta de error de la API si está disponible
        if (error.response) {
            console.error('Respuesta de error de OpenCage API:', error.response.data);
            console.error('Estado de error de OpenCage API:', error.response.status);
        }
        return { locationName: 'Mundo (Error API)', countryCode: 'mx' };
    }
}

module.exports = { reverseGeocode };