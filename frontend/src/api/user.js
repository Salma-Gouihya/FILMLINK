import { apiFetch } from './http';

export function getUserById(userId) {
    return apiFetch(`/api/users/${userId}`);
}

export function addLike(userId, filmId) {
    return apiFetch(`/api/users/${userId}/likes/${filmId}`, {
        method: 'POST'
    });
}

export function removeLike(userId, filmId) {
    return apiFetch(`/api/users/${userId}/likes/${filmId}`, {
        method: 'DELETE'
    });
}

export function getMyList(userId) {
    return apiFetch(`/api/users/${userId}/likes`);
}

export function updateProfile(userId, profileData) {
    return apiFetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
}
