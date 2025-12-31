import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Star, Calendar, Clock, Share2 } from 'lucide-react';
import { getFilmById, getRecommendations } from '../api/films';
import { addLike } from '../api/user';
import Button from '../components/ui/Button';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import './FilmDetail.css';

export default function FilmDetail({ user }) {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const filmData = await getFilmById(id);
                setFilm(filmData);

                // Fetch recommendations based on this film or user
                if (user) {
                    const recs = await getRecommendations(user.id);
                    // Filter out current film
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

    // Placeholder match score
    const matchScore = 95;

    return (
        <div className="film-detail-page">
            {/* Hero Backdrop */}
            <div className="detail-hero" style={{ backgroundImage: `url(${film.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop'})` }}>
                <div className="detail-overlay">
                    <div className="detail-content">
                        <h1 className="detail-title">{film.title}</h1>

                        <div className="detail-meta">
                            <span className="match-score">{matchScore}% Match</span>
                            <span className="year">{film.released || '2023'}</span>
                            <span className="age-rating">16+</span>
                            <span className="duration flex-center"><Clock size={16} className="mr-2" /> 1h 55m</span>
                        </div>

                        <div className="detail-actions">
                            <Button icon={Play} size="lg" className="mr-4">Lecture</Button>
                            <Button
                                icon={Plus}
                                variant="secondary"
                                className="mr-2"
                                onClick={async () => {
                                    if (!user) return alert("Connectez-vous pour ajouter à votre liste");
                                    await addLike(user.id, film.id);
                                    alert("Ajouté à votre liste !");
                                }}
                            >
                                Ma Liste
                            </Button>
                            <Button
                                icon={ThumbsUp}
                                variant="secondary"
                                className="mr-2"
                                onClick={async () => {
                                    if (!user) return alert("Connectez-vous pour aimer");
                                    await addLike(user.id, film.id);
                                    alert("J'aime !");
                                }}
                            >
                                J'aime
                            </Button>
                            <Button icon={Share2} variant="ghost">Partager</Button>
                        </div>

                        <p className="detail-synopsis">
                            {film.tagline || "Une aventure épique qui repousse les limites de l'imagination. Plongez dans un univers où chaque choix compte et où le destin de tous ne tient qu'à un fil."}
                        </p>

                        <div className="detail-tags">
                            <span className="tag-label">Genres:</span>
                            <span className="tag-value">{film.tagline ? 'Science Fiction, Action' : 'Drame, Suspense'}</span>
                        </div>
                    </div>
                </div>
                <div className="detail-fade-bottom"></div>
            </div>

            {/* Content Section */}
            <div className="detail-body">
                <div className="detail-columns">
                    <div className="detail-left">
                        <h3>Distribution</h3>
                        <div className="cast-grid">
                            {/* Mock Cast */}
                            {['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'].map(actor => (
                                <div key={actor} className="cast-item">{actor}</div>
                            ))}
                        </div>
                    </div>

                    <div className="detail-right">
                        <h3>Détails</h3>
                        <div className="meta-row">
                            <span className="label">Réalisateur:</span>
                            <span className="value">Christopher Nolan</span>
                        </div>
                        <div className="meta-row">
                            <span className="label">Année:</span>
                            <span className="value">{film.released}</span>
                        </div>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div className="recommendations-section">
                        <SectionRow title="Titres similaires" films={recommendations} />
                    </div>
                )}
            </div>
        </div>
    );
}
