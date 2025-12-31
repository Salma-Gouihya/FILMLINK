package com.filmlink.service;

import com.filmlink.model.Film;
import com.filmlink.model.User;
import com.filmlink.repository.FilmRepository;
import com.filmlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FilmRepository filmRepository;

    public void addLike(Long userId, Long filmId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Film> filmOpt = filmRepository.findById(filmId);

        if (userOpt.isPresent() && filmOpt.isPresent()) {
            User user = userOpt.get();
            Film film = filmOpt.get();
            user.getLikedFilms().add(film);
            userRepository.save(user);
        }
    }

    public void removeLike(Long userId, Long filmId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Film> filmOpt = filmRepository.findById(filmId);

        if (userOpt.isPresent() && filmOpt.isPresent()) {
            User user = userOpt.get();
            // We need to remove the film from the set.
            // Since Set.remove uses equals(), and Film equals is likely ID based or default java object,
            // we should make sure Film/User have proper equals/hashcode or find the exact object reference.
            // Neo4j-OGM / Spring Data Neo4j usually handles this if IDs match.
            user.getLikedFilms().removeIf(f -> f.getId().equals(filmId));
            userRepository.save(user);
        }
    }

    public List<Film> getLikedFilms(Long userId) {
        return filmRepository.findWatchedByUser(userId); 
        // Note: We reused findWatchedByUser query which we updated to semantic AIME in previous step.
    }
}
