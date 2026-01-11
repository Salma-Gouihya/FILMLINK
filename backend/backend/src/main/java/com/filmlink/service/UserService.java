package com.filmlink.service;

import com.filmlink.model.Film;
import com.filmlink.model.User;
import com.filmlink.payload.request.UpdateUserRequest;
import com.filmlink.repository.FilmRepository;
import com.filmlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private PasswordEncoder encoder;

    @org.springframework.transaction.annotation.Transactional
    public User updateUser(String userId, UpdateUserRequest updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!user.getUsername().equals(updateRequest.getUsername()) && userRepository.existsByUsername(updateRequest.getUsername())) {
            throw new RuntimeException("Erreur: Le nom d'utilisateur est déjà pris !");
        }

        if (!user.getEmail().equals(updateRequest.getEmail()) && userRepository.existsByEmail(updateRequest.getEmail())) {
            throw new RuntimeException("Erreur: L'email est déjà utilisé !");
        }

        user.setUsername(updateRequest.getUsername());
        user.setEmail(updateRequest.getEmail());

        String passwordToSave = user.getPassword();
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().trim().isEmpty()) {
            System.out.println("DEBUG: Encoding new password. Length: " + updateRequest.getPassword().length());
            passwordToSave = encoder.encode(updateRequest.getPassword());
            user.setPassword(passwordToSave);
        }
        
        User savedUser = userRepository.save(user);
        System.out.println("DEBUG: User saved successfully. Saved ID: " + savedUser.getId());
        return savedUser;
    }

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
        userRepository.removeLikeRelationship(userId, filmId);
    }

    public List<Film> getLikedFilms(String userId) {
        return filmRepository.findWatchedByUser(userId); 
    }

    public long countUsers() {
        return userRepository.count();
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }
}
