-- ============================================
-- 1. CRÉATION DES GENRES (10 genres populaires)
-- ============================================
CREATE (:Genre {id: 'g1', nom: 'Action', description: 'Films pleins d\'action et de combats'});
CREATE (:Genre {id: 'g2', nom: 'Drame', description: 'Histoires émotionnelles et sérieuses'});
CREATE (:Genre {id: 'g3', nom: 'Comédie', description: 'Films humoristiques et légers'});
CREATE (:Genre {id: 'g4', nom: 'Science-Fiction', description: 'Futur, espace, technologie'});
CREATE (:Genre {id: 'g5', nom: 'Thriller', description: 'Suspense et tension'});
CREATE (:Genre {id: 'g6', nom: 'Romance', description: 'Histoires d\'amour'});
CREATE (:Genre {id: 'g7', nom: 'Horreur', description: 'Films effrayants'});
CREATE (:Genre {id: 'g8', nom: 'Animation', description: 'Films animés'});
CREATE (:Genre {id: 'g9', nom: 'Aventure', description: 'Explorations et découvertes'});
CREATE (:Genre {id: 'g10', nom: 'Fantastique', description: 'Magie et mondes imaginaires'});

-- ============================================
-- 2. CRÉATION DES ACTEURS (20 acteurs populaires)
-- ============================================
-- Groupe 1 : Acteurs d'action
CREATE (:Acteur {id: 'a1', nom: 'Leonardo DiCaprio', nationalite: 'Américain', date_naissance: date('1974-11-11')});
CREATE (:Acteur {id: 'a2', nom: 'Morgan Freeman', nationalite: 'Américain', date_naissance: date('1937-06-01')});
CREATE (:Acteur {id: 'a3', nom: 'Scarlett Johansson', nationalite: 'Américaine', date_naissance: date('1984-11-22')});
CREATE (:Acteur {id: 'a4', nom: 'Tom Hanks', nationalite: 'Américain', date_naissance: date('1956-07-09')});

-- Groupe 2 : Acteurs français
CREATE (:Acteur {id: 'a5', nom: 'Omar Sy', nationalite: 'Français', date_naissance: date('1978-01-20')});
CREATE (:Acteur {id: 'a6', nom: 'Marion Cotillard', nationalite: 'Française', date_naissance: date('1975-09-30')});
CREATE (:Acteur {id: 'a7', nom: 'Jean Dujardin', nationalite: 'Français', date_naissance: date('1972-06-19')});

-- Groupe 3 : Autres acteurs internationaux
CREATE (:Acteur {id: 'a8', nom: 'Meryl Streep', nationalite: 'Américaine', date_naissance: date('1949-06-22')});
CREATE (:Acteur {id: 'a9', nom: 'Robert Downey Jr.', nationalite: 'Américain', date_naissance: date('1965-04-04')});
CREATE (:Acteur {id: 'a10', nom: 'Jennifer Lawrence', nationalite: 'Américaine', date_naissance: date('1990-08-15')});

-- ============================================
-- 3. CRÉATION DES FILMS (15 films variés)
-- ============================================
-- Films d'action/SF
CREATE (:Film {
    id: 'f1',
    titre: 'Inception',
    annee: 2010,
    duree: 148,
    description: 'Un voleur qui s\'infiltre dans les rêves pour voler des secrets',
    note_moyenne: 8.8,
    poster_url: 'https://example.com/inception.jpg'
});

CREATE (:Film {
    id: 'f2',
    titre: 'The Dark Knight',
    annee: 2008,
    duree: 152,
    description: 'Batman affronte le Joker à Gotham City',
    note_moyenne: 9.0,
    poster_url: 'https://example.com/darkknight.jpg'
});

CREATE (:Film {
    id: 'f3',
    titre: 'Avengers: Endgame',
    annee: 2019,
    duree: 181,
    description: 'Les Avengers tentent de défaire Thanos',
    note_moyenne: 8.4,
    poster_url: 'https://example.com/endgame.jpg'
});

-- Films dramatiques
CREATE (:Film {
    id: 'f4',
    titre: 'Forrest Gump',
    annee: 1994,
    duree: 142,
    description: 'La vie extraordinaire d\'un homme simple',
    note_moyenne: 8.8,
    poster_url: 'https://example.com/forrest.jpg'
});

CREATE (:Film {
    id: 'f5',
    titre: 'The Shawshank Redemption',
    annee: 1994,
    duree: 142,
    description: 'Un banquier emprisonné trouve l\'espoir en prison',
    note_moyenne: 9.3,
    poster_url: 'https://example.com/shawshank.jpg'
});

-- Films français
CREATE (:Film {
    id: 'f6',
    titre: 'Intouchables',
    annee: 2011,
    duree: 112,
    description: 'L\'amitié entre un milliardaire tétraplégique et son aide à domicile',
    note_moyenne: 8.5,
    poster_url: 'https://example.com/intouchables.jpg'
});

CREATE (:Film {
    id: 'f7',
    titre: 'Le Fabuleux Destin d\'Amélie Poulain',
    annee: 2001,
    duree: 122,
    description: 'Une jeune femme timide décide de changer la vie des autres',
    note_moyenne: 8.3,
    poster_url: 'https://example.com/amelie.jpg'
});

-- Comédies
CREATE (:Film {
    id: 'f8',
    titre: 'La La Land',
    annee: 2016,
    duree: 128,
    description: 'Une histoire d\'amour entre une actrice et un musicien à Los Angeles',
    note_moyenne: 8.0,
    poster_url: 'https://example.com/lalaland.jpg'
});

-- ============================================
-- 4. CRÉATION DES RELATIONS FILM-ACTEUR
-- ============================================
-- Inception
MATCH (f:Film {titre: 'Inception'})
MATCH (a:Acteur {nom: 'Leonardo DiCaprio'})
CREATE (f)-[:A_JOUE {role: 'Dom Cobb', principal: true}]->(a);

MATCH (f:Film {titre: 'Inception'})
MATCH (a:Acteur {nom: 'Morgan Freeman'})
CREATE (f)-[:A_JOUE {role: 'Narrateur', principal: false}]->(a);

-- The Dark Knight
MATCH (f:Film {titre: 'The Dark Knight'})
MATCH (a:Acteur {nom: 'Morgan Freeman'})
CREATE (f)-[:A_JOUE {role: 'Lucius Fox', principal: true}]->(a);

-- Intouchables
MATCH (f:Film {titre: 'Intouchables'})
MATCH (a:Acteur {nom: 'Omar Sy'})
CREATE (f)-[:A_JOUE {role: 'Driss', principal: true}]->(a);

MATCH (f:Film {titre: 'Intouchables'})
MATCH (a:Acteur {nom: 'François Cluzet'})
CREATE (a)-[:A_JOUE {role: 'Philippe'}]->(f);

-- Avengers
MATCH (f:Film {titre: 'Avengers: Endgame'})
MATCH (a:Acteur {nom: 'Scarlett Johansson'})
CREATE (f)-[:A_JOUE {role: 'Natasha Romanoff / Black Widow', principal: true}]->(a);

MATCH (f:Film {titre: 'Avengers: Endgame'})
MATCH (a:Acteur {nom: 'Robert Downey Jr.'})
CREATE (f)-[:A_JOUE {role: 'Tony Stark / Iron Man', principal: true}]->(a);

-- ============================================
-- 5. CRÉATION DES RELATIONS FILM-GENRE
-- ============================================
-- Inception : SF + Action + Thriller
MATCH (f:Film {titre: 'Inception'})
MATCH (g:Genre {nom: 'Science-Fiction'})
CREATE (f)-[:APPARTIENT_A]->(g);

MATCH (f:Film {titre: 'Inception'})
MATCH (g:Genre {nom: 'Action'})
CREATE (f)-[:APPARTIENT_A]->(g);

MATCH (f:Film {titre: 'Inception'})
MATCH (g:Genre {nom: 'Thriller'})
CREATE (f)-[:APPARTIENT_A]->(g);

-- The Dark Knight : Action + Drame + Thriller
MATCH (f:Film {titre: 'The Dark Knight'})
MATCH (g:Genre {nom: 'Action'})
CREATE (f)-[:APPARTIENT_A]->(g);

MATCH (f:Film {titre: 'The Dark Knight'})
MATCH (g:Genre {nom: 'Drame'})
CREATE (f)-[:APPARTIENT_A]->(g);

MATCH (f:Film {titre: 'The Dark Knight'})
MATCH (g:Genre {nom: 'Thriller'})
CREATE (f)-[:APPARTIENT_A]->(g);

-- Intouchables : Comédie + Drame
MATCH (f:Film {titre: 'Intouchables'})
MATCH (g:Genre {nom: 'Comédie'})
CREATE (f)-[:APPARTIENT_A]->(g);

MATCH (f:Film {titre: 'Intouchables'})
MATCH (g:Genre {nom: 'Drame'})
CREATE (f)-[:APPARTIENT_A]->(g);

-- ============================================
-- 6. CRÉATION DES UTILISATEURS TEST
-- ============================================
-- Utilisateur 1 : Aime les films d'action
CREATE (:Utilisateur {
    id: 'u1',
    email: 'jean.dupont@email.com',
    nom: 'Jean Dupont',
    date_inscription: date('2023-01-15')
});

-- Utilisateur 2 : Aime les comédies et films français
CREATE (:Utilisateur {
    id: 'u2',
    email: 'marie.martin@email.com',
    nom: 'Marie Martin',
    date_inscription: date('2023-02-20')
});

-- Utilisateur 3 : Aime les thrillers et dramas
CREATE (:Utilisateur {
    id: 'u3',
    email: 'pierre.durand@email.com',
    nom: 'Pierre Durand',
    date_inscription: date('2023-03-10')
});

-- ============================================
-- 7. CRÉATION DES RELATIONS UTILISATEUR-FILM (NOTES)
-- ============================================
-- Jean aime les films d'action
MATCH (u:Utilisateur {nom: 'Jean Dupont'})
MATCH (f:Film {titre: 'Inception'})
CREATE (u)-[:AIME {note: 9, date: datetime('2023-01-20T19:30:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Jean Dupont'})
MATCH (f:Film {titre: 'The Dark Knight'})
CREATE (u)-[:AIME {note: 10, date: datetime('2023-01-25T21:00:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Jean Dupont'})
MATCH (f:Film {titre: 'Avengers: Endgame'})
CREATE (u)-[:AIME {note: 8, date: datetime('2023-02-05T20:15:00')}]->(f);

-- Marie aime les films français et comédies
MATCH (u:Utilisateur {nom: 'Marie Martin'})
MATCH (f:Film {titre: 'Intouchables'})
CREATE (u)-[:AIME {note: 9, date: datetime('2023-02-22T18:45:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Marie Martin'})
MATCH (f:Film {titre: 'Le Fabuleux Destin d\'Amélie Poulain'})
CREATE (u)-[:AIME {note: 10, date: datetime('2023-03-01T20:30:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Marie Martin'})
MATCH (f:Film {titre: 'La La Land'})
CREATE (u)-[:AIME {note: 8, date: datetime('2023-03-15T19:00:00')}]->(f);

-- Pierre aime les dramas
MATCH (u:Utilisateur {nom: 'Pierre Durand'})
MATCH (f:Film {titre: 'Forrest Gump'})
CREATE (u)-[:AIME {note: 9, date: datetime('2023-03-12T21:15:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Pierre Durand'})
MATCH (f:Film {titre: 'The Shawshank Redemption'})
CREATE (u)-[:AIME {note: 10, date: datetime('2023-03-18T20:00:00')}]->(f);

MATCH (u:Utilisateur {nom: 'Pierre Durand'})
MATCH (f:Film {titre: 'The Dark Knight'})
CREATE (u)-[:AIME {note: 8, date: datetime('2023-03-20T22:00:00')}]->(f);

RETURN '✅ Données de test créées avec succès !' as message;