-- ============================================
-- RLS POLICIES - Plateforme de Formation
-- ============================================
--
-- IMPORTANT: Exécuter ce script dans Supabase SQL Editor
-- pour activer la sécurité au niveau des lignes (RLS)
--
-- ============================================

-- ============================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLICIES POUR LA TABLE `profiles`
-- ============================================

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

-- Les utilisateurs peuvent VOIR leurs propres inscriptions
-- Les créateurs peuvent VOIR les inscriptions à leurs cours
CREATE POLICY "Users can view own enrollments and creators can view course enrollments"
ON enrollments FOR SELECT
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = enrollments.course_id
    AND courses.creator_id = auth.uid()
  )
);

-- Les utilisateurs authentifiés peuvent S'INSCRIRE aux cours
CREATE POLICY "Authenticated users can enroll in courses"
ON enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent MODIFIER leurs propres inscriptions
CREATE POLICY "Users can update own enrollments"
ON enrollments FOR UPDATE
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent SUPPRIMER leurs propres inscriptions
CREATE POLICY "Users can delete own enrollments"
ON enrollments FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 7. POLICIES POUR LA TABLE `lesson_progress`
-- ============================================

-- Les utilisateurs peuvent VOIR leur propre progression
-- Les créateurs peuvent VOIR la progression sur leurs cours
CREATE POLICY "Users can view own progress and creators can view course progress"
ON lesson_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.id = lesson_progress.enrollment_id
    AND enrollments.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM enrollments
    INNER JOIN courses ON courses.id = enrollments.course_id
    WHERE enrollments.id = lesson_progress.enrollment_id
    AND courses.creator_id = auth.uid()
  )
);

-- Les utilisateurs peuvent CRÉER leur progression
CREATE POLICY "Users can insert own progress"
ON lesson_progress FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.id = enrollment_id
    AND enrollments.user_id = auth.uid()
  )
);

-- Les utilisateurs peuvent MODIFIER leur progression
CREATE POLICY "Users can update own progress"
ON lesson_progress FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.id = enrollment_id
    AND enrollments.user_id = auth.uid()
  )
);

-- Les utilisateurs peuvent SUPPRIMER leur progression
CREATE POLICY "Users can delete own progress"
ON lesson_progress FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.id = enrollment_id
    AND enrollments.user_id = auth.uid()
  )
);

-- ============================================
-- 8. POLICIES POUR LA TABLE `reviews`
-- ============================================

-- Tout le monde peut VOIR les avis publiés
CREATE POLICY "Published reviews are viewable by everyone"
ON reviews FOR SELECT
USING (status = 'published');

-- Les utilisateurs inscrits peuvent CRÉER des avis
CREATE POLICY "Enrolled users can create reviews"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = reviews.course_id
  )
);

-- Les utilisateurs peuvent MODIFIER leurs propres avis
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent SUPPRIMER leurs propres avis
-- Les créateurs peuvent SUPPRIMER les avis sur leurs cours (modération)
CREATE POLICY "Users can delete own reviews and creators can delete course reviews"
ON reviews FOR DELETE
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = reviews.course_id
    AND courses.creator_id = auth.uid()
  )
);

-- ============================================
-- 9. VÉRIFICATION DES POLICIES
-- ============================================

-- Exécuter ces commandes pour vérifier que les policies sont actives:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- FIN DU SCRIPT
-- ============================================
