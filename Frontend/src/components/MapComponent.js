// frontend/src/components/MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importamos L para el icono personalizado

// Arreglo para un problema común con los iconos de marcador en react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


// Componente interno para manejar los eventos del mapa
function MapEvents({ onMapMove }) {
    useMapEvents({
        // Se activa cuando el usuario termina de arrastrar el mapa
        dragend: (e) => {
            const newCenter = e.target.getCenter();
            onMapMove(newCenter);
        },
    });
    return null; // Este componente no renderiza nada visualmente
}

const MapComponent = ({ center, onMapMove }) => {
    if (!center || !center.lat || !center.lng) {
        return <div>Cargando mapa...</div>;
    }

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marcador que siempre estará en el centro del mapa */}
            <Marker position={[center.lat, center.lng]} />
            <MapEvents onMapMove={onMapMove} />
        </MapContainer>
    );
};

export default MapComponent;