// frontend/src/components/AuthForm.js
import React, { useState} from 'react';
import miLogo from '../assets/images/LOGOGEOTUBEs.png';
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google'; 

import '../styles/AuthPage.css';

const AuthForm = ({
    isRegister,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    country, setCountry,
    onSubmit,
    message, error,
    onToggleAuthMode,
    onGoogleSuccess, 
    onGoogleFailure  
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    // Validaciones en contraseña
    const validations = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    const isPasswordValid = Object.values(validations).every(Boolean);

    return (
    <div className="auth-form-card">
      <img src={miLogo} alt="Logo de GeoTube" className="auth-logo" />
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

        <div className="input-group password-group">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            required
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {passwordFocus && (
          <div className="password-rules">
            <p className={validations.length ? 'valid' : 'invalid'}>
              {validations.length ? '✔️' : '❌'} Mínimo 8 caracteres
            </p>
            <p className={validations.upper ? 'valid' : 'invalid'}>
              {validations.upper ? '✔️' : '❌'} Una mayúscula
            </p>
            <p className={validations.lower ? 'valid' : 'invalid'}>
              {validations.lower ? '✔️' : '❌'} Una minúscula
            </p>
            <p className={validations.symbol ? 'valid' : 'invalid'}>
              {validations.symbol ? '✔️' : '❌'} Un símbolo
            </p>
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isRegister && !isPasswordValid}
        >
          {isRegister ? 'Registrar' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="google-login-container">
        <div className="separator"><span>O</span></div>
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={onGoogleFailure}
          useOneTap
          theme="filled_blue"
          shape="rectangular"
          width="300px"
        />
      </div>

      {message && <p className="auth-message success">{message}</p>}
      {error && <p className="auth-message error">{error}</p>}

      <button onClick={onToggleAuthMode} className="auth-toggle-btn">
        {isRegister
          ? '¿Ya tienes una cuenta? Inicia Sesión'
          : '¿No tienes una cuenta? Regístrate'}
      </button>
    </div>
  );
};

export default AuthForm;