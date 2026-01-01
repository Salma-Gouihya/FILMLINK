import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Star, Calendar, Clock, Share2, Check, X } from 'lucide-react';
import { getFilmById, getRecommendations } from '../api/films';
import { addLike, removeLike, getMyList } from '../api/user';
import Button from '../components/ui/Button';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import './FilmDetail.css';

export default function FilmDetail({ user }) {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [likedFilmIds, setLikedFilmIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [filmData, likedData] = await Promise.all([
                    getFilmById(id),
                    user?.id ? getMyList(user.id).catch(() => []) : []
                ]);

                setFilm(filmData);
                const likedIds = new Set((likedData || []).map(f => f.id));
                setLikedFilmIds(likedIds);
                setIsLiked(likedIds.has(filmData.id));

                if (user) {
                    const recs = await getRecommendations(user.id);
                    setRecommendations(recs.filter(f => f.id !== filmData.id));
                }
            } catch (err) {
                console.error("Failed to load film", err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadData();
            window.scrollTo(0, 0);
        }
    }, [id, user]);

    const handleToggleLike = async () => {
        if (!user) return alert("Veuillez vous connecter");
        try {
            if (isLiked) {
                await removeLike(user.id, film.id);
                setIsLiked(false);
            } else {
                await addLike(user.id, film.id);
                setIsLiked(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh' }}>
                <Loader size="lg" />
            </div>
        );
    }

    if (!film) {
        return <div className="flex-center text-white">Film introuvable</div>;
    }

    return (
        <div className="film-detail-page">
            <div className="detail-hero" style={{ backgroundImage: `url(${film.posterUrl || ''})` }}>
                <div className="detail-overlay">
                    <div className="detail-content">
                        <h1 className="detail-title">{film.title}</h1>

                        <div className="detail-meta">
                            <span className="match-score">98% Match</span>
                            <span className="year">{film.releaseYear}</span>
                            <span className="age-rating">16+</span>
                            <span className="duration flex-center"><Clock size={16} className="mr-2" /> 2h 08m</span>
                        </div>

                        <div className="detail-actions">
                            <Button icon={Play} size="lg" className="mr-4">Lecture</Button>

                            <button
                                className={`detail-icon-btn ${isLiked ? 'active' : ''}`}
                                onClick={handleToggleLike}
                                title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                                <ThumbsUp size={24} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <p className="detail-synopsis">
                            {film.description || "Aucun résumé disponible."}
                        </p>

                        <div className="detail-info-grid">
                            {film.genres && film.genres.length > 0 && (
                                <div className="info-group">
                                    <span className="info-label">Genres</span>
                                    <div className="info-badges">
                                        {film.genres.map((g, i) => (
                                            <span key={i} className="info-badge">{g.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {film.actors && film.actors.length > 0 && (
                                <div className="info-group">
                                    <span className="info-label">Distribution</span>
                                    <div className="info-badges">
                                        {film.actors.map((a, i) => (
                                            <span key={i} className="info-badge actor">{a.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="detail-fade-bottom"></div>
            </div>

            <div className="detail-body">
                {recommendations.length > 0 && (
                    <div className="recommendations-section">
                        <SectionRow
                            title="Titres similaires"
                            films={recommendations}
                            user={user}
                            likedFilmIds={likedFilmIds}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
