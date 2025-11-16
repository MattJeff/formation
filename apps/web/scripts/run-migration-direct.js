#!/usr/bin/env node

/**
 * Script pour exécuter la migration SQL directement via Supabase
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

async function runMigration() {
  console.log('');
  console.log('='.repeat(70));
  console.log('  MIGRATION DIRECTE: Ajouter champs Stripe à enrollments');
  console.log('='.repeat(70));
  console.log('');

  try {
    console.log('📝 Vérification des colonnes existantes...');

    // Vérifier si les colonnes existent déjà
    const { data: existingColumns, error: checkError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Erreur vérification:', checkError);
      throw checkError;
    }

    const hasStripeSessionId = existingColumns?.[0]?.hasOwnProperty('stripe_session_id');
    const hasStripePaymentIntentId = existingColumns?.[0]?.hasOwnProperty('stripe_payment_intent_id');

    if (hasStripeSessionId && hasStripePaymentIntentId) {
      console.log('✅ Les colonnes existent déjà!');
      console.log('');
      console.log('Colonnes présentes:');
      console.log('  - stripe_session_id ✓');
      console.log('  - stripe_payment_intent_id ✓');
      console.log('');
      console.log('='.repeat(70));
      console.log('✅ MIGRATION DÉJÀ APPLIQUÉE');
      console.log('='.repeat(70));
      console.log('');
      return;
    }

    console.log('');
    console.log('⚠️  Les colonnes n\'existent pas encore dans la table.');
    console.log('');
    console.log('🔧 Pour ajouter ces colonnes, vous devez:');
    console.log('');
    console.log('1. Aller sur Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/' + process.env.NEXT_PUBLIC_SUPABASE_URL.split('.')[0].split('//')[1] + '/sql');
    console.log('');
    console.log('2. Créer une nouvelle requête et coller ce SQL:');
    console.log('');
    console.log('─'.repeat(70));
    console.log('');

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', '20241116_add_stripe_fields_to_enrollments.sql'),
      'utf8'
    );

    console.log(migrationSQL);
    console.log('');
    console.log('─'.repeat(70));
    console.log('');
    console.log('3. Cliquer sur "Run"');
    console.log('');
    console.log('4. Vérifier les messages de succès dans l\'output');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    console.error('');
    process.exit(1);
  }
}

runMigration();
