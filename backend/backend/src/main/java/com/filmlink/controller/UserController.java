package com.filmlink.controller;

import com.filmlink.model.Film;
import com.filmlink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/{userId}/likes/{filmId}")
    public ResponseEntity<?> addLike(@PathVariable Long userId, @PathVariable Long filmId) {
        userService.addLike(userId, filmId);
        return ResponseEntity.ok().body("Film ajouté aux favoris");
    }

    @DeleteMapping("/{userId}/likes/{filmId}")
    public ResponseEntity<?> removeLike(@PathVariable Long userId, @PathVariable Long filmId) {
        userService.removeLike(userId, filmId);
        return ResponseEntity.ok().body("Film retiré des favoris");
    }

    @GetMapping("/{userId}/likes")
    public List<Film> getLikedFilms(@PathVariable Long userId) {
        return userService.getLikedFilms(userId);
    }
}
