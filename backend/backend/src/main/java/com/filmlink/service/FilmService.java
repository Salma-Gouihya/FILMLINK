package com.filmlink.service;

import com.filmlink.model.Film;
import com.filmlink.repository.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FilmService {

    @Autowired
    private FilmRepository filmRepository;

    public List<Film> getAllFilms() {
        // Utilisation de la méthode personnalisée pour éviter les problèmes de sérialisation
        return filmRepository.findAllWithRelationships();
    }

    public Film getFilmById(String id) {
        return filmRepository.findById(id).orElse(null);
    }

    public List<Film> searchFilms(String query) {
        if (query == null || query.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return filmRepository.findByTitleContainingIgnoreCase(query.trim());
    }

    public List<Film> getFilmsByGenre(String genre) {
        return filmRepository.findByGenre(genre);
    }

    public List<Film> getFilmsByActor(String actorName) {
        return filmRepository.findByActor(actorName);
    }

    public Film saveFilm(Film film) {
        return filmRepository.save(film);
    }

    public void deleteFilm(String id) {
        filmRepository.deleteById(id);
    }

    public Film updateFilm(String id, Film filmDetails) {
        Film film = filmRepository.findById(id).orElse(null);
        if (film != null) {
            film.setTitle(filmDetails.getTitle());
            film.setReleaseYear(filmDetails.getReleaseYear());
            film.setDescription(filmDetails.getDescription());
            film.setPosterUrl(filmDetails.getPosterUrl());
            return filmRepository.save(film);
        }
        return null;
    }

    public List<Film> getRecommendations(String userId) {
        return filmRepository.findRecommendationsByUserId(userId);
    }

    public List<Film> getCollaborativeRecommendations(String userId) {
        return filmRepository.findCollaborativeRecommendations(userId);
    }

    public long countTotalLikes() {
        return filmRepository.countTotalLikes();
    }
}
