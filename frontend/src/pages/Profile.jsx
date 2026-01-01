import React, { useEffect, useState } from 'react';
import { User, Film, Heart, Activity } from 'lucide-react';
import { getMyList } from '../api/user';
import { getFilmsByActor } from '../api/films';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import './Profile.css';

export default function Profile({ user }) {
    const [likedFilms, setLikedFilms] = useState([]);
    const [actorRecs, setActorRecs] = useState([]);
    const [favGenres, setFavGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            try {
                setLoading(true);
                const likes = await getMyList(user.id);
                setLikedFilms(likes);

                // Derive favorite genres
                const genreCounts = {};
                likes.forEach(f => {
                    f.genres?.forEach(g => {
                        genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
                    });
                });
                const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);
                setFavGenres(sortedGenres.slice(0, 3));

                // Find recommendations by actor (if any)
                // We pick an actor from the most liked films
                if (likes.length > 0) {
                    const firstFilm = likes[0];
                    if (firstFilm.actors && firstFilm.actors.length > 0) {
                        const actor = firstFilm.actors[0].name;
                        const recs = await getFilmsByActor(actor);
                        setActorRecs(recs.filter(f => !likes.some(l => l.id === f.id)));
                    }
                }
            } catch (error) {
                console.error("Error loading profile", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [user]);

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}><Loader size="lg" /></div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1>{user?.username}</h1>
                    <p className="email">{user?.email}</p>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="count">{likedFilms.length}</span>
                            <span className="label">Titres aimés</span>
                        </div>

                    </div>
                </div>
            </div>



            {actorRecs.length > 0 && (
                <div className="profile-section">
                    <SectionRow
                        title={`Parce que vous aimez ${likedFilms[0]?.actors?.[0]?.name}`}
                        films={actorRecs}
                        user={user}
                        likedFilmIds={new Set(likedFilms.map(f => f.id))}
                    />
                </div>
            )}

            <div className="profile-section">
                <SectionRow
                    title="Historique des likes"
                    films={likedFilms}
                    user={user}
                    likedFilmIds={new Set(likedFilms.map(f => f.id))}
                />
            </div>
        </div>
    );
}
