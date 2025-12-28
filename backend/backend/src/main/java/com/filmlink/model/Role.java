package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;

@Node("Role")
@Data
public class Role {
    @Id @GeneratedValue
    private Long id;
    
    @Property(name = "name")
    private String name;
    
    @Relationship(type = "HAS_ROLE", direction = Relationship.Direction.INCOMING)
    private Set<User> users = new HashSet<>();
    
    public Role() {}
    
    public Role(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
