package com.filmlink.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Rating")
@Data
public class Rating {
    @Id @GeneratedValue
    private Long id;
    
    @Property(name = "score")
    private Integer score;
    
    @Property(name = "comment")
    private String comment;
    
    @Relationship(type = "RATED", direction = Relationship.Direction.OUTGOING)
    private User user;
    
    @Relationship(type = "RATED", direction = Relationship.Direction.INCOMING)
    private Film film;
    
    public Rating() {}
    
    public Rating(Integer score, String comment) {
        this.score = score;
        this.comment = comment;
    }
}
