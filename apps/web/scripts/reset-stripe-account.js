#!/usr/bin/env node

/**
 * Script pour réinitialiser le compte Stripe Connect d'un utilisateur
 * Utile quand on passe de LIVE à TEST mode
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

async function resetStripeAccount() {
  const userId = process.argv[2];

  console.log('');
  console.log('='.repeat(70));
  console.log('  RÉINITIALISATION COMPTE STRIPE CONNECT');
  console.log('='.repeat(70));
  console.log('');

  if (!userId) {
    console.error('❌ Erreur: userId requis');
    console.log('');
    console.log('Usage: node reset-stripe-account.js <userId>');
    console.log('');
    process.exit(1);
  }

  try {
    // Récupérer le profil actuel
    console.log('🔍 Récupération du profil:', userId);
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, stripe_account_id, stripe_account_status')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error('❌ Profil non trouvé:', fetchError?.message);
      process.exit(1);
    }

    console.log('');
    console.log('📋 Profil actuel:');
    console.log('   Email:', profile.email);
    console.log('   Stripe Account ID:', profile.stripe_account_id || 'AUCUN');
    console.log('   Statut:', profile.stripe_account_status || 'not_connected');
    console.log('');

    if (!profile.stripe_account_id) {
      console.log('ℹ️  Aucun compte Stripe à réinitialiser');
      console.log('');
      return;
    }

    // Réinitialiser le compte
    console.log('🔄 Réinitialisation en cours...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_account_id: null,
        stripe_account_status: 'not_connected',
        stripe_onboarding_completed: false,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError.message);
      process.exit(1);
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ COMPTE STRIPE RÉINITIALISÉ AVEC SUCCÈS');
    console.log('='.repeat(70));
    console.log('');
    console.log('Le profil a été mis à jour:');
    console.log('  - stripe_account_id: NULL');
    console.log('  - stripe_account_status: not_connected');
    console.log('  - stripe_onboarding_completed: false');
    console.log('');
    console.log('Vous pouvez maintenant relancer l\'onboarding avec la clé TEST.');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    console.error('');
    process.exit(1);
  }
}

resetStripeAccount();
