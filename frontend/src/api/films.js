import { apiFetch } from './http'

export function getAllFilms() {
    return apiFetch('/api/films')
}

export function getFilmById(id) {
    return apiFetch(`/api/films/${id}`)
}

export function getRecommendations(userId) {
    return apiFetch(`/api/films/recommendations/${userId}`)
}

export function getCollaborativeRecommendations(userId) {
    return apiFetch(`/api/films/recommendations/collaborative/${userId}`)
}

export function getFilmsByActor(actorName) {
    return apiFetch(`/api/films/actor/${encodeURIComponent(actorName)}`)
}
