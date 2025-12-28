package com.filmapp.repository;

import com.filmapp.model.Actor;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActorRepository extends Neo4jRepository<Actor, Long> {
    
    Optional<Actor> findByName(String name);
    
    List<Actor> findByNameContainingIgnoreCase(String name);
    
    @Query("MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) WHERE id(m) = $movieId RETURN a")
    List<Actor> findByMovieId(@Param("movieId") Long movieId);
    
    @Query("MATCH (a:Actor) WHERE toLower(a.name) CONTAINS toLower($query) RETURN a")
    List<Actor> searchActors(@Param("query") String query);
    
    boolean existsByName(String name);
    
    @Query("MATCH (a:Actor) RETURN a ORDER BY size((a)-[:ACTED_IN]->()) DESC LIMIT 10")
    List<Actor> findMostPopularActors();
}
