import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import { getAllFilms, getRecommendations } from '../api/films';

export default function Home({ user }) {
    const [films, setFilms] = useState([]);
    const [recFilms, setRecFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroFilm, setHeroFilm] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Parallel fetch
                const [allFilmsData, recData] = await Promise.all([
                    getAllFilms(),
                    user?.id ? getRecommendations(user.id).catch(() => []) : []
                ]);

                setFilms(allFilmsData);
                setRecFilms(recData);

                // Pick random hero film
                if (allFilmsData.length > 0) {
                    const randomIdx = Math.floor(Math.random() * allFilmsData.length);
                    setHeroFilm(allFilmsData[randomIdx]);
                }
            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh' }}>
                <Loader size="lg" />
            </div>
        );
    }

    // Segment films by genre (naive implementation for demo)
    const actionFilms = films.filter(f => (f.genre || '').toLowerCase().includes('action'));
    const dramaFilms = films.filter(f => (f.genre || '').toLowerCase().includes('drama'));
    const scifiFilms = films.filter(f => (f.genre || '').toLowerCase().includes('sci-fi') || (f.genre || '').toLowerCase().includes('science'));

    return (
        <div className="home-page">
            <HeroBanner film={heroFilm} />

            <div style={{ marginTop: '-10vh', position: 'relative', zIndex: 10 }}>
                {recFilms.length > 0 && (
                    <SectionRow title="Pour vous" films={recFilms} />
                )}

                <SectionRow title="Tendances actuelles" films={films.slice(0, 10)} />

                {actionFilms.length > 0 && <SectionRow title="Action & Aventure" films={actionFilms} />}
                {scifiFilms.length > 0 && <SectionRow title="Science Fiction" films={scifiFilms} />}
                {dramaFilms.length > 0 && <SectionRow title="Drames Primés" films={dramaFilms} />}

                <SectionRow title="Tout le catalogue" films={films} />
            </div>

            <div style={{ height: '100px' }}></div> {/* Spacer */}
        </div>
    );
}
