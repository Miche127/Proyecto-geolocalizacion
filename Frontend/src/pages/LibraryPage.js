// frontend/src/pages/LibraryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addVideoToUserHistory } from '../utils/history'; // Importa para re-guardar si se ve de nuevo
import '../styles/LibraryPage.css'; // Crearemos este archivo de estilos

const API_URL = 'http://localhost:5000/api';

const LibraryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                console.error('Error al cargar el historial:', err.response ? err.response.data : err.message);
                setError('No se pudo cargar el historial. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleVideoClick = (video) => {
        // Al hacer clic en un video del historial, lo volvemos a añadir
        // para que se actualice su "watchedAt" y aparezca al principio.
        addVideoToUserHistory(video);
        window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank', 'noopener noreferrer');
    };

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

            {loading && <p className="loading-message">Cargando historial...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && history.length === 0 && !error && (
                <p className="no-history-message">Aún no has visto ningún video. ¡Empieza a explorar!</p>
            )}

            <div className="history-list">
                {history.map(video => (
                    <div key={video.videoId + video.watchedAt} className="history-item">
                        <a
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleVideoClick(video)}
                        >
                            <img src={video.thumbnail} alt={video.title} className="history-thumbnail" />
                            <div className="history-info">
                                <h4 className="history-title">{video.title}</h4>
                                <p className="history-channel">{video.channelTitle}</p>
                                <p className="history-watched-at">Visto el: {formatWatchedAt(video.watchedAt)}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;