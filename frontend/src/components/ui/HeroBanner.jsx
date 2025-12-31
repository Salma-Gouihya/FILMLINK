import React from 'react';
import { Play, Info } from 'lucide-react';
import Button from '../ui/Button';
import './HeroBanner.css';

export default function HeroBanner({ film }) {
    if (!film) return null;

    return (
        <div className="hero-banner" style={{ backgroundImage: `url(${film.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop'})` }}>
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1 className="hero-title">{film.title}</h1>
                    <div className="hero-meta">
                        <span className="match-score">98% Match</span>
                        <span className="year">{film.released}</span>
                        <span className="age-rating">16+</span>
                        <span className="duration">1h 55m</span>
                    </div>
                    <p className="hero-synopsis">
                        {film.tagline || "Plongez dans cette aventure cinématographique unique. Une expérience inoubliable vous attend dans ce chef-d'œuvre acclamé par la critique."}
                    </p>
                    <div className="hero-actions">
                        <Button icon={Play} size="lg" className="mr-4">Lecture</Button>
                        <Button icon={Info} variant="secondary" size="lg">Plus d'infos</Button>
                    </div>
                </div>
            </div>
            <div className="hero-fade-bottom"></div>
        </div>
    );
}
