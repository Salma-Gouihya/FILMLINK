package com.filmlink.repository;

import com.filmlink.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    @Query("MATCH (u:Utilisateur) WHERE u.username = $usernameOrEmail OR u.email = $usernameOrEmail RETURN u LIMIT 1")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    @Query("MATCH (u:Utilisateur {email: $email}) RETURN u")
    Optional<User> findByEmail(@Param("email") String email);
    
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
