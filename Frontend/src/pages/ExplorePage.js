// frontend/src/pages/ExplorePage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';
import MapComponent from '../components/MapComponent';
import '../styles/ExplorePage.css';
import { addVideoToUserHistory } from '../utils/history';
import LocationPermissionPanel from '../components/LocationPermissionPanel';
import AgePrompt from '../components/AgePrompt';

const API_URL = 'http://localhost:5000/api';

const ExplorePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('tu ubicación');
  const [mapCenter, setMapCenter] = useState(null);
  const [showPermissionPanel, setShowPermissionPanel] = useState(true);
  const [preferredKeyword, setPreferredKeyword] = useState('');
  const [agePromptOpen, setAgePromptOpen] = useState(false);
  const [pendingVideoToOpen, setPendingVideoToOpen] = useState(null);

  // derivePreferredFromHistory: obtiene historial y calcula palabra clave más frecuente simple
  const derivePreferredFromHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const res = await axios.get(`${API_URL}/users/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const history = res.data || [];
      // Extraer palabras claves simples de títulos (tokenizar, filtrar stopwords)
      const stopwords = new Set(['de','el','la','los','las','un','una','y','en','con','para','por','a','del','video','videos']);
      const counts = {};
      history.forEach(h => {
        const title = (h.title || '').toLowerCase();
        const words = title.replace(/[^a-zñáéíóú0-9\s]/g,'').split(/\s+/);
        words.forEach(w => {
          if (!w || w.length < 3) return;
          if (stopwords.has(w)) return;
          counts[w] = (counts[w] || 0) + 1;
        });
      });
      let best = '';
      let bestCount = 0;
      Object.entries(counts).forEach(([k,v]) => {
        if (v > bestCount) { best = k; bestCount = v; }
      });
      return best;
    } catch (err) {
      console.warn('No se pudo obtener historial para preferencias:', err);
      return '';
    }
  };

  const fetchVideosForLocation = useCallback(async (lat, lng, preferKeyword = '') => {
    setLoading(true);
    setError('');
    try {
      const geoRes = await axios.get(`${API_URL}/location/geocode`, { params: { lat, lon: lng } });
      const fetchedLocationName = geoRes.data.locationName;
      setLocationName(fetchedLocationName);

      // Construir searchTerm priorizando keyword de historial si existe
      const baseTerm = preferKeyword ? `${preferKeyword} videos` : 'videos';
      const searchTerm = `${baseTerm}`;

      const videoRes = await axios.get(`${API_URL}/videos/search`, {
        params: { searchTerm, location: fetchedLocationName, maxResults: 15 }
      });

      setVideos(videoRes.data || []);
    } catch (err) {
      console.error('Error al cargar videos por ubicación:', err);
      setError('No se pudieron cargar los videos para esta ubicación.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: show permission panel; but don't auto-call geolocation until user acepta
  useEffect(() => {
    const init = async () => {
      // Try to derive user preference early (if logged)
      const keyword = await derivePreferredFromHistory();
      setPreferredKeyword(keyword || '');
    };
    init();
  }, []);

  // Handler panel accept/deny
  const handlePermissionAccept = async ({ latitude, longitude }) => {
    setShowPermissionPanel(false);
    setMapCenter({ lat: latitude, lng: longitude });

    // si ya tenemos preferred keyword, úsala, si no deriva ahora
    let keyword = preferredKeyword;
    if (!keyword) {
      keyword = await derivePreferredFromHistory();
      setPreferredKeyword(keyword);
    }
    fetchVideosForLocation(latitude, longitude, keyword);
  };

  const handlePermissionDeny = () => {
    setShowPermissionPanel(false);
    // fallback centro a CdMx
    const lat = 19.4326, lng = -99.1332;
    setMapCenter({ lat, lng });
    fetchVideosForLocation(lat, lng, preferredKeyword);
  };

  // efecto que actualiza cuando se cambia mapCenter (por movimiento en mapa)
  useEffect(() => {
    if (!mapCenter) return;
    // cuando el mapa se mueve: derivar preferred keyword y fetch
    const doFetch = async () => {
      let keyword = preferredKeyword;
      if (!keyword) {
        keyword = await derivePreferredFromHistory();
        setPreferredKeyword(keyword);
      }
      fetchVideosForLocation(mapCenter.lat, mapCenter.lng, keyword);
    };
    doFetch();
  }, [mapCenter, fetchVideosForLocation, preferredKeyword]);

  // Manejo de click en video: si ageRestricted => abrir AgePrompt antes de abrir; si no => abrir
  const handleOpenVideo = (video) => {
    if (video.ageRestricted) {
      setPendingVideoToOpen(video);
      setAgePromptOpen(true);
      return;
    }
    addVideoToUserHistory(video);
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener noreferrer');
  };

  const handleAgeConfirm = (isAdult) => {
    setAgePromptOpen(false);
    if (isAdult && pendingVideoToOpen) {
      addVideoToUserHistory(pendingVideoToOpen);
      window.open(`https://www.youtube.com/watch?v=${pendingVideoToOpen.id}`, '_blank', 'noopener noreferrer');
    } else {
      alert('No puedes ver este video si no eres mayor de edad.');
    }
    setPendingVideoToOpen(null);
  };

  const handleAgeCancel = () => {
    setAgePromptOpen(false);
    setPendingVideoToOpen(null);
  };

  const handleMapMove = (newCenter) => {
    // newCenter es un objeto con lat & lng (leaflet LatLng)
    setMapCenter(newCenter);
  };

  return (
    <div className="explore-container">
      <LocationPermissionPanel
        isOpen={showPermissionPanel}
        onAccept={handlePermissionAccept}
        onDeny={handlePermissionDeny}
      />

      <AgePrompt
        isOpen={agePromptOpen}
        onConfirm={handleAgeConfirm}
        onCancel={handleAgeCancel}
        videoTitle={pendingVideoToOpen ? pendingVideoToOpen.title : ''}
      />

      <div className="map-section" style={{ height: '60vh' }}>
        <MapComponent center={mapCenter} onMapMove={handleMapMove} />
      </div>

      <div className="videos-section">
        <h2>Explorando videos en: <span className="location-highlight">{locationName}</span></h2>
        {loading && <p>Actualizando videos...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="videos-list">
          {videos.map(video => (
            <div key={video.id} className="video-item">
              <button className="video-link" onClick={() => handleOpenVideo(video)}>
                <img src={video.thumbnail} alt={video.title} className="video-thumbnail-small" />
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p className="video-channel">{video.channelTitle}</p>
                  {video.ageRestricted && <span className="age-badge">+18</span>}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
