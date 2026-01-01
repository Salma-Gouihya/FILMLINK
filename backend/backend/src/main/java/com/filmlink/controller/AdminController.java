package com.filmlink.controller;

import com.filmlink.service.FilmService;
import com.filmlink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private FilmService filmService;

    @Autowired
    private UserService userService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("films", filmService.getAllFilms().size());
        stats.put("users", userService.countUsers());
        stats.put("likes", filmService.countTotalLikes());
        return stats;
    }
}
