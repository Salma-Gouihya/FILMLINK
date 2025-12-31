import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import SearchBanner from '../components/ui/SearchBanner';
import { getAllFilms, getRecommendations, getCollaborativeRecommendations } from '../api/films';
import { getMyList } from '../api/user';

export default function Home({ user }) {
    const [films, setFilms] = useState([]);
    const [recFilms, setRecFilms] = useState([]);
    const [collabRecs, setCollabRecs] = useState([]);
    const [likedFilmIds, setLikedFilmIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [heroFilm, setHeroFilm] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Parallel fetch
                const [allFilmsData, recData, collabData, likedData] = await Promise.all([
                    getAllFilms(),
                    user?.id ? getRecommendations(user.id).catch(() => []) : [],
                    user?.id ? getCollaborativeRecommendations(user.id).catch(() => []) : [],
                    user?.id ? getMyList(user.id).catch(() => []) : []
                ]);

                setFilms(allFilmsData);
                setRecFilms(recData);
                setCollabRecs(collabData);
                setLikedFilmIds(new Set((likedData || []).map(f => f.id)));

                // Pick random hero film from all films
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

    // Segment films by genre (more robust matching)
    const actionFilms = (films || []).filter(f => (f.genres?.some(g => g.name.toLowerCase().includes('action'))));
    const dramaFilms = (films || []).filter(f => (f.genres?.some(g => g.name.toLowerCase().includes('drame') || g.name.toLowerCase().includes('drama'))));
    const scifiFilms = (films || []).filter(f => (f.genres?.some(g => g.name.toLowerCase().includes('sci-fi') || g.name.toLowerCase().includes('science'))));

    return (
        <div className="home-page">
            <div style={{ paddingTop: '100px', position: 'relative', zIndex: 10 }}>
                {recFilms.length > 0 && (
                    <SectionRow
                        title="Inspiré par vos goûts (Genres)"
                        films={recFilms}
                        user={user}
                        likedFilmIds={likedFilmIds}
                    />
                )}

                {collabRecs.length > 0 && (
                    <SectionRow
                        title="Ce que les autres cinéphiles aiment"
                        films={collabRecs}
                        user={user}
                        likedFilmIds={likedFilmIds}
                    />
                )}

                {actionFilms.length > 0 && (
                    <SectionRow
                        title="Action & Aventure"
                        films={actionFilms}
                        user={user}
                        likedFilmIds={likedFilmIds}
                    />
                )}

                <SearchBanner />

                {scifiFilms.length > 0 && (
                    <SectionRow
                        title="Science Fiction"
                        films={scifiFilms}
                        user={user}
                        likedFilmIds={likedFilmIds}
                    />
                )}

                {dramaFilms.length > 0 && (
                    <SectionRow
                        title="Drames Incontournables"
                        films={dramaFilms}
                        user={user}
                        likedFilmIds={likedFilmIds}
                    />
                )}

                <SectionRow
                    title="Tout le catalogue"
                    films={films || []}
                    user={user}
                    likedFilmIds={likedFilmIds}
                />
            </div>

            <div style={{ height: '100px' }}></div>
        </div>
    );
}
