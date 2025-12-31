import { useEffect, useState } from 'react'
import { getAllFilms, getRecommendations } from './api/films'

export default function Movies({ user, onLogout }) {
    const [films, setFilms] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [allFilms, recs] = await Promise.all([
                    getAllFilms(),
                    getRecommendations(user.id)
                ])
                setFilms(allFilms)
                setRecommendations(recs)
            } catch (err) {
                console.error("Failed to fetch movies", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            fetchData()
        } else {
            setLoading(false)
            setError("Identifiant utilisateur manquant. Veuillez vous reconnecter.")
        }
    }, [user])

    if (loading) return <div className="loading" style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Chargement des films...</div>
    if (error) return <div className="alert error">{error}</div>

    return (
        <div className="movies-container">
            <header className="header row">
                <h1>FilmLink</h1>
                <div className="user-controls">
                    <span>Bonjour, <strong>{user.username}</strong></span>
                    <button className="btn small" onClick={onLogout}>Déconnexion</button>
                </div>
            </header>

            {recommendations.length > 0 && (
                <section className="section">
                    <h2>Recommandés pour vous ✨</h2>
                    <div className="film-grid">
                        {recommendations.map(film => (
                            <FilmCard key={film.id} film={film} />
                        ))}
                    </div>
                </section>
            )}

            <section className="section">
                <h2>Catalogue Complet 🎬</h2>
                <div className="film-grid">
                    {films.map(film => (
                        <FilmCard key={film.id} film={film} />
                    ))}
                </div>
            </section>
        </div>
    )
}

function FilmCard({ film }) {
    return (
        <div className="film-card">
            <div className="film-cover" style={{ backgroundColor: stringToColor(film.title) }}>
                {film.title.substring(0, 2).toUpperCase()}
            </div>
            <div className="film-info">
                <h3>{film.title}</h3>
                <span className="film-year">{film.released}</span>
                <p className="film-tagline">{film.tagline}</p>
            </div>
        </div>
    )
}

// Utils to generate a consistent color from string
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}
