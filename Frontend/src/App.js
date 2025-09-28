// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AuthPage from './pages/AuthPage';
import Layout from './components/Layout'; // Nuevo componente Layout
import HomePage from './pages/HomePage';
import MyVideosPage from './pages/MyVideosPage';
import ExplorePage from './pages/ExplorePage'; // 👈 1. Importa la nueva página
import LibraryPage from './pages/LibraryPage'; // Hemos movido HomePage a su propio archivo
import { GoogleOAuthProvider } from '@react-oauth/google'; // 👈 1. Importa el proveedor

// Importa tus páginas futuras aquí:


import './App.css'; // Tus estilos globales

const API_URL = 'http://localhost:5000/api/auth'; // Asegúrate de que esta URL sea correcta

function AppContent() {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Para guardar los detalles del usuario
    const [loadingUser, setLoadingUser] = useState(true); // Estado de carga para el usuario
    const navigate = useNavigate();

    // Función para obtener los detalles del usuario
    const fetchUserData = async (token) => {
        try {
            setLoadingUser(true);
            // --- CAMBIOS AQUÍ ---
            const res = await axios.get(`${API_URL}/me`, {
                headers: {
                    // El header debe ser 'Authorization' y el valor 'Bearer <token>'
                    'Authorization': `Bearer ${token}` 
                }
            });
            // --------------------
            setUser(res.data);
        } catch (err) {
            console.error('Error al obtener los datos del usuario:', err.response ? err.response.data : err.message);
            localStorage.removeItem('token');
            setAuthToken(null);
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };


    useEffect(() => {
        if (authToken) {
            fetchUserData(authToken);
        } else {
            setUser(null);
            setLoadingUser(false); // No hay token, no necesitamos cargar usuario
            // No redirigir aquí para evitar bucles. AuthPage se encarga si no hay token.
        }
    }, [authToken]); // Se ejecuta cuando el token cambia

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        // setUser(null); // Se limpia en el useEffect
        navigate('/auth'); // Redirigir a la página de autenticación al cerrar sesión
    };

    const handleLoginSuccess = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
        navigate('/'); // Redirigir a la página de inicio después del login
    };

    // Muestra un loader mientras se carga la info del usuario
    if (loadingUser && authToken) {
        return <div className="loading-screen">Cargando usuario...</div>;
    }

    return (
        <Layout user={user} onLogout={handleLogout}>
            <Routes>
                {/* Si el usuario está autenticado, muestra estas rutas */}
                {authToken ? (
                    <>
                        <Route path="/" element={<HomePage user={user} />} />
                        <Route path="/explore" element={<ExplorePage />} /> {/* 👈 3. Añade la ruta para Exploración */}
                        <Route path="/library" element={<LibraryPage />} /> {/* 👈 4. Añade la ruta para Biblioteca */}
                        <Route path="*" element={<HomePage user={user} />} /> 
                    </>
                ) : (
                /* Si el usuario NO está autenticado, solo permite la ruta /auth */
                    <>
                        <Route path="/auth" element={<AuthPage setAuthToken={handleLoginSuccess} />} />
                        {/* Cualquier otra ruta redirige a la página de autenticación */}
                        <Route path="*" element={<AuthPage setAuthToken={handleLoginSuccess} />} />
                    </>
                )}
            </Routes>
        </Layout>
    );
}

// Wrapper para usar useNavigate y otros hooks de react-router-dom
function App() {
    const googleClientId = "8303532805-087cjtan1s681791bel1d1f0u70qkgnr.apps.googleusercontent.com"; // 👈 2. Pega tu ID de Cliente aquí

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <AppContent />
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;