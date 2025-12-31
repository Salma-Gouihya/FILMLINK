package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Rating")
@Data
public class Rating {
    @Id
    private String id;
    
    @Property(name = "score")
    private Integer score;
    
    @Property(name = "comment")
    private String comment;
    
    @Relationship(type = "RATED", direction = Relationship.Direction.OUTGOING)
    @lombok.EqualsAndHashCode.Exclude
    private User user;
    
    @Relationship(type = "RATED", direction = Relationship.Direction.INCOMING)
    @lombok.EqualsAndHashCode.Exclude
    private Film film;
    
    public Rating() {
        this.id = java.util.UUID.randomUUID().toString();
    }
    
    public Rating(Integer score, String comment) {
        this();
        this.score = score;
        this.comment = comment;
    }
}
