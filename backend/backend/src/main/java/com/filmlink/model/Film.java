package com.filmlink.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Film")
@Data
public class Film {
    @Id @GeneratedValue
    private Long id;
    
    @Property("titre")
    private String title;
    
    @Property("annee")
    private Integer releaseYear;
    
    private String description;
    
    @Property("poster_url")
    private String posterUrl;
    
    private String tagline;

    public String getReleased() {
        return releaseYear != null ? releaseYear.toString() : "";
    }
    
    @Relationship(type = "APPARTIENT_A", direction = Relationship.Direction.OUTGOING)
    private Set<Genre> genres = new HashSet<>();
    
    @Relationship(type = "A_JOUE", direction = Relationship.Direction.INCOMING)
    private Set<Actor> actors = new HashSet<>();
    
    // Updated to match User's "AIME" relationship
    @JsonIgnore
    @Relationship(type = "AIME", direction = Relationship.Direction.INCOMING)
    private Set<User> likedBy = new HashSet<>();
    
    // Keeping RATED as is or removing if not in new spec, keeping for now
    @Relationship(type = "RATED", direction = Relationship.Direction.INCOMING)
    private Set<Rating> ratings = new HashSet<>();
    
    public Film() {}
    
    public Film(String title, Integer releaseYear, String description) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.description = description;
    }
}
