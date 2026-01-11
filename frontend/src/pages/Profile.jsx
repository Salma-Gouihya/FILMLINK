import React, { useEffect, useState } from 'react';
import { User, Film, Heart, Activity, Edit2, Save, X, CheckCircle } from 'lucide-react';
import { getMyList, updateProfile, getUserById } from '../api/user';
import { getFilmsByActor } from '../api/films';
import SectionRow from '../components/ui/SectionRow';
import Loader from '../components/ui/Loader';
import './Profile.css';

export default function Profile({ user, onUserUpdate }) {
    const [likedFilms, setLikedFilms] = useState([]);
    const [actorRecs, setActorRecs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            try {
                setLoading(true);

                // Fetch full user data and likes in parallel
                const [userData, likes] = await Promise.all([
                    getUserById(user.id),
                    getMyList(user.id)
                ]);

                setLikedFilms(likes);
                if (userData) {
                    setFormData({
                        username: userData.username,
                        email: userData.email
                    });
                    // Also update parent state if it was missing info
                    if (!user.email && onUserUpdate) {
                        onUserUpdate({ ...user, ...userData });
                    }
                }

                // Find recommendations by actor (if any)
                if (likes.length > 0) {
                    const firstWithActor = likes.find(f => f.actors && f.actors.length > 0);
                    if (firstWithActor) {
                        const actor = firstWithActor.actors[0].name;
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Password validation
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
                return;
            }
            if (formData.password.length < 6) {
                setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
                return;
            }
        }

        setUpdating(true);
        try {
            const updatePayload = {
                username: formData.username,
                email: formData.email
            };

            if (formData.password) {
                updatePayload.password = formData.password;
            }

            console.log("DEBUG: Sending update payload:", updatePayload);
            await updateProfile(user.id, updatePayload);

            // Update local storage and parent state (without sensitive data)
            const updatedUser = { ...user, username: formData.username, email: formData.email };
            localStorage.setItem('user_info', JSON.stringify(updatedUser));
            if (onUserUpdate) onUserUpdate(updatedUser);

            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            setIsEditing(false);

            // Clear password fields
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // Reset message after 3s
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}><Loader size="lg" /></div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="profile-info-content">
                    {!isEditing ? (
                        <div className="profile-view-mode">
                            <div className="flex-between">
                                <h1>{user?.username}</h1>
                                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                    <Edit2 size={16} /> Modifier le profil
                                </button>
                            </div>
                            <p className="email">{user?.email}</p>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="count">{likedFilms.length}</span>
                                    <span className="label">Titres aimés</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="edit-profile-form" onSubmit={handleUpdate}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min 6 caractères"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmer le nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Ressaisissez le mot de passe"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)} disabled={updating}>
                                    <X size={16} /> Annuler
                                </button>
                                <button type="submit" className="btn-save" disabled={updating}>
                                    {updating ? <Loader size="sm" /> : <><Save size={16} /> Enregistrer</>}
                                </button>
                            </div>
                        </form>
                    )}

                    {message.text && (
                        <div className={`profile-message ${message.type}`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            {actorRecs.length > 0 && (
                <div className="profile-section">
                    <SectionRow
                        title={`Parce que vous aimez ${likedFilms.find(f => f.actors && f.actors.length > 0)?.actors?.[0]?.name}`}
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
