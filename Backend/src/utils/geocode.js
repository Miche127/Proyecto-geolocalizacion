// backend/src/utils/geocode.js
const axios = require('axios');
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

async function reverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                zoom: 10,
                addressdetails: 1,
                'accept-language': 'es' // Pide nombres en español
            },
            headers: {
                'User-Agent': 'GeoTubeApp/1.0 (tu-email@example.com)' 
            }
        });

        const data = response.data;
        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state || data.address.county;
            const country = data.address.country;

            if (city) return city;
            if (state) return state;
            if (country) return country;
        }
        return 'Mundo';

    } catch (error) {
        console.error('Error al hacer geocodificación inversa:', error.message);
        return 'Mundo'; 
    }
}

module.exports = { reverseGeocode };