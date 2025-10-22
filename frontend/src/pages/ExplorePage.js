// frontend/src/pages/ExplorePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import MapComponent from '../components/MapComponent';
import '../styles/ExplorePage.css';
import '../styles/HomePage.css'; // Reutilizamos los estilos de la barra de búsqueda del HomePage
import { addVideoToUserHistory } from '../utils/history';
import LocationPermissionPanel from '../components/LocationPermissionPanel';
import AgePrompt from '../components/AgePrompt';
import VideoPlayer from '../components/VideoPlayer';
import API_BASE_URL from '../utils/api';

const API_URL = `${API_BASE_URL}/api`;

const ExplorePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const [showPermissionPanel, setShowPermissionPanel] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [agePromptOpen, setAgePromptOpen] = useState(false);
  const [pendingVideoToOpen, setPendingVideoToOpen] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');

  const debounceTimeoutRef = useRef(null);

  const fetchVideosForLocation = useCallback(async (lat, lng, term = 'videos') => {
    setLoading(true);
    setError('');
    try {
      const geoRes = await axios.get(`${API_URL}/location/geocode`, { params: { lat, lon: lng } });
      const fetchedLocationName = geoRes.data.locationName;

      setLocationName(fetchedLocationName);
      
      const videoRes = await axios.get(`${API_URL}/videos/search`, {
        params: {
          searchTerm: term,
          location: fetchedLocationName,
          maxResults: 15
        },
      });
      setVideos(videoRes.data || []);
    } catch (err) {
      console.error('Error al cargar videos:', err);
      setError('No se pudieron cargar los videos para esta ubicación.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);


  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      const { latitude, longitude } = JSON.parse(saved);
      setShowPermissionPanel(false);
      setMapCenter({ lat: latitude, lng: longitude });
      fetchVideosForLocation(latitude, longitude); 
    } else {
      setShowPermissionPanel(true);
    }
  }, [fetchVideosForLocation]);

  const handlePermissionAccept = ({ latitude, longitude }) => {
    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
    setShowPermissionPanel(false);
    setMapCenter({ lat: latitude, lng: longitude });
    fetchVideosForLocation(latitude, longitude);
  };

  const handlePermissionDeny = () => {
    setShowPermissionPanel(false);
    const lat = 19.4326,
      lng = -99.1332;
    setMapCenter({ lat, lng });
    fetchVideosForLocation(lat, lng);
  };

  const handleOpenVideo = (video) => {
    if (video.ageRestricted) {
      setPendingVideoToOpen(video);
      setAgePromptOpen(true);
      return;
    }
    addVideoToUserHistory(video);
    setSelectedVideoId(video.id);
  };

  const handleAgeConfirm = (isAdult) => {
    setAgePromptOpen(false);
    if (isAdult && pendingVideoToOpen) {
      addVideoToUserHistory(pendingVideoToOpen);
      setSelectedVideoId(pendingVideoToOpen.id);
    } else {
      alert('No puedes ver este video si no eres mayor de edad.');
    }
    setPendingVideoToOpen(null);
  };

  const handleAgeCancel = () => setAgePromptOpen(false);

  const handleMapDoubleClick = (newCenter) => {
    setMapCenter(newCenter);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchVideosForLocation(newCenter.lat, newCenter.lng, searchQuery || 'videos');
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (!mapCenter) return; 

    clearTimeout(debounceTimeoutRef.current);

    fetchVideosForLocation(mapCenter.lat, mapCenter.lng, searchQuery || 'videos');
  };

  const handleClosePlayer = () => setSelectedVideoId(null);

  return (
    <div className="explore-container">
      {showPermissionPanel && (
        <LocationPermissionPanel
          isOpen={showPermissionPanel}
          onAccept={handlePermissionAccept}
          onDeny={handlePermissionDeny}
        />
      )}

      <AgePrompt
        isOpen={agePromptOpen}
        onConfirm={handleAgeConfirm}
        onCancel={handleAgeCancel}
        videoTitle={pendingVideoToOpen ? pendingVideoToOpen.title : ''}
      />

      <VideoPlayer videoId={selectedVideoId} onClose={handleClosePlayer} />

      <div className="map-section" style={{ height: '60vh' }}>
        <MapComponent center={mapCenter} onMapDoubleClick={handleMapDoubleClick} />
      </div>

      <div className="videos-section">
        <div className="search-bar-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar videos en esta área del mapa..."
                    value={searchQuery}
                    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
                    // Se quitó la 'g' extra de e.g.target.value
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                    <FaSearch />
                </button>
            </form>
        </div>

        <h2>
          Explorando videos en: <span className="location-highlight">{locationName}</span>
        </h2>
        
        {loading && <p>Actualizando videos...</p>}
        {error && !loading && <p className="error-message">{error}</p>}

        <div className="videos-list">
          {!loading && videos.map((video) => (
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
