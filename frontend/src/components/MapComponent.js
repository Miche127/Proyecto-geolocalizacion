// frontend/src/components/MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; 

// Arreglo para un problema común con los iconos de marcador en react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


// Componente interno para manejar los eventos del mapa
function MapEvents({ onMapDoubleClick }) {
    useMapEvents({
        // Se activa cuando el usuario hace doble clic en el mapa
        dblclick: (e) => {
            onMapDoubleClick(e.latlng);
        },
    });
    return null; // Este componente no renderiza nada visualmente
}

const MapComponent = ({ center, onMapDoubleClick }) => {
    
    // --- ¡CAMBIO PRINCIPAL AQUÍ! ---
    
    // 1. Pega aquí la clave que copiaste de MapTiler
    const MAPTILER_API_KEY = "BY1idWnLHXpB9ti0Mf9C"; 

    // 2. Esta es la nueva URL del mapa, pidiendo las etiquetas en español ("es")
    const mapUrl = `https://api.maptiler.com/maps/voyager/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}&language=es`;

    // 3. Esta es la atribución que MapTiler nos pide que mostremos
    const mapAttribution = '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


    if (!center || !center.lat || !center.lng) {
        return <div>Cargando mapa...</div>;
    }

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            
            {/* Usamos la nueva URL y la nueva atribución */}
            <TileLayer
                url={mapUrl}
                attribution={mapAttribution}
            />
            
            <Marker position={[center.lat, center.lng]} />
            <MapEvents onMapDoubleClick={onMapDoubleClick} />
        </MapContainer>
    );
};

export default MapComponent;