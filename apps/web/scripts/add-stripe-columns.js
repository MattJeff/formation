#!/usr/bin/env node

/**
 * Script pour afficher le SQL à exécuter manuellement dans Supabase
 */

console.log('');
console.log('='.repeat(70));
console.log('  MIGRATION: Ajouter colonnes Stripe Connect à profiles');
console.log('='.repeat(70));
console.log('');
console.log('Exécutez ce SQL dans Supabase SQL Editor:');
console.log('https://supabase.com/dashboard > SQL Editor > New Query');
console.log('');
console.log('='.repeat(70));
console.log('');

const sql = `-- Ajouter les colonnes pour Stripe Connect
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_status TEXT DEFAULT 'not_connected',
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT FALSE;

-- Créer des index pour performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_status ON profiles(stripe_account_status);

-- Commentaires pour documentation
COMMENT ON COLUMN profiles.stripe_account_id IS 'ID du compte Stripe Connect du créateur';
COMMENT ON COLUMN profiles.stripe_account_status IS 'Statut du compte: not_connected | pending | connected';
COMMENT ON COLUMN profiles.stripe_onboarding_completed IS 'True si onboarding Stripe complété';`;

console.log(sql);
console.log('');
console.log('='.repeat(70));
console.log('');
console.log('Après avoir exécuté le SQL, appuyez sur Entrée pour continuer...');
console.log('');
