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

    public Film getFilmById(Long id) {
        return filmRepository.findById(id).orElse(null);
    }

    public List<Film> searchFilms(String query) {
        return filmRepository.findByTitleContaining(query);
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

    public void deleteFilm(Long id) {
        filmRepository.deleteById(id);
    }

    public List<Film> getRecommendations(Long userId) {
        return filmRepository.findRecommendationsByUserId(userId);
    }
}
