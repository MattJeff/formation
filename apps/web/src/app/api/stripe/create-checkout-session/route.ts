// ============================================
// 🛒 STRIPE CHECKOUT SESSION API ROUTE
// ============================================
// Route: POST /api/stripe/create-checkout-session
// Crée une session de paiement Stripe pour un cours payant
//
// FLOW:
// 1. Reçoit courseId + userId depuis le frontend
// 2. Récupère les infos du cours depuis Supabase
// 3. Crée une session Stripe Checkout
// 4. Retourne sessionId pour redirection
//
// DEBUGGING:
// - Chercher les logs: [STRIPE CHECKOUT]
// - Vérifier .env.local: STRIPE_SECRET_KEY
// - Test: POST http://localhost:3000/api/stripe/create-checkout-session
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getStripeServerInstance,
  CreateCheckoutSessionData,
  CheckoutSessionResponse,
  StripeCheckoutMetadata,
} from '@/types/stripe';
import { rateLimitStrict, getClientIP } from '@/lib/rate-limit';

// ============================================
// 🔧 CONFIGURATION
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role pour accès complet
);

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// ============================================
// 📨 POST /api/stripe/create-checkout-session
// ============================================

export async function POST(req: NextRequest) {
  try {
    console.log('🛒 [STRIPE CHECKOUT] Début création session...');

    // ============================================
    // 🛡️ RATE LIMITING (10 req/min strict pour paiements)
    // ============================================
    const ip = getClientIP(req);
    const rateLimitResult = await rateLimitStrict(`checkout:${ip}`);

    if (!rateLimitResult.success) {
      console.warn(`⚠️ [STRIPE CHECKOUT] Rate limit atteint pour IP: ${ip}`);
      return NextResponse.json(
        {
          error: 'Trop de tentatives de paiement. Veuillez patienter.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // ============================================
    // 1️⃣ VALIDATION DES DONNÉES
    // ============================================

    const body: CreateCheckoutSessionData = await req.json();
    const { courseId, userId } = body;

    console.log('📋 [STRIPE CHECKOUT] Données reçues:', {
      courseId,
      userId,
    });

    if (!courseId || !userId) {
      console.error('❌ [STRIPE CHECKOUT] courseId ou userId manquant');
      return NextResponse.json(
        { error: 'courseId et userId requis' },
        { status: 400 }
      );
    }

    // ============================================
    // 2️⃣ RÉCUPÉRATION DU COURS
    // ============================================

    console.log('📚 [STRIPE CHECKOUT] Récupération cours:', courseId);

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        price,
        cover_image,
        creator_id,
        profiles:creator_id (
          stripe_account_id,
          stripe_account_status
        )
      `)
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('❌ [STRIPE CHECKOUT] Cours non trouvé:', courseError);
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    // Transformer le profiles en objet unique si c'est un tableau
    const creatorProfile = Array.isArray(course.profiles) ? course.profiles[0] : course.profiles;

    console.log('✅ [STRIPE CHECKOUT] Cours trouvé:', {
      title: course.title,
      price: course.price,
      creatorHasStripe: !!creatorProfile?.stripe_account_id,
      creatorStripeStatus: creatorProfile?.stripe_account_status,
    });

    // Vérifier que le cours est payant
    if (course.price === 0) {
      console.error('❌ [STRIPE CHECKOUT] Cours gratuit, utiliser /enroll');
      return NextResponse.json(
        { error: 'Ce cours est gratuit, utiliser la route /enroll' },
        { status: 400 }
      );
    }

    // ============================================
    // 3️⃣ RÉCUPÉRATION DE L'UTILISATEUR
    // ============================================

    console.log('👤 [STRIPE CHECKOUT] Récupération utilisateur:', userId);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ [STRIPE CHECKOUT] Utilisateur non trouvé:', profileError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ [STRIPE CHECKOUT] Utilisateur trouvé:', {
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
    });

    // ============================================
    // 4️⃣ VÉRIFICATION ENROLLMENT EXISTANT
    // ============================================

    console.log('🔍 [STRIPE CHECKOUT] Vérification enrollment existant...');

    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      console.error('❌ [STRIPE CHECKOUT] Déjà inscrit à ce cours');
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit à ce cours' },
        { status: 400 }
      );
    }

    console.log('✅ [STRIPE CHECKOUT] Pas d\'enrollment existant');

    // ============================================
    // 5️⃣ CRÉATION SESSION STRIPE
    // ============================================

    console.log('💳 [STRIPE CHECKOUT] Création session Stripe...');

    const stripe = getStripeServerInstance();

    // Métadonnées pour le webhook
    const metadata: StripeCheckoutMetadata = {
      courseId,
      userId,
      courseName: course.title,
      userEmail: profile.email,
    };

    console.log('📦 [STRIPE CHECKOUT] Métadonnées:', metadata);

    // URLs de succès et annulation
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`;

    console.log('🔗 [STRIPE CHECKOUT] URLs:', { successUrl, cancelUrl });

    // Configuration de base de la session
    const sessionConfig: any = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.title,
              description: `Accès complet au cours "${course.title}"`,
              // N'inclure l'image que si l'URL est < 2048 caractères (limite Stripe)
              images: course.cover_image && course.cover_image.length < 2048 ? [course.cover_image] : [],
            },
            unit_amount: Math.round(course.price * 100), // Prix en centimes
          },
          quantity: 1,
        },
      ],
      customer_email: profile.email,
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true, // Autoriser les codes promo
      billing_address_collection: 'auto',
    };

    // ============================================
    // 💰 STRIPE CONNECT: Commission 4%
    // ============================================

    // Si le créateur a un compte Stripe Connect configuré et actif
    if (creatorProfile?.stripe_account_id && creatorProfile?.stripe_account_status === 'connected') {
      console.log('💰 [STRIPE CHECKOUT] Application commission 4% via Stripe Connect');

      // Calculer la commission (4% du prix)
      const platformFeeAmount = Math.round(course.price * 0.04 * 100); // 4% en centimes
      const creatorAmount = Math.round(course.price * 100) - platformFeeAmount; // 96% pour le créateur

      console.log('💵 [STRIPE CHECKOUT] Répartition:', {
        totalAmount: Math.round(course.price * 100),
        platformFee: platformFeeAmount,
        creatorReceives: creatorAmount,
        creatorAccountId: creatorProfile.stripe_account_id,
      });

      // Ajouter les paramètres Stripe Connect (Destination Charges)
      sessionConfig.payment_intent_data = {
        application_fee_amount: platformFeeAmount, // 4% pour la plateforme
        transfer_data: {
          destination: creatorProfile.stripe_account_id, // Compte du créateur
        },
      };
    } else {
      console.log('⚠️  [STRIPE CHECKOUT] Créateur sans Stripe Connect, paiement sur compte plateforme uniquement');
      if (!creatorProfile?.stripe_account_id) {
        console.log('   → Créateur doit configurer Stripe Connect dans ses paramètres');
      } else {
        console.log('   → Statut Stripe Connect:', creatorProfile?.stripe_account_status);
      }
    }

    // Créer la session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('✅ [STRIPE CHECKOUT] Session créée:', {
      sessionId: session.id,
      url: session.url,
    });

    // ============================================
    // 6️⃣ RETOUR DE LA RÉPONSE
    // ============================================

    const response: CheckoutSessionResponse = {
      sessionId: session.id,
      url: session.url!,
    };

    console.log('🎉 [STRIPE CHECKOUT] Succès! Session ID:', session.id);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('❌ [STRIPE CHECKOUT] Erreur:', error);

    // Log détaillé pour debugging
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur lors de la création de la session de paiement',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
