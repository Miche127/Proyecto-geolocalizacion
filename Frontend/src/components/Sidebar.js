// frontend/src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

import { FaHome, FaVideo, FaTimes, FaSignOutAlt, FaCompass, FaFolder } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close-btn" onClick={onClose}>
                <FaTimes />
            </button>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/" onClick={onClose}>
                        <FaHome />
                        <span>Inicio</span>
                    </Link>
                </li>
                
                <li>
                    {/* Icono FaCompass para Exploración y una ruta /explore */}
                    <Link to="/explore" onClick={onClose}>
                        <FaCompass />
                        <span>Exploración</span>
                    </Link>
                </li>
                <li>
                    {/* Icono FaFolder para Biblioteca y una ruta /library */}
                    <Link to="/library" onClick={onClose}>
                        <FaFolder />
                        <span>Historial</span>
                    </Link>
                </li>
                
                <li className="sidebar-separator"></li> {/* Separador visual */}
                
                {/* Agregando el botón de Logout, asumiendo que el usuario está logueado */}
                {onLogout && ( // Solo muestra el botón si se proporciona la prop onLogout
                    <li>
                        {/* El botón de logout no necesita ser un <Link>, sino un <button> */}
                        <button onClick={onLogout} className="sidebar-logout-btn">
                            <FaSignOutAlt />
                            <span>Cerrar Sesión</span>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;