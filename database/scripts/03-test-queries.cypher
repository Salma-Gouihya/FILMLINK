-- ============================================
-- REQUÊTES DE TEST ET VÉRIFICATION
-- ============================================

-- 1. COMPTER TOUS LES NŒUDS
MATCH (n) RETURN labels(n)[0] as Type, count(n) as Count
ORDER BY Count DESC;

-- 2. VOIR TOUS LES FILMS
MATCH (f:Film) 
RETURN f.titre as Titre, f.annee as Année, f.note_moyenne as Note
ORDER BY f.note_moyenne DESC
LIMIT 10;

-- 3. FILMS AVEC LEURS GENRES
MATCH (f:Film)-[:APPARTIENT_A]->(g:Genre)
RETURN f.titre as Film, collect(g.nom) as Genres
LIMIT 5;

-- 4. ACTEURS D'UN FILM SPÉCIFIQUE
MATCH (f:Film {titre: 'Inception'})-[:A_JOUE]->(a:Acteur)
RETURN a.nom as Acteur, a.role as Rôle
ORDER BY a.principal DESC;

-- 5. FILMS D'UN ACTEUR
MATCH (a:Acteur {nom: 'Morgan Freeman'})<-[:A_JOUE]-(f:Film)
RETURN f.titre as Film, f.annee as Année
ORDER BY f.annee;

-- 6. FILMS AIMÉS PAR UN UTILISATEUR
MATCH (u:Utilisateur {nom: 'Jean Dupont'})-[:AIME]->(f:Film)
RETURN f.titre as Film, f.note_moyenne as Note_Moyenne
ORDER BY f.note_moyenne DESC;

-- 7. UTILISATEURS QUI AIMENT LE MÊME FILM
MATCH (f:Film {titre: 'The Dark Knight'})<-[:AIME]-(u:Utilisateur)
RETURN u.nom as Utilisateur, u.email as Email;

-- 8. RECHERCHE DE FILMS PAR MOT-CLÉ
MATCH (f:Film) 
WHERE f.titre CONTAINS 'Dark' OR f.description CONTAINS 'Dark'
RETURN f.titre as Titre, f.description as Description;

-- 9. RECHERCHE D'ACTEURS
MATCH (a:Acteur)
WHERE a.nom CONTAINS 'Johansson' OR a.nom CONTAINS 'Scarlett'
RETURN a.nom as Nom, a.nationalite as Nationalité, a.date_naissance as Naissance;

-- 10. FILMS PAR GENRE
MATCH (g:Genre {nom: 'Action'})<-[:APPARTIENT_A]-(f:Film)
RETURN f.titre as Film_Action, f.annee as Année, f.note_moyenne as Note
ORDER BY f.note_moyenne DESC;

-- 11. STATISTIQUES
MATCH (u:Utilisateur)
WITH count(u) as nb_utilisateurs
MATCH (f:Film)
WITH nb_utilisateurs, count(f) as nb_films
MATCH (a:Acteur)
WITH nb_utilisateurs, nb_films, count(a) as nb_acteurs
MATCH (g:Genre)
RETURN nb_utilisateurs as Utilisateurs, 
       nb_films as Films, 
       nb_acteurs as Acteurs, 
       count(g) as Genres;

-- 12. FILMS LES MIEUX NOTÉS
MATCH (f:Film)
RETURN f.titre as Titre, f.note_moyenne as Note
ORDER BY f.note_moyenne DESC
LIMIT 5;

-- 13. ACTEURS LES PLUS POPULAIRES (dans le plus de films)
MATCH (a:Acteur)<-[:A_JOUE]-(f:Film)
RETURN a.nom as Acteur, count(f) as Nombre_Films
ORDER BY Nombre_Films DESC
LIMIT 5;

-- 14. GENRES LES PLUS REPRÉSENTÉS
MATCH (g:Genre)<-[:APPARTIENT_A]-(f:Film)
RETURN g.nom as Genre, count(f) as Nombre_Films
ORDER BY Nombre_Films DESC;

-- 15. PREMIÈRE RECOMMANDATION SIMPLE
-- Films similaires à ceux aimés par Jean
MATCH (jean:Utilisateur {nom: 'Jean Dupont'})-[:AIME]->(filmAime:Film)
MATCH (filmAime)-[:APPARTIENT_A]->(genre:Genre)
MATCH (filmSimilaire:Film)-[:APPARTIENT_A]->(genre)
WHERE NOT (jean)-[:AIME]->(filmSimilaire)
RETURN filmSimilaire.titre as Recommendation, 
       count(genre) as Genres_Communs,
       filmSimilaire.note_moyenne as Note
ORDER BY Genres_Communs DESC, filmSimilaire.note_moyenne DESC
LIMIT 5;