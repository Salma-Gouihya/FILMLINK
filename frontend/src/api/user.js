import { apiFetch } from './http';

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
