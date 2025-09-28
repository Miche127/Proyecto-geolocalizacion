// frontend/src/components/Layout.js
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ user, onLogout, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            <Navbar user={user} onLogout={onLogout} onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                {children} {/* Aquí se renderizará el contenido de la ruta actual */}
            </main>
        </div>
    );
};

export default Layout;