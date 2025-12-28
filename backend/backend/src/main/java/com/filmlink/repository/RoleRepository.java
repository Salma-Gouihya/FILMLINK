package com.filmlink.repository;

import com.filmlink.model.Role;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends Neo4jRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
