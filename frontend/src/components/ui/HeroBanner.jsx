import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import Button from './Button';

export default function HeroBanner({ film, user }) {
    const navigate = useNavigate();
    if (!film) return null;

    const handleInfoClick = () => {
        navigate(`/films/${film.id}`);
    };

    return (
        <div className="hero-banner" style={{ backgroundImage: `url(${film.posterUrl || ''})` }}>
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1 className="hero-title">{film.title}</h1>
                    <div className="hero-meta">
                        <span className="match-score">98% Match</span>
                        <span className="year">{film.releaseYear}</span>
                        <span className="age-rating">16+</span>
                        <span className="duration">2h 12m</span>
                    </div>
                    <p className="hero-synopsis">
                        {film.description || "Plongez dans cette aventure cinématographique unique. Une expérience inoubliable vous attend dans ce chef-d'œuvre acclamé par la critique."}
                    </p>
                    <div className="hero-actions">
                        <Button icon={Play} size="lg" className="mr-4" onClick={() => navigate(`/watch/${film.id}`)}>Lecture</Button>
                        <Button icon={Info} variant="secondary" size="lg" onClick={handleInfoClick}>Plus d'infos</Button>
                    </div>
                </div>
            </div>
            <div className="hero-fade-bottom"></div>
        </div>
    );
}
