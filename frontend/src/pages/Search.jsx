import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/http';
import { getAllFilms } from '../api/films';
import Loader from '../components/ui/Loader';
import FilmCard from '../components/ui/FilmCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter states

    const [yearFilter, setYearFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        async function doSearch() {
            setLoading(true);
            try {
                let data;
                if (query) {
                    data = await apiFetch(`/api/films/search?query=${encodeURIComponent(query)}`);
                } else {
                    data = await getAllFilms();
                }
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        doSearch();
    }, [query]);

    // Unique genres and years for filters


    const years = useMemo(() => {
        const set = new Set(['All']);
        results.forEach(f => { if (f.releaseYear) set.add(f.releaseYear.toString()) });
        return Array.from(set).sort((a, b) => b - a);
    }, [results]);

    const filteredResults = useMemo(() => {
        let list = [...results];



        if (yearFilter !== 'All') {
            list = list.filter(f => f.releaseYear?.toString() === yearFilter);
        }

        if (sortOrder === 'newest') {
            list.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
        } else if (sortOrder === 'title') {
            list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        return list;
    }, [results, yearFilter, sortOrder]);

    return (
        <div className="search-page" style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', minHeight: '100vh', background: '#141414' }}>
            <div className="search-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
                    {query ? `Résultats pour "${query}"` : "Tout le catalogue"}
                </h1>

                <div className="filter-bar" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
                        <Filter size={18} /> <span>Filtrer par:</span>
                    </div>



                    <select
                        value={yearFilter}
                        onChange={e => setYearFilter(e.target.value)}
                        style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px' }}
                    >
                        <option value="All">Toutes les Années</option>
                        {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
                        <SlidersHorizontal size={18} />
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px' }}
                        >
                            <option value="newest">Plus Récents</option>
                            <option value="title">A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-center" style={{ height: '50vh' }}><Loader /></div>
            ) : (
                <>
                    {filteredResults.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', marginTop: '4rem' }}>Aucun film ne correspond à vos critères.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                            {filteredResults.map(film => (
                                <FilmCard key={film.id} film={film} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

