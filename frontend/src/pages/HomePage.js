// frontend/src/pages/HomePage.js
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/HomePage.css';
import { addVideoToUserHistory } from '../utils/history';
import AgePrompt from '../components/AgePrompt';
import LocationPermissionPanel from '../components/LocationPermissionPanel';
import API_BASE_URL from '../utils/api';

import VideoPlayer from "../components/VideoPlayer";

const API_URL = `${API_BASE_URL}/api`;

const HomePage = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [agePromptOpen, setAgePromptOpen] = useState(false);
  const [pendingVideoToOpen, setPendingVideoToOpen] = useState(null);
  const [showPermissionPanel, setShowPermissionPanel] = useState(true);

  const [selectedVideoId, setSelectedVideoId] = useState(null); 


  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const { latitude, longitude } = JSON.parse(savedLocation);
      setShowPermissionPanel(false);
      fetchVideosByLocation(latitude, longitude);
    } else {
      setShowPermissionPanel(true);
    }
  }, []);


  // Si acepta ubicación
  const handlePermissionAccept = async ({ latitude, longitude }) => {
    setShowPermissionPanel(false);
    await fetchVideosByLocation(latitude, longitude);
  };

  // Si niega → fallback a CDMX
  const handlePermissionDeny = async () => {
    setShowPermissionPanel(false);
    await fetchVideosByLocation(19.4326, -99.1332); // CDMX coords
  };

  // Obtiene videos según lat/lon
  const fetchVideosByLocation = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const geoRes = await axios.get(`${API_URL}/location/geocode`, { params: { lat, lon } });
      const fetchedLocationName = geoRes.data.locationName;
      setLocationName(fetchedLocationName);

      const videoRes = await axios.get(`${API_URL}/videos/search`, {
        params: {
          searchTerm: 'videos populares',
          location: fetchedLocationName,
          maxResults: 20
        }
      });

      setVideos(videoRes.data);
    } catch (err) {
      console.error('Error al cargar videos:', err);
      setError('No se pudieron cargar los videos. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Abrir video con verificación de edad si es necesario
  const openVideoLink = (video) => {
    if (video.ageRestricted) {
      setPendingVideoToOpen(video);
      setAgePromptOpen(true);
      return;
    }
    addVideoToUserHistory(video);
    setSelectedVideoId(video.id); // Abre el reproductor interno
  };

  const handleAgeConfirm = (isAdult) => {
    setAgePromptOpen(false);
    if (isAdult && pendingVideoToOpen) {
      addVideoToUserHistory(pendingVideoToOpen);
      setSelectedVideoId(pendingVideoToOpen.id); // Abre video dentro de GeoTube
    } else {
      alert('No puedes ver este video si no eres mayor de edad.');
    }
    setPendingVideoToOpen(null);
  };

  const handleAgeCancel = () => {
    setAgePromptOpen(false);
  };

  const handleClosePlayer = () => {
    setSelectedVideoId(null);
  };

  // Buscar manualmente
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const searchResult = await axios.get(`${API_URL}/videos/search`, {
        params: { searchTerm: searchQuery, location: locationName, maxResults: 20 }
      });
      setVideos(searchResult.data);
    } catch (err) {
      console.error('Error al buscar videos:', err);
      setError('No se encontraron videos para tu búsqueda.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      {/* Panel para pedir ubicación al entrar */}
      <LocationPermissionPanel
        isOpen={showPermissionPanel}
        onAccept={handlePermissionAccept}
        onDeny={handlePermissionDeny}
      />

      {/* Modal para edad */}
      <AgePrompt
        isOpen={agePromptOpen}
        onConfirm={handleAgeConfirm}
        onCancel={handleAgeCancel}
        videoTitle={pendingVideoToOpen ? pendingVideoToOpen.title : ''}
      />

      <VideoPlayer videoId={selectedVideoId} onClose={handleClosePlayer} />

      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Busca videos en tu área..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button"><FaSearch /></button>
        </form>
      </div>

      <h2 className="section-title">
        Recomendaciones según tu ubicación: <FaMapMarkedAlt className="location-title-icon" />{' '}
        <span className="location-highlight">{locationName}</span>
      </h2>

      {loading && <p className="loading-message">Cargando videos...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="video-grid">
        {videos.map(video => (
          <button key={video.id} className="video-card-link" onClick={() => openVideoLink(video)}>
            <div className="video-card">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <h3 className="video-title">{video.title}</h3>
              <p className="video-channel">
                {video.channelTitle} {video.ageRestricted && <span className="age-badge">+18</span>}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
