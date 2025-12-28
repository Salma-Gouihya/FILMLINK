package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Genre")
@Data
public class Genre {
    @Id @GeneratedValue
    private Long id;
    
    @Property(name = "name")
    private String name;
    
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.INCOMING)
    private Set<Film> films = new HashSet<>();
    
    public Genre() {}
    
    public Genre(String name) {
        this.name = name;
    }
}
