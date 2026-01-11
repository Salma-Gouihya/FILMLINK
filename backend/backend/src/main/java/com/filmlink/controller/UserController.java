package com.filmlink.controller;

import com.filmlink.model.Film;
import com.filmlink.model.User;
import com.filmlink.payload.request.UpdateUserRequest;
import com.filmlink.service.UserService;
import jakarta.validation.Valid;
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

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            System.out.println("DEBUG: Incoming update request for user: " + userId + " - Username: " + updateRequest.getUsername());
            User updatedUser = userService.updateUser(userId, updateRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            System.err.println("DEBUG: Error updating user: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/likes/{filmId}")
    public ResponseEntity<?> addLike(@PathVariable String userId, @PathVariable String filmId) {
        userService.addLike(userId, filmId);
        return ResponseEntity.ok().body("Film ajouté aux favoris");
    }

    @DeleteMapping("/{userId}/likes/{filmId}")
    public ResponseEntity<?> removeLike(@PathVariable String userId, @PathVariable String filmId) {
        userService.removeLike(userId, filmId);
        return ResponseEntity.ok().body("Film retiré des favoris");
    }

    @GetMapping("/{userId}/likes")
    public List<Film> getLikedFilms(@PathVariable String userId) {
        return userService.getLikedFilms(userId);
    }
}
