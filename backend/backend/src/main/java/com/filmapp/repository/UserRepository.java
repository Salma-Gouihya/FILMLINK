package com.filmapp.repository;

import com.filmapp.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    @Query("MATCH (u:User) WHERE u.username = $username OR u.email = $email RETURN u LIMIT 1")
    Optional<User> findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);
    
    @Query("MATCH (u:User) WHERE u.username = $username RETURN count(u) > 0")
    Boolean existsByUsername(String username);
    
    @Query("MATCH (u:User) WHERE u.email = $email RETURN count(u) > 0")
    Boolean existsByEmail(String email);
    
    @Query("MATCH (u:User) WHERE id(u) IN $userIds RETURN u")
    List<User> findByIdIn(@Param("userIds") List<Long> userIds);
    
    @Query("MATCH (u:User)-[:LIKES]->(m:Movie) WHERE id(m) = $movieId RETURN u")
    List<User> findByLikedMovies_Id(@Param("movieId") Long movieId);
    
    @Query("MATCH (u:User)-[:LIKES]->(m:Movie) WHERE id(m) = $movieId RETURN u")
    List<User> findUsersWhoLikedMovie(@Param("movieId") Long movieId);
}
