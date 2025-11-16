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
    // Créer un client Supabase frais pour chaque requête (évite le cache)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validation des données
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Récupération du profil (utilise maybeSingle pour éviter les erreurs de cache)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, stripe_account_id, stripe_account_status, stripe_onboarding_completed, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    // Si pas de compte Stripe, retourner not_connected
    if (!profile.stripe_account_id) {
      return NextResponse.json({
        status: 'not_connected',
        hasStripeAccount: false,
        canReceivePayments: false,
      }, { status: 200 });
    }

    // Vérifier le statut dans Stripe
    const stripe = getStripeServerInstance();

    let account;
    try {
      account = await stripe.accounts.retrieve(profile.stripe_account_id);
    } catch (stripeError: any) {
      // Si le compte n'existe pas en LIVE (mais existe en TEST)
      const isTestAccountError =
        stripeError.code === 'resource_missing' ||
        stripeError.message?.includes('similar object exists in test mode') ||
        stripeError.message?.includes('was a test account created with a testmode key');

      if (isTestAccountError) {
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
      throw stripeError;
    }

    // Déterminer le statut
    let status: 'not_connected' | 'pending' | 'connected' = 'pending';
    let onboardingCompleted = false;

    if (account.charges_enabled && account.payouts_enabled && account.details_submitted) {
      status = 'connected';
      onboardingCompleted = true;
    } else if (account.details_submitted) {
      status = 'pending';
    } else {
      status = 'pending';
    }

    // Mettre à jour Supabase si nécessaire
    if (status !== profile.stripe_account_status || onboardingCompleted !== profile.stripe_onboarding_completed) {
      await supabase
        .from('profiles')
        .update({
          stripe_account_status: status,
          stripe_onboarding_completed: onboardingCompleted,
        })
        .eq('id', userId);
    }

    // Retourner le statut
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
    console.error('Erreur vérification statut Stripe Connect:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la vérification du statut',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
