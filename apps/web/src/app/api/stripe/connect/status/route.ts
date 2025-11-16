// ============================================
// 📊 STRIPE CONNECT STATUS API ROUTE v4-FORCE-REBUILD
// ============================================
// LAST UPDATE: 2025-11-16 18:35 - Force cache invalidation
// Route: GET /api/stripe/connect/status?userId=xxx
// Vérifie le statut du compte Stripe Connect d'un créateur
//
// FLOW:
// 1. Reçoit userId depuis le query string
// 2. Récupère le stripe_account_id depuis Supabase
// 3. Interroge l'API Stripe pour obtenir le statut du compte
// 4. Met à jour le statut dans Supabase
// 5. Retourne le statut détaillé
//
// DEBUGGING:
// - Chercher les logs: [STRIPE CONNECT STATUS]
// - Vérifier .env.local: STRIPE_SECRET_KEY
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeServerInstance } from '@/types/stripe';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// ============================================
// 📨 GET /api/stripe/connect/status
// ============================================

export async function GET(req: NextRequest) {
  try {
    console.log('='.repeat(80));
    console.log('📊 [STRIPE CONNECT STATUS v3-FULL-DEBUG] Début vérification statut...');
    console.log('🕐 Timestamp:', new Date().toISOString());
    console.log('🌐 URL complète:', req.url);

    // Créer un client Supabase frais pour chaque requête (évite le cache)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('✅ Client Supabase créé');
    console.log('🔑 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Service role key présent:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // ============================================
    // 1️⃣ VALIDATION DES DONNÉES
    // ============================================

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('📋 [STRIPE CONNECT STATUS] userId reçu depuis query string:', userId);
    console.log('📋 Type de userId:', typeof userId);

    if (!userId) {
      console.error('❌ [STRIPE CONNECT STATUS] userId manquant');
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // ============================================
    // 2️⃣ RÉCUPÉRATION DU PROFIL
    // ============================================

    console.log('👤 [STRIPE CONNECT STATUS] Récupération profil depuis Supabase...');
    console.log('👤 Query: SELECT * FROM profiles WHERE id =', userId);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, stripe_account_id, stripe_account_status, stripe_onboarding_completed')
      .eq('id', userId)
      .single();

    console.log('👤 [STRIPE CONNECT STATUS] Résultat requête Supabase:');
    console.log('  - Error:', profileError);
    console.log('  - Data:', JSON.stringify(profile, null, 2));

    if (profileError || !profile) {
      console.error('❌ [STRIPE CONNECT STATUS] Profil non trouvé:', profileError);
      console.error('❌ Error code:', profileError?.code);
      console.error('❌ Error message:', profileError?.message);
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    console.log('✅ [STRIPE CONNECT STATUS] Profil trouvé:');
    console.log('  - userId:', profile.id);
    console.log('  - email:', profile.email);
    console.log('  - stripe_account_id:', profile.stripe_account_id);
    console.log('  - stripe_account_status:', profile.stripe_account_status);
    console.log('  - stripe_onboarding_completed:', profile.stripe_onboarding_completed);

    // Si pas de compte Stripe, retourner not_connected
    if (!profile.stripe_account_id) {
      return NextResponse.json({
        status: 'not_connected',
        hasStripeAccount: false,
        canReceivePayments: false,
      }, { status: 200 });
    }

    // ============================================
    // 3️⃣ VÉRIFIER LE STATUT DANS STRIPE
    // ============================================

    console.log('💳 [STRIPE CONNECT STATUS] Vérification compte Stripe...');
    console.log('💳 Account ID à vérifier:', profile.stripe_account_id);

    const stripe = getStripeServerInstance();
    console.log('💳 Stripe client initialisé');
    console.log('💳 Mode Stripe:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST');

    let account;
    try {
      console.log('💳 Appel stripe.accounts.retrieve pour:', profile.stripe_account_id);
      account = await stripe.accounts.retrieve(profile.stripe_account_id);
      console.log('✅ Compte Stripe récupéré avec succès:', {
        id: account.id,
        type: account.type,
        email: account.email,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      });
    } catch (stripeError: any) {
      console.log('❌ [STRIPE CONNECT STATUS] Erreur lors de la récupération du compte Stripe');
      console.log('❌ Error code:', stripeError.code);
      console.log('❌ Error type:', stripeError.type);
      console.log('❌ Error message:', stripeError.message);
      console.log('❌ Full error:', JSON.stringify(stripeError, null, 2));

      // Si le compte n'existe pas en LIVE (mais existe en TEST)
      const isTestAccountError =
        stripeError.code === 'resource_missing' ||
        stripeError.message?.includes('similar object exists in test mode') ||
        stripeError.message?.includes('was a test account created with a testmode key');

      console.log('🔍 Is test account error?', isTestAccountError);

      if (isTestAccountError) {
        console.log('⚠️ [STRIPE CONNECT STATUS] Compte TEST détecté en mode LIVE - nettoyage');
        console.log('⚠️ Account ID à nettoyer:', profile.stripe_account_id);
        console.log('⚠️ Message Stripe:', stripeError.message);

        // Nettoyer l'ancien compte TEST de la BDD
        console.log('🧹 [STRIPE CONNECT STATUS] Nettoyage du compte TEST dans Supabase...');
        const { error: cleanupError } = await supabase
          .from('profiles')
          .update({
            stripe_account_id: null,
            stripe_account_status: 'not_connected',
            stripe_onboarding_completed: false,
          })
          .eq('id', userId);

        if (cleanupError) {
          console.error('❌ Erreur lors du nettoyage:', cleanupError);
        } else {
          console.log('✅ Compte TEST nettoyé de la BDD');
        }

        console.log('📤 Retour: not_connected (compte TEST nettoyé)');
        console.log('='.repeat(80));
        return NextResponse.json({
          status: 'not_connected',
          hasStripeAccount: false,
          canReceivePayments: false,
        }, { status: 200 });
      }
      console.log('❌ Erreur Stripe non gérée, relance de l\'erreur');
      throw stripeError; // Relancer l'erreur si c'est autre chose
    }

    console.log('✅ [STRIPE CONNECT STATUS] Compte récupéré:', {
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    });

    // ============================================
    // 4️⃣ DÉTERMINER LE STATUT
    // ============================================

    let status: 'not_connected' | 'pending' | 'connected' = 'pending';
    let onboardingCompleted = false;

    if (account.charges_enabled && account.payouts_enabled && account.details_submitted) {
      status = 'connected';
      onboardingCompleted = true;
    } else if (account.details_submitted) {
      status = 'pending'; // En attente de vérification par Stripe
    } else {
      status = 'pending'; // Onboarding non terminé
    }

    console.log('📊 [STRIPE CONNECT STATUS] Statut calculé:', { status, onboardingCompleted });

    // ============================================
    // 5️⃣ METTRE À JOUR SUPABASE
    // ============================================

    if (status !== profile.stripe_account_status || onboardingCompleted !== profile.stripe_onboarding_completed) {
      console.log('💾 [STRIPE CONNECT STATUS] Mise à jour Supabase...');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          stripe_account_status: status,
          stripe_onboarding_completed: onboardingCompleted,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [STRIPE CONNECT STATUS] Erreur mise à jour:', updateError);
      } else {
        console.log('✅ [STRIPE CONNECT STATUS] Supabase mis à jour');
      }
    }

    // ============================================
    // 6️⃣ RETOUR DE LA RÉPONSE
    // ============================================

    return NextResponse.json({
      status,
      hasStripeAccount: true,
      canReceivePayments: account.charges_enabled && account.payouts_enabled,
      onboardingCompleted,
      accountDetails: {
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        email: account.email,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [STRIPE CONNECT STATUS] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur lors de la vérification du statut',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
