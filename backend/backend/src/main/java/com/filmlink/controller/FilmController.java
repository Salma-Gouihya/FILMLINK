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
    public ResponseEntity<Film> getFilmById(@PathVariable Long id) {
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
    public void deleteFilm(@PathVariable Long id) {
        filmService.deleteFilm(id);
    }
}
