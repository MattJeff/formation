#!/usr/bin/env node

/**
 * Script pour appliquer la migration Stripe Connect à Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement manuellement
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('');
  console.log('='.repeat(70));
  console.log('  APPLICATION MIGRATION: Stripe Connect');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Vérifier si les colonnes existent déjà
    console.log('🔍 Vérification des colonnes existantes...');

    const { data: profiles, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Erreur lors de la vérification:', selectError.message);
      process.exit(1);
    }

    const existingColumns = profiles && profiles[0] ? Object.keys(profiles[0]) : [];
    console.log('📋 Colonnes existantes:', existingColumns.join(', '));

    const hasStripeColumns = existingColumns.includes('stripe_account_id');

    if (hasStripeColumns) {
      console.log('');
      console.log('✅ Les colonnes Stripe Connect existent déjà!');
      console.log('');
      console.log('Colonnes présentes:');
      console.log('  - stripe_account_id');
      console.log('  - stripe_account_status');
      console.log('  - stripe_onboarding_completed');
      console.log('');
      console.log('Aucune migration nécessaire.');
      console.log('');
      return;
    }

    console.log('');
    console.log('⚠️  Les colonnes Stripe Connect n\'existent pas encore.');
    console.log('');
    console.log('Pour appliquer la migration, vous devez exécuter le SQL suivant');
    console.log('dans Supabase SQL Editor:');
    console.log('');
    console.log('👉 https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql/new');
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    console.log(`-- Ajouter les colonnes pour Stripe Connect
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
COMMENT ON COLUMN profiles.stripe_onboarding_completed IS 'True si onboarding Stripe complété';`);
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    console.log('Après avoir exécuté le SQL, relancez ce script pour vérifier.');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    console.error('');
    process.exit(1);
  }
}

applyMigration();
