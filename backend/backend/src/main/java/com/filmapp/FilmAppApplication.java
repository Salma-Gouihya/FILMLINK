package com.filmapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableNeo4jRepositories
@EnableTransactionManagement
public class FilmAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(FilmAppApplication.class, args);
    }
}
