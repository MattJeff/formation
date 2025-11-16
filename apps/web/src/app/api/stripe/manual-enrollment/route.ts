// ============================================
// 🔧 MANUAL ENROLLMENT CREATOR (DEV ONLY)
// ============================================
// Route temporaire pour créer manuellement un enrollment
// après un paiement en LIVE mode
//
// À SUPPRIMER EN PRODUCTION !
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, courseId, userId } = await req.json();

    console.log('🔧 [MANUAL ENROLLMENT] Création enrollment manuel');
    console.log('Session ID:', sessionId);
    console.log('Course ID:', courseId);
    console.log('User ID:', userId);

    // Vérifier si existe déjà
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return NextResponse.json({
        message: 'Enrollment déjà existant',
        enrollmentId: existing.id,
      });
    }

    // Créer enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_status: 'paid',
        payment_amount: 10, // À adapter selon le cours
        stripe_session_id: sessionId,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ [MANUAL ENROLLMENT] Enrollment créé:', enrollment.id);

    return NextResponse.json({
      success: true,
      enrollment,
    });
  } catch (error: any) {
    console.error('❌ [MANUAL ENROLLMENT] Erreur:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
