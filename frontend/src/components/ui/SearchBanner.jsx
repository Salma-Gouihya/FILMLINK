import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchBanner.css';

export default function SearchBanner({ title, subtitle }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="search-banner">
            <div className="search-banner-content">
                <h1>{title || "Trouvez votre prochain film préféré"}</h1>
                {subtitle && <p>{subtitle}</p>}
                <form onSubmit={handleSearch} className="search-banner-form">
                    <div className="search-banner-input-wrapper">
                        <Search className="search-banner-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un film, un genre, un acteur..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="search-banner-button">Rechercher</button>
                </form>
            </div>
        </div>
    );
}
