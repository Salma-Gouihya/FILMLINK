import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';

export default function Layout({ children, user, onLogout }) {
    const location = useLocation();
    const isAdminPath = location.pathname === '/admin';

    return (
        <div className="layout">
            {!isAdminPath && <Header user={user} onLogout={onLogout} />}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
