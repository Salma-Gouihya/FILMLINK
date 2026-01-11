package com.filmlink.repository;

import com.filmlink.model.Film;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends Neo4jRepository<Film, String> {
    
    @Query("MATCH (f:Film) WHERE f.title CONTAINS $title RETURN f")
    List<Film> findByTitleContaining(@Param("title") String title);

    @Query("MATCH (f:Film) " +
           "WHERE $query <> '' AND (" +
           "toLower(f.title) CONTAINS toLower($query) " +
           "OR ANY(gName IN [(f)-[:HAS_GENRE]->(g:Genre) | g.name] WHERE toLower(gName) CONTAINS toLower($query)) " +
           "OR ANY(aName IN [(f)<-[:ACTED_IN]-(a:Actor) | a.name] WHERE toLower(aName) CONTAINS toLower($query))" +
           ") RETURN f")
    List<Film> findByTitleContainingIgnoreCase(@Param("query") String query);
    
    @Query("MATCH (f:Film)-[:HAS_GENRE]->(g:Genre {name: $genreName}) " +
           "OPTIONAL MATCH (f)-[hg:HAS_GENRE]->(gen:Genre) " +
           "OPTIONAL MATCH (f)<-[ai:ACTED_IN]-(a:Actor) " +
           "RETURN f, hg, gen, ai, a")
    List<Film> findByGenre(@Param("genreName") String genreName);
    
    @Query("MATCH (f:Film)<-[:ACTED_IN]-(a:Actor {name: $actorName}) " +
           "OPTIONAL MATCH (f)-[hg:HAS_GENRE]->(g:Genre) " +
           "OPTIONAL MATCH (f)<-[ai:ACTED_IN]-(act:Actor) " +
           "RETURN f, hg, g, ai, act")
    List<Film> findByActor(@Param("actorName") String actorName);
    
    @Query("MATCH (u:User {id: $userId})-[r:LIKED]->(f:Film) " +
           "OPTIONAL MATCH (f)-[hg:HAS_GENRE]->(g:Genre) " +
           "OPTIONAL MATCH (f)<-[ai:ACTED_IN]-(a:Actor) " +
           "RETURN f, hg, g, ai, a")
    List<Film> findWatchedByUser(@Param("userId") String userId);

    // Content-Based Filtering (based on genres)
    @Query("MATCH (u:User {id: $userId})-[:LIKED]->(f:Film)-[:HAS_GENRE]->(g:Genre)<-[:HAS_GENRE]-(rec:Film) " +
           "WHERE NOT (u)-[:LIKED]->(rec) AND f.id <> rec.id " +
           "WITH rec, COUNT(g) AS score " +
           "ORDER BY score DESC LIMIT 10 " +
           "RETURN rec")
    List<Film> findRecommendationsByUserId(@Param("userId") String userId);

    // Collaborative Filtering (Users who liked this also liked...)
    @Query("MATCH (u:User {id: $userId})-[:LIKED]->(f:Film)<-[:LIKED]-(other:User) " +
           "MATCH (other)-[:LIKED]->(rec:Film) " +
           "WHERE NOT (u)-[:LIKED]->(rec) AND rec.id <> f.id " +
           "WITH rec, COUNT(*) AS frequency " +
           "ORDER BY frequency DESC LIMIT 10 " +
           "RETURN rec")
    List<Film> findCollaborativeRecommendations(@Param("userId") String userId);
    
    @Query("MATCH (f:Film) " +
           "OPTIONAL MATCH (f)-[hg:HAS_GENRE]->(g:Genre) " +
           "OPTIONAL MATCH (f)<-[ai:ACTED_IN]-(a:Actor) " +
           "RETURN f, hg, g, ai, a")
    List<Film> findAllWithRelationships();

    @Query("MATCH ()-[r:LIKED]->() RETURN count(r)")
    long countTotalLikes();
}
