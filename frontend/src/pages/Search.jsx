import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/http';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import FilmCard from '../components/ui/FilmCard';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function doSearch() {
            if (!query) return;
            setLoading(true);
            try {
                // Assuming FilmController has a search endpoint
                const data = await apiFetch(`/api/films/search?query=${encodeURIComponent(query)}`);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        doSearch();
    }, [query]);

    return (
        <div className="page-container" style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <h1 className="text-white text-3xl mb-6">Résultats pour "{query}"</h1>

            {loading ? (
                <div className="flex-center h-64"><Loader /></div>
            ) : (
                <>
                    {results.length === 0 ? (
                        <p className="text-gray-400">Aucun résultat trouvé.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {results.map(film => (
                                <FilmCard key={film.id} film={film} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
