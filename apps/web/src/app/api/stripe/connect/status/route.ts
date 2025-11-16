// ============================================
// 📊 STRIPE CONNECT STATUS API ROUTE
// ============================================
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

// ============================================
// 🔧 CONFIGURATION
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// ============================================
// 📨 GET /api/stripe/connect/status
// ============================================

export async function GET(req: NextRequest) {
  try {
    console.log('📊 [STRIPE CONNECT STATUS] Début vérification statut...');

    // ============================================
    // 1️⃣ VALIDATION DES DONNÉES
    // ============================================

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('📋 [STRIPE CONNECT STATUS] Données reçues:', { userId });

    if (!userId) {
      console.error('❌ [STRIPE CONNECT STATUS] userId manquant');
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // ============================================
    // 2️⃣ RÉCUPÉRATION DU PROFIL
    // ============================================

    console.log('👤 [STRIPE CONNECT STATUS] Récupération profil:', userId);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_account_id, stripe_account_status, stripe_onboarding_completed')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ [STRIPE CONNECT STATUS] Profil non trouvé:', profileError);
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    console.log('✅ [STRIPE CONNECT STATUS] Profil trouvé:', {
      hasStripeAccount: !!profile.stripe_account_id,
      currentStatus: profile.stripe_account_status,
    });

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

    console.log('💳 [STRIPE CONNECT STATUS] Vérification compte Stripe:', profile.stripe_account_id);

    const stripe = getStripeServerInstance();

    let account;
    try {
      account = await stripe.accounts.retrieve(profile.stripe_account_id);
    } catch (stripeError: any) {
      // Si le compte n'existe pas en LIVE (mais existe en TEST)
      if (stripeError.code === 'resource_missing' || stripeError.message?.includes('similar object exists in test mode')) {
        console.log('⚠️ [STRIPE CONNECT STATUS] Compte TEST détecté en mode LIVE - nettoyage');

        // Nettoyer l'ancien compte TEST de la BDD
        await supabase
          .from('profiles')
          .update({
            stripe_account_id: null,
            stripe_account_status: 'not_connected',
            stripe_onboarding_completed: false,
          })
          .eq('id', userId);

        return NextResponse.json({
          status: 'not_connected',
          hasStripeAccount: false,
          canReceivePayments: false,
        }, { status: 200 });
      }
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
