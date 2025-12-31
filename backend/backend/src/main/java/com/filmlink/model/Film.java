package com.filmlink.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Film")
@Data
public class Film {
    @Id
    private String id;

    @Property("title")
    private String title;
    
    @Property("year")
    private Integer releaseYear;
    
    private String description;
    
    @Property("posterUrl")
    private String posterUrl;
    
    private String tagline;

    public String getReleased() {
        return releaseYear != null ? releaseYear.toString() : "";
    }
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Genre> genres = new HashSet<>();
    
    @Relationship(type = "ACTED_IN", direction = Relationship.Direction.INCOMING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Actor> actors = new HashSet<>();
    
    // Updated to match User's "LIKED" relationship
    @JsonIgnore
    @Relationship(type = "LIKED", direction = Relationship.Direction.INCOMING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<User> likedBy = new HashSet<>();
    
    @Relationship(type = "RATED", direction = Relationship.Direction.INCOMING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Rating> ratings = new HashSet<>();
    
    public Film() {
        this.id = java.util.UUID.randomUUID().toString();
    }
    
    public Film(String title, Integer releaseYear, String description) {
        this();
        this.title = title;
        this.releaseYear = releaseYear;
        this.description = description;
    }
}
