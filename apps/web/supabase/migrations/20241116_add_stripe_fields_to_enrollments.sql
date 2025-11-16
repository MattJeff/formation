-- ============================================
-- MIGRATION: Ajouter champs Stripe à enrollments
-- ============================================
-- Date: 2024-11-16
-- Description: Ajoute les colonnes Stripe nécessaires pour tracker les paiements
--
-- Colonnes ajoutées:
-- - stripe_session_id: ID de la session de checkout Stripe
-- - stripe_payment_intent_id: ID du payment intent Stripe (pour les remboursements)
-- ============================================

-- Ajouter les colonnes si elles n'existent pas
DO $$
BEGIN
  -- Ajouter stripe_session_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments'
    AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE enrollments
    ADD COLUMN stripe_session_id TEXT;

    CREATE INDEX IF NOT EXISTS idx_enrollments_stripe_session_id
    ON enrollments(stripe_session_id);

    RAISE NOTICE 'Colonne stripe_session_id ajoutée';
  ELSE
    RAISE NOTICE 'Colonne stripe_session_id existe déjà';
  END IF;

  -- Ajouter stripe_payment_intent_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments'
    AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE enrollments
    ADD COLUMN stripe_payment_intent_id TEXT;

    CREATE INDEX IF NOT EXISTS idx_enrollments_stripe_payment_intent_id
    ON enrollments(stripe_payment_intent_id);

    RAISE NOTICE 'Colonne stripe_payment_intent_id ajoutée';
  ELSE
    RAISE NOTICE 'Colonne stripe_payment_intent_id existe déjà';
  END IF;

END $$;

-- Vérification
DO $$
DECLARE
  session_exists BOOLEAN;
  intent_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments'
    AND column_name = 'stripe_session_id'
  ) INTO session_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments'
    AND column_name = 'stripe_payment_intent_id'
  ) INTO intent_exists;

  IF session_exists AND intent_exists THEN
    RAISE NOTICE '✅ Migration terminée avec succès';
  ELSE
    RAISE EXCEPTION '❌ Migration échouée';
  END IF;
END $$;
