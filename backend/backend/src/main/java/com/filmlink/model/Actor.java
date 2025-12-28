package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Actor")
@Data
public class Actor {
    @Id @GeneratedValue
    private Long id;
    
    @Property(name = "name")
    private String name;
    
    @Relationship(type = "STARRED_IN", direction = Relationship.Direction.OUTGOING)
    private Set<Film> films = new HashSet<>();
    
    public Actor() {}
    
    public Actor(String name) {
        this.name = name;
    }
}
