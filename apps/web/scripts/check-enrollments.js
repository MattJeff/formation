#!/usr/bin/env node

/**
 * Script pour vérifier les données d'enrollment et leur affichage
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

async function checkEnrollments() {
  console.log('');
  console.log('='.repeat(80));
  console.log('  VÉRIFICATION DES ENROLLMENTS');
  console.log('='.repeat(80));
  console.log('');

  try {
    // Récupérer tous les enrollments payants
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('payment_status', 'paid')
      .order('enrolled_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Erreur:', error);
      throw error;
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('ℹ️  Aucun enrollment payant trouvé');
      console.log('');
      return;
    }

    console.log(`📊 ${enrollments.length} enrollment(s) payant(s) trouvé(s)`);
    console.log('');
    console.log('─'.repeat(80));
    console.log('');

    enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. Enrollment ID: ${enrollment.id.substring(0, 8)}...`);
      console.log(`   Status: ${enrollment.status}`);
      console.log(`   Payment Status: ${enrollment.payment_status}`);
      console.log(`   Payment Amount: ${enrollment.payment_amount}€`);
      console.log(`   Stripe Session ID: ${enrollment.stripe_session_id || 'N/A'}`);
      console.log(`   Stripe Payment Intent ID: ${enrollment.stripe_payment_intent_id || 'N/A'}`);
      console.log(`   Payment ID (fallback): ${enrollment.payment_id || 'N/A'}`);
      console.log(`   Enrolled At: ${new Date(enrollment.enrolled_at).toLocaleString('fr-FR')}`);
      console.log('');

      // Vérifier si le bouton "Rembourser" devrait s'afficher
      const shouldShowRefundButton =
        enrollment.payment_status === 'paid' &&
        (enrollment.stripe_payment_intent_id || enrollment.payment_id) &&
        enrollment.status === 'active';

      if (shouldShowRefundButton) {
        console.log(`   ✅ Bouton "Rembourser" devrait s'afficher`);
      } else {
        console.log(`   ⚠️  Bouton "Rembourser" ne s'affichera pas:`);
        if (enrollment.payment_status !== 'paid') {
          console.log(`      - Payment status: ${enrollment.payment_status} (attendu: "paid")`);
        }
        if (!enrollment.stripe_payment_intent_id && !enrollment.payment_id) {
          console.log(`      - Pas de payment_intent_id`);
        }
        if (enrollment.status !== 'active') {
          console.log(`      - Status: ${enrollment.status} (attendu: "active")`);
        }
      }

      console.log('');
      console.log('─'.repeat(80));
      console.log('');
    });

    // Statistiques globales
    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.payment_amount || 0), 0);
    const withStripeIntent = enrollments.filter(e => e.stripe_payment_intent_id).length;
    const withPaymentId = enrollments.filter(e => e.payment_id && !e.stripe_payment_intent_id).length;
    const withoutPaymentInfo = enrollments.filter(e => !e.stripe_payment_intent_id && !e.payment_id).length;

    console.log('📈 STATISTIQUES:');
    console.log('');
    console.log(`   Total revenus: ${totalRevenue.toFixed(2)}€`);
    console.log(`   Avec stripe_payment_intent_id: ${withStripeIntent}/${enrollments.length}`);
    console.log(`   Avec payment_id (fallback): ${withPaymentId}/${enrollments.length}`);
    console.log(`   Sans info de paiement: ${withoutPaymentInfo}/${enrollments.length}`);
    console.log('');

    // Vérifier si les montants sont corrects (pas de double division)
    const hasCorrectAmounts = enrollments.every(e => {
      const amount = e.payment_amount || 0;
      return amount >= 1; // Si tous les montants sont >= 1€, c'est bon
    });

    if (hasCorrectAmounts) {
      console.log('✅ Tous les montants sont >= 1€ (pas de bug de division par 100)');
    } else {
      console.log('⚠️  Certains montants sont < 1€ (possible bug de division)');
    }
    console.log('');

    console.log('='.repeat(80));
    console.log('✅ VÉRIFICATION TERMINÉE');
    console.log('='.repeat(80));
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    console.error('');
    process.exit(1);
  }
}

checkEnrollments();
