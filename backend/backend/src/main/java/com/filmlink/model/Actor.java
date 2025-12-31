package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Actor")
@Data
public class Actor {
    @Id
    private String id;
    
    @Property("name")
    private String name;
    
    @Relationship(type = "ACTED_IN", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Film> films = new HashSet<>();
    
    public Actor() {
        this.id = java.util.UUID.randomUUID().toString();
    }
    
    public Actor(String name) {
        this();
        this.name = name;
    }
}
