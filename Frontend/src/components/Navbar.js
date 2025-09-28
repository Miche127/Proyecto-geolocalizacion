// frontend/src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react'; // Importa useState, useRef, useEffect
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Mantén solo los íconos necesarios
import miLogo from '../assets/images/LOGOGEOTUBE.jpg';

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
    // Estado para controlar la visibilidad del menú desplegable
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Referencia para detectar clics fuera del dropdown
    const dropdownRef = useRef(null);

    // Función para alternar la visibilidad del dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Efecto para cerrar el dropdown al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Se ejecuta una sola vez al montar el componente

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
                    <FaBars />
                </button>
                <Link to="/" className="navbar-brand">
                    <img src={miLogo} alt="GeoTube Logo" className="navbar-logo" />
                    <span>GeoTube</span>
                </Link>
            </div>
            <div className="navbar-right">
                {user ? (
                    <div className="user-dropdown-container" ref={dropdownRef}>
                        {/* El área clickable para el dropdown */}
                        <div className="user-info-clickable" onClick={toggleDropdown}>
                            <FaUserCircle className="user-icon" />
                            <span className="welcome-text">{user.username}</span>
                        </div>

                        {/* El menú desplegable */}
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {/* Puedes añadir más opciones aquí, como "Mi perfil", "Configuración", etc. */}
                                {/* <li><Link to="/profile">Mi perfil</Link></li> */}
                                {/* <li><Link to="/settings">Configuración</Link></li> */}
                                <button onClick={onLogout} className="dropdown-logout-btn">
                                    <FaSignOutAlt />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/auth" className="navbar-btn login-btn">
                            <FaUserCircle />
                            <span className="btn-text">Acceder</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;