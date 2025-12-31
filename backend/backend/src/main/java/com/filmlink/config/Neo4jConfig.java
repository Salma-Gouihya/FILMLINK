package com.filmlink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableNeo4jRepositories(basePackages = "com.filmlink.repository")
public class Neo4jConfig {
    
    // This configuration ensures relationships are loaded automatically
    // Depth of 2 means: Film -> Genre/Actor relationships will be loaded
}
