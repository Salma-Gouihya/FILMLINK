package com.filmapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.schema.Relationship.Direction;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Node("User")
@Data
public class User {
    @Id 
    @GeneratedValue
    private Long id;

    @NotBlank
    @Size(min = 3, max = 20)
    @Property("username")
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    @Property("email")
    private String email;

    @NotBlank
    @Size(min = 6, max = 120)
    @JsonIgnore
    @Property("password")
    private String password;

    @Relationship(type = "LIKES", direction = Direction.OUTGOING)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Movie> likedMovies = new HashSet<>();

    @Property("roles")
    private Set<String> roles = new HashSet<>();

    // Constructeurs
    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Méthodes utilitaires
    public void likeMovie(Movie movie) {
        if (this.likedMovies == null) {
            this.likedMovies = new HashSet<>();
        }
        this.likedMovies.add(movie);
    }

    public void unlikeMovie(Movie movie) {
        if (this.likedMovies != null) {
            this.likedMovies.remove(movie);
        }
    }
    
    public void addRole(String role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
    }
    
    public void removeRole(String role) {
        if (this.roles != null) {
            this.roles.remove(role);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
