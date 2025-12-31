import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Note: Need to setup Router later
import './Header.css';
import Button from '../ui/Button';

export default function Header({ user, onLogout }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
                <div className="header-left">
                    <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>

                    <div className="logo">FILMLINK</div>

                    <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <Link to="/" className="nav-item active">Accueil</Link>
                    </nav>
                </div>

                <div className="header-right">
                    <div className="search-box">
                        <Search className="icon" />
                        <input
                            type="text"
                            placeholder="Titres, personnes, genres"
                            className="search-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/search?q=${encodeURIComponent(e.target.value)}`;
                                }
                            }}
                        />
                    </div>
                    <div className="icon-btn">
                        <Bell className="icon" />
                    </div>
                    <div className="user-menu group">
                        <div className="avatar">
                            {user?.username?.charAt(0).toUpperCase() || <User />}
                        </div>
                        <div className="dropdown">
                            <Link to="/profile" className="dropdown-item">Profil</Link>
                            <span className="dropdown-item" onClick={onLogout}>Déconnexion</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
