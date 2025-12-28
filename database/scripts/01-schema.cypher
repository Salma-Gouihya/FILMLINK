-- ============================================
-- 1. SUPPRESSION DES CONTRAINTES EXISTANTES (si nécessaire)
-- ============================================
DROP CONSTRAINT user_id IF EXISTS;
DROP CONSTRAINT film_id IF EXISTS;
DROP CONSTRAINT acteur_id IF EXISTS;
DROP CONSTRAINT genre_id IF EXISTS;
DROP INDEX film_titre IF EXISTS;
DROP INDEX acteur_nom IF EXISTS;
DROP INDEX genre_nom IF EXISTS;

-- ============================================
-- 2. CRÉATION DES CONTRAINTES D'UNICITÉ
-- ============================================
-- Contrainte sur l'ID utilisateur
CREATE CONSTRAINT user_id FOR (u:Utilisateur) REQUIRE u.id IS UNIQUE;

-- Contrainte sur l'ID film
CREATE CONSTRAINT film_id FOR (f:Film) REQUIRE f.id IS UNIQUE;

-- Contrainte sur l'ID acteur
CREATE CONSTRAINT acteur_id FOR (a:Acteur) REQUIRE a.id IS UNIQUE;

-- Contrainte sur l'ID genre
CREATE CONSTRAINT genre_id FOR (g:Genre) REQUIRE g.id IS UNIQUE;

-- ============================================
-- 3. CRÉATION DES INDEX POUR LA RECHERCHE
-- ============================================
-- Index sur le titre des films (recherche textuelle)
CREATE INDEX film_titre FOR (f:Film) ON (f.titre);

-- Index sur le nom des acteurs
CREATE INDEX acteur_nom FOR (a:Acteur) ON (a.nom);

-- Index sur le nom des genres
CREATE INDEX genre_nom FOR (g:Genre) ON (g.nom);

-- Index sur l'email utilisateur (pour la connexion)
CREATE INDEX user_email FOR (u:Utilisateur) ON (u.email);

-- ============================================
-- 4. VÉRIFICATION
-- ============================================
-- Voir toutes les contraintes et index créés
SHOW CONSTRAINTS;
SHOW INDEXES;