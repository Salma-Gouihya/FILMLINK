package com.filmapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.neo4j.core.schema.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Node("Actor")
@Data
public class Actor {
    @Id 
    @GeneratedValue
    private Long id;
    
    @Property("name")
    private String name;
    
    @Property("birthDate")
    private LocalDate birthDate;
    
    @Property("biography")
    private String biography;
    
    @Property("profileImageUrl")
    private String profileImageUrl;
    
    @Relationship(type = "ACTED_IN", direction = Relationship.Direction.OUTGOING)
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
        Actor actor = (Actor) o;
        return id != null && id.equals(actor.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
