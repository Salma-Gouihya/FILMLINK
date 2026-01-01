package com.filmlink.controller;

import com.filmlink.model.Film;
import com.filmlink.service.FilmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/films")
public class FilmController {

    @Autowired
    private FilmService filmService;

    @GetMapping
    public List<Film> getAllFilms() {
        return filmService.getAllFilms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Film> getFilmById(@PathVariable String id) {
        Film film = filmService.getFilmById(id);
        return film != null ? ResponseEntity.ok(film) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Film> searchFilms(@RequestParam String query) {
        return filmService.searchFilms(query);
    }

    @GetMapping("/genre/{genre}")
    public List<Film> getFilmsByGenre(@PathVariable String genre) {
        return filmService.getFilmsByGenre(genre);
    }

    @GetMapping("/actor/{actorName}")
    public List<Film> getFilmsByActor(@PathVariable String actorName) {
        return filmService.getFilmsByActor(actorName);
    }

    @PostMapping
    public Film createFilm(@RequestBody Film film) {
        return filmService.saveFilm(film);
    }

    @DeleteMapping("/{id}")
    public void deleteFilm(@PathVariable String id) {
        filmService.deleteFilm(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Film> updateFilm(@PathVariable String id, @RequestBody Film filmDetails) {
        Film updatedFilm = filmService.updateFilm(id, filmDetails);
        return updatedFilm != null ? ResponseEntity.ok(updatedFilm) : ResponseEntity.notFound().build();
    }

    @GetMapping("/recommendations/{userId}")
    public List<Film> getRecommendations(@PathVariable String userId) {
        return filmService.getRecommendations(userId);
    }

    @GetMapping("/recommendations/collaborative/{userId}")
    public List<Film> getCollaborativeRecommendations(@PathVariable String userId) {
        return filmService.getCollaborativeRecommendations(userId);
    }
}
