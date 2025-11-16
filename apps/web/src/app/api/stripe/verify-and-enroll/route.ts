// ============================================
// ✅ VERIFY PAYMENT & CREATE ENROLLMENT
// ============================================
// Route appelée depuis la page success pour :
// 1. Vérifier que le paiement Stripe est bien complété
// 2. Créer l'enrollment immédiatement
// 3. Retourner l'ID du cours pour redirection
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeServerInstance } from '@/types/stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [VERIFY & ENROLL] Début vérification...');

    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'sessionId et userId requis' },
        { status: 400 }
      );
    }

    console.log('📋 [VERIFY & ENROLL] Session:', sessionId, 'User:', userId);

    // 1. Vérifier la session Stripe
    const stripe = getStripeServerInstance();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('💳 [VERIFY & ENROLL] Status paiement:', session.payment_status);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Paiement non complété', status: session.payment_status },
        { status: 400 }
      );
    }

    // 2. Récupérer les métadonnées
    const { courseId, courseName } = session.metadata as {
      courseId: string;
      userId: string;
      courseName: string;
      userEmail: string;
    };

    if (!courseId) {
      console.error('❌ [VERIFY & ENROLL] Pas de courseId dans metadata');
      return NextResponse.json(
        { error: 'Métadonnées manquantes' },
        { status: 400 }
      );
    }

    console.log('📚 [VERIFY & ENROLL] Cours:', courseName, '(', courseId, ')');

    // 3. Vérifier si enrollment existe déjà (par user_id + course_id)
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id, course_id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existingEnrollment) {
      console.log('✅ [VERIFY & ENROLL] Enrollment existe déjà:', existingEnrollment.id);
      return NextResponse.json({
        success: true,
        courseId: existingEnrollment.course_id,
        enrollmentId: existingEnrollment.id,
        alreadyExists: true,
      });
    }

    // 4. Récupérer le prix du cours
    const { data: course } = await supabase
      .from('courses')
      .select('price')
      .eq('id', courseId)
      .single();

    // 5. Créer l'enrollment
    const { data: newEnrollment, error: enrollError } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_status: 'paid',
        payment_amount: course?.price || (session.amount_total || 0) / 100,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'active',
      })
      .select()
      .single();

    if (enrollError) {
      console.error('❌ [VERIFY & ENROLL] Erreur création:', enrollError);
      return NextResponse.json(
        { error: 'Erreur création enrollment', details: enrollError.message },
        { status: 500 }
      );
    }

    console.log('🎉 [VERIFY & ENROLL] Enrollment créé:', newEnrollment.id);

    return NextResponse.json({
      success: true,
      courseId,
      enrollmentId: newEnrollment.id,
    });
  } catch (error: any) {
    console.error('❌ [VERIFY & ENROLL] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}
