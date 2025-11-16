#!/usr/bin/env node

/**
 * Script pour récupérer les payment_intent_id manquants depuis Stripe
 * et les ajouter aux enrollments existants
 */

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
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

// On va créer deux instances Stripe: une pour test, une pour live
const stripeTest = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const stripeLive = process.env.STRIPE_SECRET_KEY_LIVE
  ? new Stripe(process.env.STRIPE_SECRET_KEY_LIVE, { apiVersion: '2023-10-16' })
  : null;

// Fonction pour choisir la bonne instance Stripe
function getStripeInstance(sessionId) {
  if (sessionId.startsWith('cs_live_')) {
    if (!stripeLive) {
      throw new Error('STRIPE_SECRET_KEY_LIVE non configuré pour les sessions LIVE');
    }
    return stripeLive;
  }
  return stripeTest;
}

async function backfillPaymentIntents() {
  console.log('');
  console.log('='.repeat(80));
  console.log('  BACKFILL: Récupération des payment_intent_id manquants');
  console.log('='.repeat(80));
  console.log('');

  try {
    // Trouver tous les enrollments avec session_id mais sans payment_intent_id
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('payment_status', 'paid')
      .not('stripe_session_id', 'is', null)
      .is('stripe_payment_intent_id', null);

    if (error) {
      console.error('❌ Erreur récupération enrollments:', error);
      throw error;
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('✅ Aucun enrollment à mettre à jour');
      console.log('   Tous les enrollments ont déjà leur payment_intent_id');
      console.log('');
      return;
    }

    console.log(`📊 ${enrollments.length} enrollment(s) à mettre à jour`);
    console.log('');

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const enrollment of enrollments) {
      console.log(`🔍 Traitement enrollment ${enrollment.id.substring(0, 8)}...`);
      console.log(`   Session ID: ${enrollment.stripe_session_id}`);

      try {
        // Choisir la bonne instance Stripe (test ou live)
        const stripe = getStripeInstance(enrollment.stripe_session_id);
        console.log(`   Mode: ${enrollment.stripe_session_id.startsWith('cs_live_') ? 'LIVE' : 'TEST'}`);

        // Récupérer la session depuis Stripe
        const session = await stripe.checkout.sessions.retrieve(enrollment.stripe_session_id);

        if (!session.payment_intent) {
          console.log(`   ⚠️  Pas de payment_intent dans la session (peut-être gratuit?)`);
          skipped++;
          console.log('');
          continue;
        }

        console.log(`   ✓ Payment Intent trouvé: ${session.payment_intent}`);

        // Mettre à jour l'enrollment
        const { error: updateError } = await supabase
          .from('enrollments')
          .update({
            stripe_payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', enrollment.id);

        if (updateError) {
          console.error(`   ❌ Erreur mise à jour:`, updateError);
          errors++;
        } else {
          console.log(`   ✅ Enrollment mis à jour`);
          updated++;
        }

        console.log('');

      } catch (stripeError) {
        console.error(`   ❌ Erreur Stripe:`, stripeError.message);
        errors++;
        console.log('');
      }
    }

    console.log('─'.repeat(80));
    console.log('');
    console.log('📈 RÉSULTATS:');
    console.log('');
    console.log(`   ✅ Mis à jour: ${updated}`);
    console.log(`   ⚠️  Ignorés: ${skipped}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log('');
    console.log('='.repeat(80));
    console.log('✅ BACKFILL TERMINÉ');
    console.log('='.repeat(80));
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    console.error('');
    process.exit(1);
  }
}

backfillPaymentIntents();
