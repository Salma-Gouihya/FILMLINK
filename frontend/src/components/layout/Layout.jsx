import React from 'react';
import Header from './Header';

export default function Layout({ children, user, onLogout }) {
    return (
        <div className="layout">
            <Header user={user} onLogout={onLogout} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
