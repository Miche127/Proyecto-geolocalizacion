// frontend/src/pages/LibraryPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addVideoToUserHistory } from '../utils/history';
import '../styles/LibraryPage.css';
import VideoPlayer from '../components/VideoPlayer';
import API_BASE_URL from '../utils/api';

const API_URL = `${API_BASE_URL}/api`;

const LibraryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Debes iniciar sesión para ver tu historial.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/users/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data);
      } catch (err) {
        console.error(
          'Error al cargar el historial:',
          err.response ? err.response.data : err.message
        );
        setError('No se pudo cargar el historial. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Cuando se hace clic en un video del historial, lo agrega y abre el reproductor
  const handleVideoClick = (video) => {
    addVideoToUserHistory(video);
    setSelectedVideoId(video.videoId); // Usa video.videoId
  };

  const handleClosePlayer = () => setSelectedVideoId(null);

  const formatWatchedAt = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="library-container">
      <h2>Mi Historial de Videos</h2>

      <VideoPlayer videoId={selectedVideoId} onClose={handleClosePlayer} />

      {loading && <p className="loading-message">Cargando historial...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && history.length === 0 && !error && (
        <p className="no-history-message">Aún no has visto ningún video. ¡Empieza a explorar!</p>
      )}

      <div className="history-list">
        {history.map(video => (
          <div key={video.videoId + video.watchedAt} className="history-item">
            <button
              className="history-button"
              onClick={() => handleVideoClick(video)}
            >
              <img src={video.thumbnail} alt={video.title} className="history-thumbnail" />
              <div className="history-info">
                <h4 className="history-title">{video.title}</h4>
                <p className="history-channel">{video.channelTitle}</p>
                <p className="history-watched-at">Visto el: {formatWatchedAt(video.watchedAt)}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
