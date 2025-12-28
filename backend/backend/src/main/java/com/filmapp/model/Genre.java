package com.filmapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.neo4j.core.schema.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Node("Genre")
@Data
public class Genre {
    @Id 
    @GeneratedValue
    private Long id;
    
    @NotBlank
    @Size(min = 2, max = 50)
    @Property("name")
    private String name;
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.INCOMING)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Movie> movies = new HashSet<>();
    
    // Méthodes utilitaires
    public void addMovie(Movie movie) {
        if (this.movies == null) {
            this.movies = new HashSet<>();
        }
        this.movies.add(movie);
    }
    
    public void removeMovie(Movie movie) {
        if (this.movies != null) {
            this.movies.remove(movie);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Genre genre = (Genre) o;
        return id != null && id.equals(genre.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
