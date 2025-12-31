import React from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FilmCard.css';

export default function FilmCard({ film }) {
    const navigate = useNavigate();
    // Generate a random match score for demo
    const matchScore = Math.floor(Math.random() * (99 - 70) + 70);

    const handleClick = () => {
        navigate(`/films/${film.id}`);
    };

    return (
        <div className="film-card-wrapper" onClick={handleClick}>
            <div className="film-card-content">
                <div className="film-poster" style={{ backgroundColor: stringToColor(film.title) }}>
                    <div className="poster-text">{film.title.substring(0, 2).toUpperCase()}</div>
                </div>

                {/* Hover Info */}
                <div className="film-info-hover">
                    <div className="film-poster-mini" style={{ backgroundColor: stringToColor(film.title) }}></div>

                    <div className="info-actions">
                        <div className="left-actions">
                            <button className="icon-btn-circle filled" onClick={(e) => { e.stopPropagation(); handleClick(); }}><Play size={16} fill="black" /></button>
                            <button className="icon-btn-circle" onClick={(e) => e.stopPropagation()}><Plus size={16} /></button>
                            <button className="icon-btn-circle" onClick={(e) => e.stopPropagation()}><ThumbsUp size={16} /></button>
                        </div>
                        <button className="icon-btn-circle" onClick={(e) => { e.stopPropagation(); handleClick(); }}><ChevronDown size={16} /></button>
                    </div>

                    <div className="info-meta">
                        <span className="match-score">{matchScore}% Match</span>
                        <span className="age-rating">12+</span>
                        <span className="duration">1h 45m</span>
                    </div>

                    <div className="info-genres">
                        <span className="genre">{film.tagline ? 'Sci-Fi' : 'Drama'}</span>
                        <span className="genre-dot">•</span>
                        <span className="genre">Action</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}
