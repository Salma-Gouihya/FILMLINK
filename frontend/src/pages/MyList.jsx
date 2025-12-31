import React, { useEffect, useState } from 'react';
import { getMyList } from '../api/user';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import FilmCard from '../components/ui/FilmCard';
// import './Home.css'; // File does not exist, using global styles

export default function MyList({ user }) {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (user) {
                try {
                    setLoading(true);
                    const list = await getMyList(user.id);
                    setFilms(list);
                } catch (e) {
                    console.error("Failed to load list", e);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData();
    }, [user]);

    if (loading) return <div className="flex-center h-screen"><Loader /></div>;

    return (
        <div className="page-container" style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <h1 className="text-white text-3xl mb-6">Ma Liste</h1>

            {films.length === 0 ? (
                <div className="text-gray-400">
                    Votre liste est vide. Ajoutez des films pour les retrouver ici.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {films.map(film => (
                        <FilmCard key={film.id} film={film} />
                    ))}
                </div>
            )}
        </div>
    );
}
