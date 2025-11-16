// ============================================
// 🔔 STRIPE WEBHOOK HANDLER
// ============================================
// Route: POST /api/stripe/webhook
// Reçoit les événements de Stripe (paiement réussi, échoué, etc.)
//
// FLOW:
// 1. Stripe envoie un webhook après un paiement
// 2. On vérifie la signature pour sécurité
// 3. On traite l'événement (ex: checkout.session.completed)
// 4. On crée l'enrollment dans Supabase
//
// DEBUGGING:
// - Chercher les logs: [STRIPE WEBHOOK]
// - Vérifier .env.local: STRIPE_WEBHOOK_SECRET
// - Test local: stripe CLI `stripe listen --forward-to localhost:3000/api/stripe/webhook`
// - Logs Stripe: https://dashboard.stripe.com/webhooks
//
// SÉCURITÉ IMPORTANTE:
// - TOUJOURS vérifier la signature webhook
// - JAMAIS faire confiance aux données du frontend
// - Utiliser les webhooks comme source de vérité
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeServerInstance } from '@/types/stripe';
import { sendPurchaseConfirmationEmail, sendNewEnrollmentNotification } from '@/lib/resend';
import Stripe from 'stripe';

// ============================================
// 🔧 CONFIGURATION
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Désactiver le parsing automatique du body pour les webhooks
export const runtime = 'nodejs';

// ============================================
// 📨 POST /api/stripe/webhook
// ============================================

export async function POST(req: NextRequest) {
  try {
    console.log('🔔 [STRIPE WEBHOOK] Webhook reçu');

    // ============================================
    // 1️⃣ RÉCUPÉRATION ET VÉRIFICATION SIGNATURE
    // ============================================

    const body = await req.text(); // Important: text() pas json()
    const signature = req.headers.get('stripe-signature');

    console.log('🔐 [STRIPE WEBHOOK] Vérification signature...');

    if (!signature) {
      console.error('❌ [STRIPE WEBHOOK] Signature manquante');
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ [STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET manquant dans .env');
      return NextResponse.json(
        { error: 'Configuration serveur incorrecte' },
        { status: 500 }
      );
    }

    // Vérifier la signature pour sécurité
    const stripe = getStripeServerInstance();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ [STRIPE WEBHOOK] Signature valide');
    } catch (err: any) {
      console.error('❌ [STRIPE WEBHOOK] Signature invalide:', err.message);
      return NextResponse.json(
        { error: `Signature invalide: ${err.message}` },
        { status: 400 }
      );
    }

    console.log('📋 [STRIPE WEBHOOK] Event type:', event.type);
    console.log('📋 [STRIPE WEBHOOK] Event ID:', event.id);

    // ============================================
    // 2️⃣ TRAITEMENT SELON TYPE D'ÉVÉNEMENT
    // ============================================

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event);
        break;

      case 'payment_intent.succeeded':
        console.log('💰 [STRIPE WEBHOOK] Paiement réussi (déjà géré par checkout.session.completed)');
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`ℹ️ [STRIPE WEBHOOK] Event non géré: ${event.type}`);
    }

    // ============================================
    // 3️⃣ RETOUR SUCCÈS À STRIPE
    // ============================================

    console.log('✅ [STRIPE WEBHOOK] Webhook traité avec succès');
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('❌ [STRIPE WEBHOOK] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur lors du traitement du webhook',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ============================================
// 🎉 GESTION: CHECKOUT SESSION COMPLETED
// ============================================
// Déclenché quand un paiement est réussi
// C'est ici qu'on crée l'enrollment dans Supabase

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  console.log('🎉 [STRIPE WEBHOOK] Checkout session completed:', session.id);
  console.log('💰 [STRIPE WEBHOOK] Montant payé:', session.amount_total, 'centimes');

  // Récupérer les métadonnées
  const metadata = session.metadata;

  if (!metadata?.courseId || !metadata?.userId) {
    console.error('❌ [STRIPE WEBHOOK] Métadonnées manquantes:', metadata);
    throw new Error('Métadonnées courseId ou userId manquantes');
  }

  console.log('📦 [STRIPE WEBHOOK] Métadonnées:', {
    courseId: metadata.courseId,
    userId: metadata.userId,
    courseName: metadata.courseName,
    userEmail: metadata.userEmail,
  });

  // ============================================
  // VÉRIFICATION: Enrollment déjà existant ?
  // ============================================

  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', metadata.userId)
    .eq('course_id', metadata.courseId)
    .single();

  if (existingEnrollment) {
    console.log('ℹ️ [STRIPE WEBHOOK] Enrollment existe déjà, skip création');
    return;
  }

  // ============================================
  // CRÉATION ENROLLMENT
  // ============================================

  console.log('📝 [STRIPE WEBHOOK] Création enrollment...');

  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .insert({
      user_id: metadata.userId,
      course_id: metadata.courseId,
      payment_status: 'paid',
      payment_amount: (session.amount_total || 0) / 100, // Convertir centimes en euros
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'active',
    })
    .select()
    .single();

  if (enrollmentError) {
    console.error('❌ [STRIPE WEBHOOK] Erreur création enrollment:', enrollmentError);
    throw enrollmentError;
  }

  console.log('✅ [STRIPE WEBHOOK] Enrollment créé:', enrollment.id);

  // ============================================
  // 📧 ENVOI EMAIL DE CONFIRMATION
  // ============================================

  console.log('📧 [STRIPE WEBHOOK] Envoi email de confirmation à', metadata.userEmail);

  try {
    const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/learn/${metadata.courseId}`;

    // Email à l'étudiant
    await sendPurchaseConfirmationEmail({
      to: metadata.userEmail,
      userName: metadata.userEmail.split('@')[0], // Fallback si pas de nom
      courseName: metadata.courseName,
      courseUrl,
      price: (session.amount_total || 0) / 100,
    });

    console.log('✅ [STRIPE WEBHOOK] Email de confirmation envoyé');

    // ============================================
    // 📧 NOTIFICATION CRÉATEUR
    // ============================================

    // Récupérer les infos du créateur
    const { data: course } = await supabase
      .from('courses')
      .select('creator_id')
      .eq('id', metadata.courseId)
      .single();

    if (course?.creator_id) {
      const { data: creator } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', course.creator_id)
        .single();

      if (creator?.email) {
        const creatorEmail = creator.email;
        const creatorName = `${creator.first_name} ${creator.last_name}`;
        const studentName = metadata.userEmail.split('@')[0]; // Fallback

        await sendNewEnrollmentNotification({
          to: creatorEmail,
          creatorName,
          studentName,
          courseName: metadata.courseName,
          courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${metadata.courseId}`,
          price: (session.amount_total || 0) / 100,
        });

        console.log('✅ [STRIPE WEBHOOK] Notification créateur envoyée');
      }
    }
  } catch (emailError) {
    // Ne pas faire échouer le webhook si l'email échoue
    console.error('⚠️ [STRIPE WEBHOOK] Erreur envoi email (non-bloquant):', emailError);
  }
}

// ============================================
// ⏱️ GESTION: CHECKOUT SESSION EXPIRED
// ============================================
// Déclenché quand une session expire sans paiement

async function handleCheckoutSessionExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  console.log('⏱️ [STRIPE WEBHOOK] Session expirée:', session.id);

  // Log pour analytics (optionnel)
  const metadata = session.metadata;
  if (metadata?.courseId && metadata?.userId) {
    console.log('📊 [STRIPE WEBHOOK] Abandon panier:', {
      courseId: metadata.courseId,
      userId: metadata.userId,
    });
    // TODO: Envoyer email de relance ?
  }
}

// ============================================
// ❌ GESTION: PAYMENT FAILED
// ============================================
// Déclenché quand un paiement échoue

async function handlePaymentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.error('❌ [STRIPE WEBHOOK] Paiement échoué:', paymentIntent.id);

  // Log pour debugging
  console.error('Raison:', paymentIntent.last_payment_error?.message);

  // TODO: Notifier l'utilisateur par email ?
}
