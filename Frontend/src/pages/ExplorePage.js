// frontend/src/pages/ExplorePage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import '../styles/ExplorePage.css';
import { addVideoToUserHistory } from '../utils/history';
import LocationPermissionPanel from '../components/LocationPermissionPanel';
import AgePrompt from '../components/AgePrompt';
import VideoPlayer from '../components/VideoPlayer';

const API_URL = 'http://localhost:5000/api';

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

  const fetchVideosForLocation = useCallback(async (lat, lng) => {
    setLoading(true);
    setError('');
    try {
      const geoRes = await axios.get(`${API_URL}/location/geocode`, { params: { lat, lon: lng } });
      const fetchedLocationName = geoRes.data.locationName;
      setLocationName(fetchedLocationName);

      const videoRes = await axios.get(`${API_URL}/videos/search`, {
        params: { searchTerm: 'videos', location: fetchedLocationName, maxResults: 15 },
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

  const handleMapMove = (newCenter) => {
    setMapCenter(newCenter);
    fetchVideosForLocation(newCenter.lat, newCenter.lng);
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
        <MapComponent center={mapCenter} onMapMove={handleMapMove} />
      </div>

      <div className="videos-section">
        <h2>
          Explorando videos en: <span className="location-highlight">{locationName}</span>
        </h2>
        {loading && <p>Actualizando videos...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="videos-list">
          {videos.map((video) => (
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

