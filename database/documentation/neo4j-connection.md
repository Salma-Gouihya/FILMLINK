## Connexion Neo4j#
    URI: http://localhost:7474/browser/
    FILMLINKDB: gouihya@gmail.com

    
## Commandes utiles

### Se connecter via Neo4j Browser
1. Aller sur :  http://localhost:7474/browser/
2. Entrer les credentials
3. Se connecter

### Commandes Cypher de base
```cypher
-- Voir tous les nœuds
MATCH (n) RETURN n LIMIT 25;

-- Compter les nœuds par type
MATCH (n) RETURN labels(n)[0], count(*);

-- Supprimer tout (attention!)
MATCH (n) DETACH DELETE n;