// ============================================
// 📝 REVIEWS API ROUTE
// ============================================
// GET: Récupérer tous les avis d'un cours
// POST: Créer/Modifier un avis
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// GET /api/courses/[id]/reviews
// ============================================
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    console.log('📝 [REVIEWS] Récupération reviews pour cours:', courseId);

    // Récupérer tous les reviews avec infos utilisateur
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        updated_at,
        user:profiles!reviews_user_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [REVIEWS] Erreur récupération:', error);
      return NextResponse.json(
        { error: 'Erreur récupération reviews', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ [REVIEWS] ${reviews?.length || 0} avis récupérés`);

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error: any) {
    console.error('❌ [REVIEWS] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/courses/[id]/reviews
// ============================================
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const { userId, rating, comment } = await req.json();

    console.log('📝 [REVIEWS] Création review:', { courseId, userId, rating });

    // Validation
    if (!userId || !rating) {
      return NextResponse.json(
        { error: 'userId et rating requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est inscrit au cours
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Vous devez être inscrit au cours pour laisser un avis' },
        { status: 403 }
      );
    }

    if (enrollment.status !== 'active') {
      return NextResponse.json(
        { error: 'Votre inscription doit être active' },
        { status: 403 }
      );
    }

    // Vérifier si un review existe déjà
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    let result;

    if (existingReview) {
      // Mettre à jour le review existant
      console.log('🔄 [REVIEWS] Mise à jour review existant:', existingReview.id);

      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Créer un nouveau review
      console.log('➕ [REVIEWS] Création nouveau review');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          course_id: courseId,
          user_id: userId,
          rating,
          comment,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log('✅ [REVIEWS] Review enregistré:', result.id);

    // Récupérer les stats mises à jour du cours
    const { data: course } = await supabase
      .from('courses')
      .select('average_rating, total_reviews')
      .eq('id', courseId)
      .single();

    return NextResponse.json({
      review: result,
      courseStats: course,
    });
  } catch (error: any) {
    console.error('❌ [REVIEWS] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur création review', details: error.message },
      { status: 500 }
    );
  }
}
