import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/http';
import { getAllFilms } from '../api/films';
import { Trash2, Plus, Film, Users, Database, LayoutDashboard, LogOut, Edit } from 'lucide-react';
import './Admin.css';

export default function AdminPage({ user, onLogout }) {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ films: 0, users: 0, likes: 0 });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingFilm, setEditingFilm] = useState(null);

    // Form state
    const [newFilm, setNewFilm] = useState({
        title: '',
        releaseYear: '',
        description: '',
        posterUrl: '',
        videoUrl: '',
        duration: '1h 45m'
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const filmList = await getAllFilms();
            const statsData = await apiFetch('/api/admin/stats');
            setFilms(filmList);
            setStats(statsData);
        } catch (err) {
            console.error("Failed to load admin data", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteFilm = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce film ?")) return;
        try {
            await apiFetch(`/api/films/${id}`, { method: 'DELETE' });
            setFilms(films.filter(f => f.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleEditClick = (film) => {
        setEditingFilm(film);
        setNewFilm({
            title: film.title,
            releaseYear: film.releaseYear,
            description: film.description,
            posterUrl: film.posterUrl,
            videoUrl: film.videoUrl || '',
            duration: film.duration || '1h 45m'
        });
        setShowAddForm(true);
    };

    const handleAddFilm = async (e) => {
        e.preventDefault();
        try {
            if (editingFilm) {
                await apiFetch(`/api/films/${editingFilm.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(newFilm)
                });
            } else {
                await apiFetch('/api/films', {
                    method: 'POST',
                    body: JSON.stringify(newFilm)
                });
            }
            setShowAddForm(false);
            setEditingFilm(null);
            setNewFilm({ title: '', releaseYear: '', description: '', posterUrl: '', videoUrl: '', duration: '1h 45m' });
            loadData();
        } catch (err) {
            console.error(err);
            alert(editingFilm
                ? `Erreur lors de la modification : ${err.message}`
                : `Erreur lors de l'ajout : ${err.message}`);
        }
    };

    if (!user?.roles?.includes('ROLE_ADMIN') && !user?.roles?.includes('ADMIN')) {
        return <div className="admin-error">Accès refusé. Réservé aux administrateurs.</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <Database size={24} className="text-primary" />
                    <span>Admin Panel</span>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active"><LayoutDashboard size={18} /> Dashboard</div>
                    <div className="nav-item"><Film size={18} /> Films</div>
                    <div className="nav-item"><Users size={18} /> Utilisateurs</div>
                    <div className="nav-item logout-item" onClick={onLogout}>
                        <LogOut size={18} /> Déconnexion
                    </div>
                </nav>
            </div>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Tableau de Bord</h1>
                    <button className="btn-add" onClick={() => setShowAddForm(true)}>
                        <Plus size={18} /> Ajouter un film
                    </button>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon film"><Film /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.films}</span>
                            <span className="stat-label">Films</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon user"><Users /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.users}</span>
                            <span className="stat-label">Utilisateurs</span>
                        </div>
                    </div>
                </div>

                <div className="admin-content-box">
                    <div className="box-header">
                        <h2>Gestion du Catalogue</h2>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Titre</th>
                                <th>Année</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {films.map(film => (
                                <tr key={film.id}>
                                    <td>
                                        <img src={film.posterUrl} alt="" className="table-img" />
                                    </td>
                                    <td><strong>{film.title}</strong></td>
                                    <td>{film.releaseYear}</td>
                                    <td className="table-desc">
                                        {film.description?.length > 80
                                            ? film.description.substring(0, 80) + "..."
                                            : film.description}
                                    </td>
                                    <td>
                                        <div className="action-group">
                                            <button className="action-btn edit" onClick={() => handleEditClick(film)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDeleteFilm(film.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <h2>Ajouter un nouveau film</h2>
                        <form onSubmit={handleAddFilm} className="admin-form">
                            <div className="form-group">
                                <label>Titre du film</label>
                                <input
                                    type="text"
                                    value={newFilm.title}
                                    onChange={e => setNewFilm({ ...newFilm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Année</label>
                                    <input
                                        type="number"
                                        value={newFilm.releaseYear}
                                        onChange={e => setNewFilm({ ...newFilm, releaseYear: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de l'affiche (Poster)</label>
                                <input
                                    type="text"
                                    value={newFilm.posterUrl}
                                    onChange={e => setNewFilm({ ...newFilm, posterUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de la vidéo (YouTube ou direct)</label>
                                <input
                                    type="text"
                                    value={newFilm.videoUrl}
                                    onChange={e => setNewFilm({ ...newFilm, videoUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (Synopsis)</label>
                                <textarea
                                    value={newFilm.description}
                                    onChange={e => setNewFilm({ ...newFilm, description: e.target.value })}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => {
                                    setShowAddForm(false);
                                    setEditingFilm(null);
                                    setNewFilm({ title: '', releaseYear: '', description: '', posterUrl: '', videoUrl: '', duration: '1h 45m' });
                                }}>Annuler</button>
                                <button type="submit" className="btn-primary">{editingFilm ? 'Modifier' : 'Enregistrer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
