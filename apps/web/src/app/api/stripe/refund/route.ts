// ============================================
// 💰 STRIPE REFUND API ROUTE
// ============================================
// Route: POST /api/stripe/refund
// Crée un remboursement Stripe et met à jour l'enrollment
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(req: NextRequest) {
  try {
    console.log('💰 [REFUND] Début traitement remboursement...');

    // ============================================
    // 1️⃣ AUTHENTIFICATION
    // ============================================

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ [REFUND] Authorization header manquant');
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ [REFUND] Erreur authentification:', authError?.message);
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    console.log('✅ [REFUND] Utilisateur authentifié:', user.id);

    // ============================================
    // 2️⃣ RÉCUPÉRATION DES DONNÉES
    // ============================================

    const body = await req.json();
    const { enrollmentId, reason } = body;

    if (!enrollmentId) {
      console.error('❌ [REFUND] enrollmentId manquant');
      return NextResponse.json({ error: 'enrollmentId requis' }, { status: 400 });
    }

    console.log('📋 [REFUND] Données reçues:', { enrollmentId, reason });

    // ============================================
    // 3️⃣ RÉCUPÉRATION DE L'ENROLLMENT
    // ============================================

    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(id, title, creator_id)
      `)
      .eq('id', enrollmentId)
      .single();

    if (enrollmentError || !enrollment) {
      console.error('❌ [REFUND] Enrollment non trouvé:', enrollmentError);
      return NextResponse.json({ error: 'Inscription non trouvée' }, { status: 404 });
    }

    console.log('✅ [REFUND] Enrollment trouvé:', {
      enrollmentId: enrollment.id,
      courseId: enrollment.course_id,
      paymentStatus: enrollment.payment_status,
    });

    // ============================================
    // 4️⃣ VÉRIFICATIONS
    // ============================================

    // Vérifier que l'utilisateur est bien le créateur du cours
    if (enrollment.course.creator_id !== user.id) {
      console.error('❌ [REFUND] Utilisateur non autorisé');
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à effectuer ce remboursement' },
        { status: 403 }
      );
    }

    // Vérifier que le paiement a bien été effectué
    if (enrollment.payment_status !== 'paid') {
      console.error('❌ [REFUND] Paiement non effectué');
      return NextResponse.json(
        { error: 'Ce cours n\'a pas été payé, impossible de rembourser' },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'a pas déjà été remboursé
    if (enrollment.payment_status === 'refunded') {
      console.error('❌ [REFUND] Déjà remboursé');
      return NextResponse.json(
        { error: 'Ce cours a déjà été remboursé' },
        { status: 400 }
      );
    }

    // Vérifier qu'il y a bien un payment_intent_id
    if (!enrollment.stripe_payment_intent_id) {
      console.error('❌ [REFUND] Pas de payment_intent_id');
      return NextResponse.json(
        { error: 'Aucun paiement Stripe associé à cette inscription' },
        { status: 400 }
      );
    }

    // ============================================
    // 5️⃣ CRÉATION DU REMBOURSEMENT STRIPE
    // ============================================

    console.log('💳 [REFUND] Création du remboursement Stripe...');

    const refund = await stripe.refunds.create({
      payment_intent: enrollment.stripe_payment_intent_id,
      reason: reason || 'requested_by_customer',
      metadata: {
        enrollment_id: enrollment.id,
        course_id: enrollment.course_id,
        user_id: enrollment.user_id,
        refunded_by: user.id,
      },
    });

    console.log('✅ [REFUND] Remboursement Stripe créé:', refund.id);

    // ============================================
    // 6️⃣ MISE À JOUR DE L'ENROLLMENT
    // ============================================

    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        payment_status: 'refunded',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId);

    if (updateError) {
      console.error('❌ [REFUND] Erreur mise à jour enrollment:', updateError);
      // Note: Le remboursement Stripe a été créé, on log l'erreur mais on ne fail pas
      console.warn('⚠️ [REFUND] Le remboursement Stripe a été créé mais la mise à jour de la DB a échoué');
    } else {
      console.log('✅ [REFUND] Enrollment mis à jour (status: cancelled, payment: refunded)');
    }

    // ============================================
    // 7️⃣ ENVOI D'EMAIL (optionnel)
    // ============================================

    // TODO: Envoyer un email de confirmation de remboursement à l'étudiant
    // Via Resend API

    // ============================================
    // 8️⃣ RÉPONSE
    // ============================================

    console.log('✅ [REFUND] Remboursement effectué avec succès');

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
      message: 'Remboursement effectué avec succès',
    });

  } catch (error: any) {
    console.error('❌ [REFUND] Erreur:', error);
    console.error('Stack trace:', error.stack);

    // Erreurs Stripe spécifiques
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: 'Erreur avec la carte bancaire' },
        { status: 400 }
      );
    }

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Requête invalide: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Erreur lors du remboursement',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
