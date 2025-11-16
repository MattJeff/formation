#!/usr/bin/env node

/**
 * Script pour tester Stripe Connect et voir l'erreur exacte
 */

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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnect() {
  console.log('');
  console.log('='.repeat(70));
  console.log('  TEST STRIPE CONNECT');
  console.log('='.repeat(70));
  console.log('');

  try {
    console.log('🔍 Test 1: Création d\'un compte Express...');
    console.log('');

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: 'test@example.com',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        test: 'true',
      },
    });

    console.log('✅ Compte créé avec succès!');
    console.log('   Account ID:', account.id);
    console.log('');

    console.log('🔍 Test 2: Création d\'un lien d\'onboarding...');
    console.log('');

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/creator/settings/stripe',
      return_url: 'http://localhost:3000/creator/settings/stripe/success',
      type: 'account_onboarding',
    });

    console.log('✅ Lien d\'onboarding créé avec succès!');
    console.log('   URL:', accountLink.url);
    console.log('');

    console.log('🧹 Nettoyage: Suppression du compte de test...');
    await stripe.accounts.del(account.id);
    console.log('✅ Compte supprimé');
    console.log('');

    console.log('='.repeat(70));
    console.log('✅ TOUS LES TESTS SONT PASSÉS');
    console.log('='.repeat(70));
    console.log('');
    console.log('Stripe Connect est correctement configuré!');
    console.log('Vous pouvez maintenant utiliser la fonctionnalité d\'onboarding.');
    console.log('');

  } catch (error) {
    console.log('');
    console.log('='.repeat(70));
    console.log('❌ ERREUR DÉTECTÉE');
    console.log('='.repeat(70));
    console.log('');
    console.log('Type:', error.type);
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('');

    if (error.message.includes('platform-profile')) {
      console.log('🔧 SOLUTION:');
      console.log('');
      console.log('Vous devez configurer votre profil de plateforme dans Stripe:');
      console.log('');
      console.log('1. Allez sur:');
      console.log('   👉 https://dashboard.stripe.com/settings/connect');
      console.log('');
      console.log('2. Cliquez sur "Get started" pour activer Stripe Connect');
      console.log('');
      console.log('3. Choisissez "Express" comme type de compte');
      console.log('');
      console.log('4. Remplissez le profil de la plateforme:');
      console.log('   👉 https://dashboard.stripe.com/settings/connect/platform-profile');
      console.log('');
      console.log('5. Dans "Losses and disputes", sélectionnez:');
      console.log('   "The platform manages losses"');
      console.log('');
      console.log('6. Acceptez les termes et sauvegardez');
      console.log('');
      console.log('7. Relancez ce script pour vérifier');
      console.log('');
    }

    console.log('='.repeat(70));
    console.log('');
    process.exit(1);
  }
}

testStripeConnect();
