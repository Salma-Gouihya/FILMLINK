package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Film")
@Data
public class Film {
    @Id @GeneratedValue
    private Long id;
    
    private String title;
    private Integer releaseYear;
    private String description;
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    private Set<Genre> genres = new HashSet<>();
    
    @Relationship(type = "STARRED_IN", direction = Relationship.Direction.INCOMING)
    private Set<Actor> actors = new HashSet<>();
    
    @Relationship(type = "WATCHED", direction = Relationship.Direction.INCOMING)
    private Set<User> watchedBy = new HashSet<>();
    
    @Relationship(type = "RATED", direction = Relationship.Direction.INCOMING)
    private Set<Rating> ratings = new HashSet<>();
    
    public Film() {}
    
    public Film(String title, Integer releaseYear, String description) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.description = description;
    }
}
