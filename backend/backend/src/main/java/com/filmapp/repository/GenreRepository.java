package com.filmapp.repository;

import com.filmapp.model.Genre;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends Neo4jRepository<Genre, Long> {
    Optional<Genre> findByName(String name);
    
    @Query("MATCH (g:Genre)<-[:HAS_GENRE]-(m:Movie) WHERE id(m) = $movieId RETURN g")
    List<Genre> findByMovieId(@Param("movieId") Long movieId);
    
    boolean existsByName(String name);
    
    @Query("MATCH (g:Genre) WHERE toLower(g.name) CONTAINS toLower($query) RETURN g")
    List<Genre> searchByName(@Param("query") String query);
}
