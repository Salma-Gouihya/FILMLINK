package com.filmapp.repository;

import com.filmapp.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends Neo4jRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);
    
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    List<Movie> findByReleaseYear(Integer year);
    
    @Query("MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre) WHERE id(g) = $genreId RETURN m")
    List<Movie> findByGenreId(@Param("genreId") Long genreId);
    
    @Query("MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) WHERE id(a) = $actorId RETURN m")
    List<Movie> findByActorId(@Param("actorId") Long actorId);
    
    @Query("MATCH (u:User)-[:LIKES]->(m:Movie) WHERE id(u) = $userId RETURN m")
    List<Movie> findLikedMoviesByUserId(@Param("userId") Long userId);
    
    @Query("MATCH (m:Movie) WHERE toLower(m.title) CONTAINS toLower($query) OR toLower(m.description) CONTAINS toLower($query) RETURN m")
    List<Movie> searchMovies(@Param("query") String query);
    
    @Query("MATCH (m:Movie) RETURN m ORDER BY size((m)<-[:LIKES]-()) DESC")
    List<Movie> findTopRatedMovies();
}
