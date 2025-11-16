// ============================================
// 🔗 STRIPE CONNECT ONBOARDING API ROUTE
// ============================================
// Route: POST /api/stripe/connect/onboarding
// Crée un compte Stripe Connect pour un créateur et génère le lien d'onboarding
//
// FLOW:
// 1. Reçoit userId depuis le frontend
// 2. Vérifie si le créateur a déjà un compte Stripe
// 3. Crée un nouveau compte Stripe Express si nécessaire
// 4. Génère un lien d'onboarding AccountLink
// 5. Stocke l'account ID dans Supabase
// 6. Retourne l'URL d'onboarding pour redirection
//
// DEBUGGING:
// - Chercher les logs: [STRIPE CONNECT ONBOARDING]
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

// ============================================
// 📨 POST /api/stripe/connect/onboarding
// ============================================

export async function POST(req: NextRequest) {
  try {
    console.log('🔗 [STRIPE CONNECT ONBOARDING] Début onboarding... (VERSION v2-with-validation)');

    // ============================================
    // 1️⃣ VALIDATION DES DONNÉES
    // ============================================

    const body = await req.json();
    const { userId } = body;

    console.log('📋 [STRIPE CONNECT ONBOARDING] Données reçues:', { userId });

    if (!userId) {
      console.error('❌ [STRIPE CONNECT ONBOARDING] userId manquant');
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // ============================================
    // 2️⃣ RÉCUPÉRATION DU PROFIL
    // ============================================

    console.log('👤 [STRIPE CONNECT ONBOARDING] Récupération profil:', userId);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, stripe_account_id, stripe_account_status')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ [STRIPE CONNECT ONBOARDING] Profil non trouvé:', profileError);
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    console.log('✅ [STRIPE CONNECT ONBOARDING] Profil trouvé:', {
      email: profile.email,
      hasStripeAccount: !!profile.stripe_account_id,
    });

    // ============================================
    // 3️⃣ CRÉER OU RÉCUPÉRER LE COMPTE STRIPE
    // ============================================

    const stripe = getStripeServerInstance();
    let accountId = profile.stripe_account_id;

    // Vérifier si le compte existant est valide
    let needNewAccount = !accountId;

    if (accountId) {
      try {
        console.log('🔍 [STRIPE CONNECT ONBOARDING] Vérification compte existant:', accountId);
        await stripe.accounts.retrieve(accountId);
        console.log('♻️  [STRIPE CONNECT ONBOARDING] Compte existant valide:', accountId);
      } catch (error: any) {
        const isTestAccountError =
          error.code === 'resource_missing' ||
          error.message?.includes('similar object exists in test mode') ||
          error.message?.includes('was a test account created with a testmode key');

        if (isTestAccountError) {
          console.log('⚠️ [STRIPE CONNECT ONBOARDING] Compte TEST détecté - création nouveau compte LIVE');
          needNewAccount = true;
          accountId = null;
        } else {
          throw error;
        }
      }
    }

    if (needNewAccount) {
      // Créer un nouveau compte Stripe Express
      console.log('💳 [STRIPE CONNECT ONBOARDING] Création compte Stripe Express...');

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

      console.log('✅ [STRIPE CONNECT ONBOARDING] Compte créé:', accountId);

      // Stocker l'account ID dans Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          stripe_account_id: accountId,
          stripe_account_status: 'pending',
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [STRIPE CONNECT ONBOARDING] Erreur mise à jour profil:', updateError);
        // On continue quand même, le compte Stripe est créé
      }

      console.log('✅ [STRIPE CONNECT ONBOARDING] Account ID stocké dans Supabase');
    }

    // ============================================
    // 4️⃣ GÉNÉRER LE LIEN D'ONBOARDING
    // ============================================

    console.log('🔗 [STRIPE CONNECT ONBOARDING] Génération lien d\'onboarding...');

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe/success`;
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    console.log('✅ [STRIPE CONNECT ONBOARDING] Lien généré:', accountLink.url);

    // ============================================
    // 5️⃣ RETOUR DE LA RÉPONSE
    // ============================================

    return NextResponse.json({
      url: accountLink.url,
      accountId: accountId,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [STRIPE CONNECT ONBOARDING] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur lors de la création du lien d\'onboarding',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
