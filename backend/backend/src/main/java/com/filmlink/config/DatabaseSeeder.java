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

    @Autowired
    private org.springframework.data.neo4j.core.Neo4jClient neo4jClient;
    
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            System.out.println("🔄 Cleaning and Seeding Database...");
            
            // Clear database for a clean start
            neo4jClient.query("MATCH (n) DETACH DELETE n").run();

            // 1. ACTORS
            Actor leo = new Actor("Leonardo DiCaprio");
            Actor cillian = new Actor("Cillian Murphy");
            Actor keanu = new Actor("Keanu Reeves");
            Actor tom = new Actor("Tom Hardy");
            Actor carrie = new Actor("Carrie-Anne Moss");
            Actor christian = new Actor("Christian Bale");
            Actor heath = new Actor("Heath Ledger");

            // 2. GENRES
            Genre scifi = new Genre("Science Fiction");
            Genre action = new Genre("Action");
            Genre drama = new Genre("Drama");
            Genre crime = new Genre("Crime");
            Genre thriller = new Genre("Thriller");

            // 3. FILMS
            Film inception = new Film("Inception", 2010, "A thief who steals corporate secrets through the use of dream-sharing technology.");
            inception.setPosterUrl("https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg");
            inception.setGenres(new HashSet<>(Arrays.asList(scifi, action, thriller)));
            inception.setActors(new HashSet<>(Arrays.asList(leo, cillian, tom)));

            Film darkKnight = new Film("The Dark Knight", 2008, "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.");
            darkKnight.setPosterUrl("https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg");
            darkKnight.setGenres(new HashSet<>(Arrays.asList(action, crime, drama)));
            darkKnight.setActors(new HashSet<>(Arrays.asList(christian, heath, cillian)));

            Film matrix = new Film("The Matrix", 1999, "A computer hacker learns from mysterious rebels about the true nature of his reality.");
            matrix.setPosterUrl("https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg");
            matrix.setGenres(new HashSet<>(Arrays.asList(scifi, action)));
            matrix.setActors(new HashSet<>(Arrays.asList(keanu, carrie)));

            Film interstellar = new Film("Interstellar", 2014, "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.");
            interstellar.setPosterUrl("https://image.tmdb.org/t/p/original/gEU2QniE6EzuV6vfbqc97GvYvUo.jpg");
            interstellar.setGenres(new HashSet<>(Arrays.asList(scifi, drama)));

            Film pulpFiction = new Film("Pulp Fiction", 1994, "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.");
            pulpFiction.setPosterUrl("https://image.tmdb.org/t/p/original/d5iIl9h9btztp9qxcc67G9Z0uib.jpg");
            pulpFiction.setGenres(new HashSet<>(Arrays.asList(crime, drama)));

            filmRepository.saveAll(Arrays.asList(inception, darkKnight, matrix, interstellar, pulpFiction));

            // 4. USERS
            User salma = new User("salma", "salma@gmail.com", encoder.encode("gouihya@2025"));
            salma.getLikedFilms().add(inception);
            salma.getLikedFilms().add(matrix);
            
            User bob = new User("bob", "bob@gmail.com", encoder.encode("password"));
            // Bob likes Inception and Matrix too (to connect with Salma)
            bob.getLikedFilms().add(inception);
            bob.getLikedFilms().add(matrix);
            // Bob also likes Interstellar (which Salma hasn't seen yet)
            bob.getLikedFilms().add(interstellar);

            userRepository.saveAll(Arrays.asList(salma, bob));
            
            System.out.println("✅ Database Seeded successfully with USERS, FILMS and RELATIONSHIPS.");
        };
    }
}
