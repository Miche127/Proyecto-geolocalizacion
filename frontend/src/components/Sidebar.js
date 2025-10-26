// frontend/src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaHome, 
    FaTimes, 
    FaSignOutAlt, 
    FaCompass, 
    FaFolder, 
    FaComment 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
    
    // --- 1. DEFINIMOS EL NÚMERO Y EL MENSAJE ---
    const whatsappNumber = "9511394431";
    const defaultMessage = "Hola, soy un usuario de su aplicación y la retroalimentación que quisiera dar es la siguiente: ";
    
    // --- 2. CODIFICAMOS EL MENSAJE PARA LA URL ---
    // Esto convierte espacios en %20, 'ó' en %C3%B3, etc.
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // --- 3. CREAMOS EL ENLACE COMPLETO ---
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

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
                    <Link to="/explore" onClick={onClose}>
                        <FaCompass />
                        <span>Exploración</span>
                    </Link>
                </li>
                <li>
                    <Link to="/library" onClick={onClose}>
                        <FaFolder />
                        <span>Historial</span>
                    </Link>
                </li>

                {/* Esta es la opción que modificamos */}
                <li>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <FaComment />
                        <span>Comentarios</span>
                    </a>
                </li>
                
                <li className="sidebar-separator"></li>
                
                {onLogout && (
                    <li>
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