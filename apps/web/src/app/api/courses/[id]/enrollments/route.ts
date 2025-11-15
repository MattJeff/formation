import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Get all enrollments for a course (creator only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const courseId = params.id;

    // Vérifier que l'utilisateur est le créateur du cours
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('creator_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    if (course.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas le créateur de ce cours' },
        { status: 403 }
      );
    }

    // Récupérer tous les enrollments pour ce cours
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });

    if (enrollmentsError) {
      console.error('❌ Erreur récupération enrollments:', enrollmentsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des inscriptions' },
        { status: 500 }
      );
    }

    // Créer un client admin pour récupérer les infos utilisateurs
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Enrichir les enrollments avec les informations utilisateur
    const enrichedEnrollments = await Promise.all(
      (enrollments || []).map(async (enrollment) => {
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(enrollment.user_id);

          return {
            ...enrollment,
            user: {
              id: enrollment.user_id,
              email: userData?.user?.email || '',
              first_name: userData?.user?.user_metadata?.first_name || 'Utilisateur',
              last_name: userData?.user?.user_metadata?.last_name || '',
              full_name: userData?.user?.user_metadata?.full_name || 'Utilisateur'
            }
          };
        } catch (error) {
          console.error('Erreur récupération user:', error);
          return {
            ...enrollment,
            user: {
              id: enrollment.user_id,
              email: '',
              first_name: 'Utilisateur',
              last_name: '',
              full_name: 'Utilisateur'
            }
          };
        }
      })
    );

    // Calculer les statistiques
    const stats = {
      total: enrichedEnrollments.length,
      active: enrichedEnrollments.filter(e => e.status === 'active').length,
      completed: enrichedEnrollments.filter(e => e.status === 'completed').length,
      canceled: enrichedEnrollments.filter(e => e.status === 'canceled').length,
      free: enrichedEnrollments.filter(e => e.payment_status === 'free').length,
      paid: enrichedEnrollments.filter(e => e.payment_status === 'paid').length,
      pending: enrichedEnrollments.filter(e => e.payment_status === 'pending').length,
      totalRevenue: enrichedEnrollments
        .filter(e => e.payment_status === 'paid')
        .reduce((sum, e) => sum + (parseFloat(e.payment_amount?.toString() || '0') || 0), 0)
    };

    return NextResponse.json({
      success: true,
      enrollments: enrichedEnrollments,
      stats
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
