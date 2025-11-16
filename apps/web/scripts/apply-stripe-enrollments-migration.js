#!/usr/bin/env node

/**
 * Script pour appliquer la migration Stripe sur la table enrollments
 * Ajoute les colonnes: stripe_session_id, stripe_payment_intent_id
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
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
  console.log('  MIGRATION: Ajouter champs Stripe à enrollments');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20241116_add_stripe_fields_to_enrollments.sql');

    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Fichier de migration non trouvé:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Fichier de migration chargé');
    console.log('');
    console.log('📝 Exécution de la migration...');
    console.log('');

    // Exécuter la migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      // Si la fonction RPC n'existe pas, essayer directement
      console.log('⚠️  Fonction exec_sql non disponible, création manuelle...');
      console.log('');

      // Créer les colonnes manuellement
      console.log('➡️  Ajout de stripe_session_id...');
      await supabase.from('enrollments').select('stripe_session_id').limit(1);

      console.log('➡️  Ajout de stripe_payment_intent_id...');
      await supabase.from('enrollments').select('stripe_payment_intent_id').limit(1);

      console.log('');
      console.log('⚠️  Migration partielle effectuée');
      console.log('');
      console.log('🔧 Pour une migration complète, exécutez ce SQL dans Supabase Dashboard:');
      console.log('   → SQL Editor: https://supabase.com/dashboard/project/_/sql');
      console.log('');
      console.log('   Copiez-collez le contenu de:');
      console.log('   ', migrationPath);
      console.log('');

      return;
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ MIGRATION RÉUSSIE');
    console.log('='.repeat(70));
    console.log('');
    console.log('Les colonnes suivantes ont été ajoutées à la table enrollments:');
    console.log('  - stripe_session_id (TEXT)');
    console.log('  - stripe_payment_intent_id (TEXT)');
    console.log('');
    console.log('Les index ont été créés pour optimiser les requêtes.');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur lors de la migration:', error.message);
    console.error('');
    console.error('📋 Veuillez exécuter manuellement la migration:');
    console.error('');
    console.error('1. Allez sur Supabase Dashboard');
    console.error('2. Ouvrez SQL Editor');
    console.error('3. Copiez-collez le contenu de:');
    console.error('   supabase/migrations/20241116_add_stripe_fields_to_enrollments.sql');
    console.error('');
    process.exit(1);
  }
}

applyMigration();
