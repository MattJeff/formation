-- ============================================
-- 📝 REVIEWS & RATINGS SYSTEM (VERSION SAFE)
-- ============================================
-- Cette version vérifie l'existence avant de créer
-- ============================================

-- 1. Créer la table reviews si elle n'existe pas
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ajouter la contrainte UNIQUE si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_course_id_user_id_key'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_course_id_user_id_key UNIQUE(course_id, user_id);
  END IF;
END $$;

-- 3. Créer les index si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 4. Ajouter colonnes rating dans courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE courses ADD COLUMN average_rating NUMERIC(3,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'total_reviews'
  ) THEN
    ALTER TABLE courses ADD COLUMN total_reviews INTEGER DEFAULT 0;
  END IF;
END $$;

-- 5. Fonction pour mettre à jour les stats du cours
CREATE OR REPLACE FUNCTION update_course_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer la moyenne et le total pour ce cours
  UPDATE courses
  SET
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger pour auto-update des stats
DROP TRIGGER IF EXISTS trigger_update_course_rating ON reviews;
CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating_stats();

-- 7. Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 8. Drop and recreate policies pour éviter les conflits
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Enrolled students can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Tout le monde peut lire les reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

-- Seuls les étudiants inscrits peuvent créer un review
CREATE POLICY "Enrolled students can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.user_id = auth.uid()
      AND enrollments.course_id = reviews.course_id
      AND enrollments.status = 'active'
    )
  );

-- Les utilisateurs peuvent modifier leur propre review
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leur propre review
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- 9. Vérification finale
DO $$
DECLARE
  table_exists BOOLEAN;
  avg_col_exists BOOLEAN;
  total_col_exists BOOLEAN;
BEGIN
  -- Vérifier table reviews
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'reviews'
  ) INTO table_exists;

  -- Vérifier colonnes courses
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'average_rating'
  ) INTO avg_col_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'total_reviews'
  ) INTO total_col_exists;

  IF table_exists AND avg_col_exists AND total_col_exists THEN
    RAISE NOTICE '✅ Migration reviews terminée avec succès';
  ELSE
    RAISE EXCEPTION '❌ Migration reviews incomplète';
  END IF;
END $$;
