import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../api/films';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import FilmCard from '../components/ui/FilmCard';
import SearchBanner from '../components/ui/SearchBanner';

export default function MyList({ user }) {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (user?.id) {
                try {
                    setLoading(true);
                    const recs = await getRecommendations(user.id);
                    setFilms(recs || []);
                } catch (e) {
                    console.error("Failed to load recommendations", e);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData();
    }, [user]);

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}><Loader /></div>;

    return (
        <div className="mylist-page" style={{ paddingTop: '80px', minHeight: '100vh', background: '#141414' }}>
            <SearchBanner
                title="Recommandés pour vous"
                subtitle="Basé sur vos goûts et vos films visionnés"
            />

            <div style={{ padding: '0 4%' }}>
                {films.length === 0 ? (
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '4rem' }}>
                        Aucune recommandation pour le moment. Découvrez plus de films pour affiner vos goûts !
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                        {films.map(film => (
                            <FilmCard
                                key={film.id}
                                film={film}
                                user={user}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div style={{ height: '100px' }}></div>
        </div>
    );
}
