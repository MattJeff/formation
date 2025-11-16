-- ============================================
-- 💳 MIGRATION: Ajouter colonnes Stripe Connect
-- ============================================
-- Ajoute les colonnes nécessaires pour gérer Stripe Connect
-- et les paiements aux créateurs avec commission 4%
-- ============================================

-- Ajouter les colonnes pour Stripe Connect
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_status TEXT DEFAULT 'not_connected',
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT FALSE;

-- Créer un index pour rechercher rapidement les créateurs connectés
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_status ON profiles(stripe_account_status);

-- Commenter les colonnes pour documentation
COMMENT ON COLUMN profiles.stripe_account_id IS 'ID du compte Stripe Connect du créateur';
COMMENT ON COLUMN profiles.stripe_account_status IS 'Statut du compte Stripe: not_connected | pending | connected';
COMMENT ON COLUMN profiles.stripe_onboarding_completed IS 'True si l''onboarding Stripe est complété';
