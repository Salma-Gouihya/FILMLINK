package com.filmlink.repository;

import com.filmlink.model.Film;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends Neo4jRepository<Film, Long> {
    @Query("MATCH (f:Film) WHERE f.title CONTAINS $title RETURN f")
    List<Film> findByTitleContaining(@Param("title") String title);
    @Query("MATCH (f:Film) WHERE toLower(f.title) CONTAINS toLower($title) RETURN f")
    List<Film> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    @Query("MATCH (f:Film)-[:HAS_GENRE]->(g:Genre {name: $genreName}) RETURN f")
    List<Film> findByGenre(@Param("genreName") String genreName);
    
    @Query("MATCH (f:Film)<-[:STARRED_IN]-(a:Actor {name: $actorName}) RETURN f")
    List<Film> findByActor(@Param("actorName") String actorName);
    
    @Query("MATCH (f:Film)<-[:WATCHED]-(u:User {id: $userId}) RETURN f")
    List<Film> findWatchedByUser(@Param("userId") Long userId);
}
