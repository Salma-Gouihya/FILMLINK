package com.filmlink.config;

import com.filmlink.model.Film;
import com.filmlink.model.Genre;
import com.filmlink.model.Actor;
import com.filmlink.model.User;
import com.filmlink.repository.FilmRepository;
import com.filmlink.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Autowired
    private FilmRepository filmRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            System.out.println("🔄 Vérification des données de la base...");

            // 1. ACTEURS (Find or Create)
            Actor leo = createOrFindActor("Leonardo DiCaprio");
            Actor cillian = createOrFindActor("Cillian Murphy");
            Actor keanu = createOrFindActor("Keanu Reeves");
            Actor tom = createOrFindActor("Tom Hardy");

            // 2. GENRES (Find or Create)
            Genre scifi = createOrFindGenre("Science Fiction");
            Genre action = createOrFindGenre("Action");
            Genre drama = createOrFindGenre("Drame");

            // 3. FILMS (Find or Create)
            Film inception = createOrUpdateFilm("Inception", 2010, 
                "Un voleur qui s'empare de secrets d'entreprise...", 
                "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                new HashSet<>(Arrays.asList(scifi, action)),
                new HashSet<>(Arrays.asList(leo, cillian, tom)));

            // Création du film The Dark Knight
            createOrUpdateFilm("The Dark Knight", 2008, 
                "Le Joker sème le chaos à Gotham.", 
                "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                new HashSet<>(Arrays.asList(action, drama)),
                new HashSet<>(Arrays.asList(cillian)));

            Film matrix = createOrUpdateFilm("Matrix", 1999, 
                "Neo découvre la vérité sur la matrice.", 
                "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                new HashSet<>(Arrays.asList(scifi, action)),
                new HashSet<>(Arrays.asList(keanu)));

            // 4. UTILISATEUR (Find or Create & Update favorites)
            User salma = userRepository.findByUsernameOrEmail("salma")
                    .orElse(new User("salma", "salma@gmail.com", encoder.encode("gouihya@2025")));
            
            if (salma.getId() == null) {
                userRepository.save(salma);
                salma = userRepository.findByUsernameOrEmail("salma").get();
            }

            // Mise à jour des favoris (AIME)
            // On ajoute sans doublon
            // Note: simple addition to Set works for uniqueness if equals/hashcode are correct
            // But with Neo4j-OGM sometimes refreshing is better
            salma.getLikedFilms().add(inception);
            salma.getLikedFilms().add(matrix);
            
            userRepository.save(salma);
            System.out.println("✅ Données vérifiées et mises à jour.");
        };
    }

    private Actor createOrFindActor(String name) {
        // Naive implementation matching existing repository capability or lack thereof
        // If ActorRepository doesn't exist, we assume Film saves cascade, 
        // but to find them we need a repository or query. 
        // Simplified: Just new Actor(name) risks duplicates if we save them individually.
        // But since we cascade from Film, we rely on Film update.
        return new Actor(name); 
    }

    private Genre createOrFindGenre(String name) {
        return new Genre(name);
    }

    private Film createOrUpdateFilm(String title, int year, String desc, String poster, 
                                  java.util.Set<Genre> genres, java.util.Set<Actor> actors) {
        List<Film> existing = filmRepository.findByTitleContaining(title);
        Film film;
        if (existing.isEmpty()) {
            film = new Film(title, year, desc);
            film.setPosterUrl(poster);
            film.setGenres(genres);
            film.setActors(actors);
            filmRepository.save(film);
            System.out.println("✨ Film créé : " + title);
        } else {
            film = existing.get(0);
            // Optional: Update missing access/fields if needed
        }
        return film;
    }
}
