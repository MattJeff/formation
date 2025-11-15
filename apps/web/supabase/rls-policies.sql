-- ============================================
-- RLS POLICIES - Plateforme de Formation
-- ============================================
--
-- IMPORTANT: Exécuter ce script dans Supabase SQL Editor
-- pour activer la sécurité au niveau des lignes (RLS)
--
-- Ce script supprime les policies existantes puis les recrée
-- ============================================

-- ============================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================
-- NOTE: enrollments et lesson_progress ont déjà RLS activé dans leurs migrations
-- NOTE: reviews n'existe pas encore, sera ajouté plus tard

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLICIES POUR LA TABLE `profiles`
-- ============================================

-- Supprimer les policies existantes
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Tout le monde peut VOIR tous les profils publics
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Seul l'utilisateur peut MODIFIER son propre profil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Les utilisateurs peuvent INSÉRER leur profil à la création
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. POLICIES POUR LA TABLE `courses`
-- ============================================

-- Supprimer les policies existantes
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Creators can insert own courses" ON courses;
DROP POLICY IF EXISTS "Creators can update own courses" ON courses;
DROP POLICY IF EXISTS "Creators can delete own courses" ON courses;

-- Tout le monde peut VOIR les cours publiés
CREATE POLICY "Published courses are viewable by everyone"
ON courses FOR SELECT
USING (status = 'published' OR creator_id = auth.uid());

-- Seul le créateur peut INSÉRER ses cours
CREATE POLICY "Creators can insert own courses"
ON courses FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Seul le créateur peut MODIFIER ses cours
CREATE POLICY "Creators can update own courses"
ON courses FOR UPDATE
USING (auth.uid() = creator_id);

-- Seul le créateur peut SUPPRIMER ses cours
CREATE POLICY "Creators can delete own courses"
ON courses FOR DELETE
USING (auth.uid() = creator_id);

-- ============================================
-- 4. POLICIES POUR LA TABLE `sections`
-- ============================================

-- Supprimer les policies existantes
DROP POLICY IF EXISTS "Sections are viewable if course is published" ON sections;
DROP POLICY IF EXISTS "Course creators can insert sections" ON sections;
DROP POLICY IF EXISTS "Course creators can update sections" ON sections;
DROP POLICY IF EXISTS "Course creators can delete sections" ON sections;

-- Tout le monde peut VOIR les sections des cours publiés
CREATE POLICY "Sections are viewable if course is published"
ON sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = sections.course_id
    AND (courses.status = 'published' OR courses.creator_id = auth.uid())
  )
);

-- Seul le créateur du cours peut INSÉRER des sections
CREATE POLICY "Course creators can insert sections"
ON sections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_id
    AND courses.creator_id = auth.uid()
  )
);

-- Seul le créateur du cours peut MODIFIER ses sections
CREATE POLICY "Course creators can update sections"
ON sections FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_id
    AND courses.creator_id = auth.uid()
  )
);

-- Seul le créateur du cours peut SUPPRIMER ses sections
CREATE POLICY "Course creators can delete sections"
ON sections FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_id
    AND courses.creator_id = auth.uid()
  )
);

-- ============================================
-- 5. POLICIES POUR LA TABLE `lessons`
-- ============================================

-- Supprimer les policies existantes
DROP POLICY IF EXISTS "Lessons are viewable if course is published" ON lessons;
DROP POLICY IF EXISTS "Course creators can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Course creators can update lessons" ON lessons;
DROP POLICY IF EXISTS "Course creators can delete lessons" ON lessons;

-- Tout le monde peut VOIR les leçons des cours publiés
CREATE POLICY "Lessons are viewable if course is published"
ON lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM sections
    INNER JOIN courses ON courses.id = sections.course_id
    WHERE sections.id = lessons.section_id
    AND (courses.status = 'published' OR courses.creator_id = auth.uid())
  )
);

-- Seul le créateur du cours peut INSÉRER des leçons
CREATE POLICY "Course creators can insert lessons"
ON lessons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sections
    INNER JOIN courses ON courses.id = sections.course_id
    WHERE sections.id = section_id
    AND courses.creator_id = auth.uid()
  )
);

-- Seul le créateur du cours peut MODIFIER ses leçons
CREATE POLICY "Course creators can update lessons"
ON lessons FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM sections
    INNER JOIN courses ON courses.id = sections.course_id
    WHERE sections.id = section_id
    AND courses.creator_id = auth.uid()
  )
);

-- Seul le créateur du cours peut SUPPRIMER ses leçons
CREATE POLICY "Course creators can delete lessons"
ON lessons FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM sections
    INNER JOIN courses ON courses.id = sections.course_id
    WHERE sections.id = section_id
    AND courses.creator_id = auth.uid()
  )
);

-- ============================================
-- 6. POLICIES POUR LA TABLE `enrollments`
-- ============================================
-- NOTE: Les policies pour enrollments sont définies dans
-- supabase/migrations/add_enrollments.sql
-- Cette section est commentée pour éviter les conflits

-- ============================================
-- 7. POLICIES POUR LA TABLE `lesson_progress`
-- ============================================
-- NOTE: Les policies pour lesson_progress sont définies dans
-- supabase/migrations/add_lesson_progress.sql
-- Cette section est commentée pour éviter les conflits

-- ============================================
-- 8. POLICIES POUR LA TABLE `reviews`
-- ============================================
-- NOTE: La table reviews n'existe pas encore dans la base de données
-- Les policies seront ajoutées lors de la création de cette table

-- ============================================
-- 9. VÉRIFICATION DES POLICIES
-- ============================================

-- Exécuter ces commandes pour vérifier que les policies sont actives:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- FIN DU SCRIPT
-- ============================================
