import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addLike, removeLike } from '../../api/user';
import './FilmCard.css';

export default function FilmCard({ film, user, isLikedInitially = false }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(isLikedInitially);
    const [animating, setAnimating] = useState(false);

    // Generate a random match score for demo
    const matchScore = Math.floor(Math.random() * (99 - 70) + 70);

    const handleClick = () => {
        navigate(`/films/${film.id}`);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return;

        try {
            setAnimating(true);
            if (isLiked) {
                await removeLike(user.id, film.id);
                setIsLiked(false);
            } else {
                await addLike(user.id, film.id);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Failed to update like", error);
        } finally {
            setTimeout(() => setAnimating(false), 500);
        }
    };

    return (
        <div className="film-card-wrapper" onClick={handleClick}>
            <div className="film-card-content">
                <div className="film-poster-container">
                    {film.posterUrl ? (
                        <img src={film.posterUrl} alt={film.title} className="film-poster-img" />
                    ) : (
                        <div className="film-poster-placeholder" style={{ backgroundColor: stringToColor(film.title) }}>
                            <div className="poster-text">{film.title.substring(0, 2).toUpperCase()}</div>
                        </div>
                    )}
                </div>

                {/* Hover Info */}
                <div className="film-info-hover">
                    <div className="film-poster-mini-container">
                        {film.posterUrl ? (
                            <img src={film.posterUrl} alt={film.title} className="film-poster-mini-img" />
                        ) : (
                            <div className="film-poster-mini-placeholder" style={{ backgroundColor: stringToColor(film.title) }}></div>
                        )}
                        <div className="mini-overlay">
                            <span className="mini-title">{film.title}</span>
                        </div>
                    </div>

                    <div className="info-actions">
                        <div className="left-actions">
                            <button className="icon-btn-circle filled" title="Lecture" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                                <Play size={16} fill="black" />
                            </button>
                            <button className="icon-btn-circle" title="Ajouter à ma liste" onClick={(e) => e.stopPropagation()}>
                                <Plus size={16} />
                            </button>
                            <button
                                className={`icon-btn-circle ${isLiked ? 'liked' : ''} ${animating ? 'pulse' : ''}`}
                                title={isLiked ? "Je n'aime plus" : "J'aime"}
                                onClick={handleLike}
                            >
                                {isLiked ? <Check size={16} color="#46d369" /> : <ThumbsUp size={16} />}
                            </button>
                        </div>
                        <button className="icon-btn-circle" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="info-meta">
                        <span className="match-score">{matchScore}% Match</span>
                        <span className="age-rating">12+</span>
                        <span className="duration">1h 45m</span>
                    </div>

                    <div className="info-genres">
                        {film.genres && film.genres.length > 0 ? (
                            film.genres.slice(0, 2).map((g, i) => (
                                <React.Fragment key={g.id || i}>
                                    <span className="genre">{g.name}</span>
                                    {i < Math.min(film.genres.length, 2) - 1 && <span className="genre-dot">•</span>}
                                </React.Fragment>
                            ))
                        ) : (
                            <>
                                <span className="genre">Action</span>
                                <span className="genre-dot">•</span>
                                <span className="genre">Drame</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function stringToColor(str) {
    if (!str) return '#333';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}
