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
    
    @Query("MATCH (u:User) WHERE u.username = $usernameOrEmail OR u.email = $usernameOrEmail RETURN u")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    @Query("MATCH (u:User {email: $email}) RETURN u")
    Optional<User> findByEmail(@Param("email") String email);
    
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
