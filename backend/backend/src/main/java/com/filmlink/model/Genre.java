package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Genre")
@Data
public class Genre {
    @Id
    private String id;
    
    @Property(name = "name")
    private String name;
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.INCOMING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Film> films = new HashSet<>();
    
    public Genre() {
        this.id = java.util.UUID.randomUUID().toString();
    }
    
    public Genre(String name) {
        this();
        this.name = name;
    }
}
