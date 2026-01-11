import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { getFilmById } from '../api/films';
import './Watch.css';

export default function Watch() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilm() {
            try {
                const data = await getFilmById(id);
                setFilm(data);
            } catch (err) {
                console.error("Error loading film for watch", err);
            } finally {
                setLoading(false);
            }
        }
        loadFilm();
    }, [id]);

    if (loading) return <div className="watch-loading"><Loader className="animate-spin" size={48} /></div>;
    if (!film) return <div className="watch-error text-white">Film introuvable.</div>;

    const renderPlayer = () => {
        if (!film.videoUrl) {
            return (
                <div className="no-video-message">
                    <h2>URL de la vidéo non configurée.</h2>
                    <p>Veuillez ajouter une URL de vidéo dans la page d'administration.</p>
                </div>
            );
        }

        // Basic check for YouTube
        if (film.videoUrl.includes('youtube.com') || film.videoUrl.includes('youtu.be')) {
            let videoId = '';
            if (film.videoUrl.includes('v=')) {
                videoId = film.videoUrl.split('v=')[1].split('&')[0];
            } else {
                videoId = film.videoUrl.split('/').pop();
            }
            return (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={film.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }

        // Default to video tag
        return (
            <video controls autoPlay className="video-player">
                <source src={film.videoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
        );
    };

    return (
        <div className="watch-page">
            <div className="watch-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={32} />
                    <span>Retour</span>
                </button>
            </div>

            <div className="video-container">
                {renderPlayer()}
            </div>

            <div className="watch-info">
                <h1>Vous regardez : {film.title}</h1>
            </div>
        </div>
    );
}
