// frontend/src/components/AuthForm.js
import React from 'react';
import miLogo from '../assets/images/LOGOGEOTUBEs.png';
import { FaUser, FaEnvelope, FaLock, FaGlobe } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google'; // 👈 Importa el componente de Google

const AuthForm = ({
    isRegister,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    country, setCountry,
    onSubmit,
    message, error,
    onToggleAuthMode,
    onGoogleSuccess, // 👈 Nueva prop para el éxito
    onGoogleFailure  // 👈 Nueva prop para el error
}) => {
    return (
        <div className="auth-form-card">
            <img
              src={miLogo}
              alt="Logo de GeoTube"
              className="auth-logo"
            />
            <h2 className="auth-title">{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>

            <form onSubmit={onSubmit} className="auth-form">
                {isRegister && (
                    <>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nombre de usuario"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <FaGlobe className="input-icon" />
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="País"
                                required
                            />
                        </div>
                    </>
                )}
                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Dirección de email"
                        required
                    />
                </div>
                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                <button type="submit" className="auth-submit-btn">
                    {isRegister ? 'Registrar' : 'Iniciar Sesión'}
                </button>
            </form>

            {/* 👇 Sección para el Login con Google */}
            <div className="google-login-container">
                <div className="separator">
                    <span>O</span>
                </div>
                <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={onGoogleFailure}
                    useOneTap
                    theme="filled_blue"
                    shape="rectangular"
                    width="300px" // Ajusta el ancho según tu diseño
                />
            </div>

            {message && <p className="auth-message success">{message}</p>}
            {error && <p className="auth-message error">{error}</p>}
            
            <button
                onClick={onToggleAuthMode}
                className="auth-toggle-btn"
            >
                {isRegister ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
            </button>
        </div>
    );
};

export default AuthForm;