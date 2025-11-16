// ============================================
// 🔗 STRIPE CONNECT ONBOARDING API ROUTE
// ============================================
// Route: POST /api/stripe/connect/onboarding
// Crée un compte Stripe Connect pour un créateur et génère le lien d'onboarding
//
// FLOW:
// 1. Reçoit userId depuis le frontend
// 2. Vérifie si le créateur a déjà un compte Stripe
// 3. Valide que le compte existant est toujours valide (gère TEST vs LIVE)
// 4. Crée un nouveau compte Stripe Express si nécessaire
// 5. Génère un lien d'onboarding AccountLink
// 6. Stocke l'account ID dans Supabase
// 7. Retourne l'URL d'onboarding pour redirection
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeServerInstance } from '@/types/stripe';

// ============================================
// 📨 POST /api/stripe/connect/onboarding
// ============================================

export async function POST(req: NextRequest) {
  try {
    // Créer un client Supabase frais pour chaque requête (évite le cache)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validation des données
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Récupération du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, stripe_account_id, stripe_account_status')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    // Créer ou récupérer le compte Stripe
    const stripe = getStripeServerInstance();
    let accountId = profile.stripe_account_id;

    // Vérifier si le compte existant est valide
    let needNewAccount = !accountId;

    if (accountId) {
      try {
        await stripe.accounts.retrieve(accountId);
      } catch (error: any) {
        const isTestAccountError =
          error.code === 'resource_missing' ||
          error.message?.includes('similar object exists in test mode') ||
          error.message?.includes('was a test account created with a testmode key');

        if (isTestAccountError) {
          needNewAccount = true;
          accountId = null;
        } else {
          throw error;
        }
      }
    }

    if (needNewAccount) {
      // Créer un nouveau compte Stripe Express
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email: profile.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          user_id: userId,
          platform: 'plateforme-formation',
        },
      });

      accountId = account.id;

      // Stocker l'account ID dans Supabase
      await supabase
        .from('profiles')
        .update({
          stripe_account_id: accountId,
          stripe_account_status: 'pending',
        })
        .eq('id', userId);
    }

    // Générer le lien d'onboarding
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe/success`;
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: accountId,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erreur création lien onboarding Stripe Connect:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création du lien d\'onboarding',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
