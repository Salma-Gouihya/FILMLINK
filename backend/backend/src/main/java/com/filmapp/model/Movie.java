package com.filmapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.neo4j.core.schema.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Node("Movie")
@Data
public class Movie {
    @Id 
    @GeneratedValue
    private Long id;
    
    @Property("title")
    private String title;
    
    @Property("description")
    private String description;
    
    @Property("releaseYear")
    private Integer releaseYear;
    
    @Property("duration")
    private Integer duration; // en minutes
    
    @Property("posterUrl")
    private String posterUrl;
    
    @Relationship(type = "ACTED_IN", direction = Relationship.Direction.INCOMING)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Actor> actors = new HashSet<>();
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Genre> genres = new HashSet<>();
    
    @Relationship(type = "LIKES", direction = Relationship.Direction.INCOMING)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<User> likedByUsers = new HashSet<>();
    
    // Méthodes utilitaires pour gérer les relations
    public void addActor(Actor actor) {
        if (this.actors == null) {
            this.actors = new HashSet<>();
        }
        this.actors.add(actor);
    }
    
    public void removeActor(Actor actor) {
        if (this.actors != null) {
            this.actors.remove(actor);
        }
    }
    
    public void addGenre(Genre genre) {
        if (this.genres == null) {
            this.genres = new HashSet<>();
        }
        this.genres.add(genre);
    }
    
    public void removeGenre(Genre genre) {
        if (this.genres != null) {
            this.genres.remove(genre);
        }
    }
    
    public void likeByUser(User user) {
        if (this.likedByUsers == null) {
            this.likedByUsers = new HashSet<>();
        }
        this.likedByUsers.add(user);
    }
    
    public void unlikeByUser(User user) {
        if (this.likedByUsers != null) {
            this.likedByUsers.remove(user);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Movie movie = (Movie) o;
        return id != null && id.equals(movie.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
