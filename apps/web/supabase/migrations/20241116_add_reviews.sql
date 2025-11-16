-- ============================================
-- 📝 REVIEWS & RATINGS SYSTEM
-- ============================================
-- Permet aux étudiants de laisser des avis sur les cours
-- Calcul automatique de la moyenne des ratings
-- ============================================

-- 1. Créer la table reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Un utilisateur ne peut laisser qu'un seul avis par cours
  UNIQUE(course_id, user_id)
);

-- 2. Créer index pour performance
CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- 3. Ajouter colonnes rating dans courses
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- 4. Fonction pour mettre à jour les stats du cours
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

-- 5. Trigger pour auto-update des stats
DROP TRIGGER IF EXISTS trigger_update_course_rating ON reviews;
CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating_stats();

-- 6. RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

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

-- 7. Commenter la table
COMMENT ON TABLE reviews IS 'Avis et notes laissés par les étudiants sur les cours';
COMMENT ON COLUMN reviews.rating IS 'Note de 1 à 5 étoiles';
COMMENT ON COLUMN reviews.comment IS 'Commentaire textuel optionnel';
