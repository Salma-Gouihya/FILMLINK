package com.filmlink.repository;

import com.filmlink.model.Film;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends Neo4jRepository<Film, Long> {
    // Note: 'titre' property usage in custom queries
    @Query("MATCH (f:Film) WHERE f.titre CONTAINS $title RETURN f")
    List<Film> findByTitleContaining(@Param("title") String title);

    @Query("MATCH (f:Film) WHERE toLower(f.titre) CONTAINS toLower($title) RETURN f")
    List<Film> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    @Query("MATCH (f:Film)-[:APPARTIENT_A]->(g:Genre {name: $genreName}) RETURN f")
    List<Film> findByGenre(@Param("genreName") String genreName);
    
    @Query("MATCH (f:Film)<-[:A_JOUE]-(a:Acteur {nom: $actorName}) RETURN f")
    List<Film> findByActor(@Param("actorName") String actorName);
    
    @Query("MATCH (f:Film)<-[:AIME]-(u:Utilisateur {id: $userId}) RETURN f")
    List<Film> findWatchedByUser(@Param("userId") Long userId);

    @Query("MATCH (u:Utilisateur {id: $userId})-[:AIME]->(f:Film)-[:APPARTIENT_A]->(g:Genre)<-[:APPARTIENT_A]-(rec:Film) " +
           "WHERE NOT (u)-[:AIME]->(rec) AND f <> rec " +
           "GROUP BY rec ORDER BY COUNT(g) DESC LIMIT 10")
    List<Film> findRecommendationsByUserId(@Param("userId") Long userId);
    
    @Query("MATCH (f:Film) OPTIONAL MATCH (f)-[:APPARTIENT_A]->(g:Genre) " +
           "OPTIONAL MATCH (f)<-[:A_JOUE]-(a:Acteur) " +
           "WITH f, COLLECT(DISTINCT g) AS genres, COLLECT(DISTINCT a) AS actors " +
           "RETURN f, genres, actors")
    List<Film> findAllWithRelationships();
}
