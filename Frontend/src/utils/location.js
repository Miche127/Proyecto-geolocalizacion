// frontend/src/utils/location.js

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('La geolocalización no está disponible en este navegador.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let errorMessage = 'Error al obtener la ubicación: ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'El usuario denegó el permiso de geolocalización.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'La información de ubicación no está disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Se agotó el tiempo de espera para obtener la ubicación.';
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage += 'Ocurrió un error desconocido.';
                        break;
                    default:
                        errorMessage += error.message;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true, // Solicitar mayor precisión
                timeout: 10000,         // Tiempo máximo para la respuesta (10 segundos)
                maximumAge: 0           // No usar una posición en caché, solicitar una nueva
            }
        );
    });
};