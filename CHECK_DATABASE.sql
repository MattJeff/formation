-- ============================================
-- 🔍 DIAGNOSTIC: Vérifier l'état de la base de données
-- ============================================
-- Exécute ce script sur Supabase pour voir quelles colonnes manquent
-- ============================================

-- 1. Vérifier les colonnes de la table profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Vérifier si les colonnes Stripe Connect existent
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_account_id'
  ) AS stripe_account_id_exists,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_account_status'
  ) AS stripe_account_status_exists,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_onboarding_completed'
  ) AS stripe_onboarding_completed_exists;

-- 3. Vérifier les colonnes de la table enrollments
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'stripe_session_id'
  ) AS stripe_session_id_exists,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'stripe_payment_intent_id'
  ) AS stripe_payment_intent_id_exists;

-- 4. Vérifier si la table reviews existe
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'reviews'
) AS reviews_table_exists;

-- 5. Vérifier les colonnes de la table courses
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'average_rating'
  ) AS average_rating_exists,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'total_reviews'
  ) AS total_reviews_exists;
