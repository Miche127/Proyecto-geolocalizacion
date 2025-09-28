// frontend/src/utils/history.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const addVideoToUserHistory = async (video) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No hay token de autenticación. No se puede añadir video al historial.');
    return;
  }

  try {
    await axios.post(
      `${API_BASE_URL}/users/history`,
      {
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  } catch (error) {
    console.error('Error al añadir video al historial:', error.response ? error.response.data : error.message);
  }
};

export const getUserHistory = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];
  try {
    const res = await axios.get(`${API_BASE_URL}/users/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data || [];
  } catch (err) {
    console.warn('No se pudo obtener historial:', err);
    return [];
  }
};
