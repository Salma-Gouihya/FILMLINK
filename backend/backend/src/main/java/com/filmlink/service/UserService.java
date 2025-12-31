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

    public void addLike(String userId, String filmId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Film> filmOpt = filmRepository.findById(filmId);

        if (userOpt.isPresent() && filmOpt.isPresent()) {
            User user = userOpt.get();
            Film film = filmOpt.get();
            user.getLikedFilms().add(film);
            userRepository.save(user);
        }
    }

    public void removeLike(String userId, String filmId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Film> filmOpt = filmRepository.findById(filmId);

        if (userOpt.isPresent() && filmOpt.isPresent()) {
            User user = userOpt.get();
            user.getLikedFilms().removeIf(f -> f.getId().equals(filmId));
            userRepository.save(user);
        }
    }

    public List<Film> getLikedFilms(String userId) {
        return filmRepository.findWatchedByUser(userId); 
    }
}
