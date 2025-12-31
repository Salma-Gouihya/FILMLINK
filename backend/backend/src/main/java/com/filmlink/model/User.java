package com.filmlink.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Node("User")
@Data
public class User {
    @Id
    private String id;
    
    @Property(name = "username")
    private String username;
    
    @Property(name = "email")
    private String email;
    
    @JsonIgnore
    @Property(name = "password")
    private String password;
    
    // Mapped "LIKED" relationship as requested
    @Relationship(type = "LIKED", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Film> likedFilms = new HashSet<>();
    
    @Relationship(type = "RATED", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Rating> ratings = new HashSet<>();
    
    @Relationship(type = "HAS_ROLE", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private Set<Role> roles = new HashSet<>();
    
    public User() {
        this.id = java.util.UUID.randomUUID().toString();
    }
    
    public User(String username, String email, String password) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    public Set<String> getRoles() {
        return roles.stream()
                   .map(Role::getName)
                   .collect(Collectors.toSet());
    }
    
    public void setRoles(Set<String> roleNames) {
        this.roles = roleNames.stream()
                           .map(Role::new)
                           .collect(Collectors.toSet());
    }
    
    public String getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
}
