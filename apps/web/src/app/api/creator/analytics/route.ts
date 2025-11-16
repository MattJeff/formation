// ============================================
// 📊 CREATOR ANALYTICS API ROUTE
// ============================================
// Route: GET /api/creator/analytics
// Retourne les statistiques complètes pour un créateur
//
// DONNÉES RETOURNÉES:
// - Revenus totaux et par mois
// - Nombre d'inscriptions totales et par mois
// - Taux de complétion moyen
// - Top 5 cours par revenus
// - Top 5 cours par inscriptions
// - Évolution mensuelle (12 derniers mois)
//
// DEBUGGING:
// - Chercher les logs: [CREATOR ANALYTICS]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// 📊 GET /api/creator/analytics
// ============================================

export async function GET(req: NextRequest) {
  try {
    console.log('📊 [CREATOR ANALYTICS] Début récupération analytics...');

    // ============================================
    // 1️⃣ RÉCUPÉRATION DU USER ID
    // ============================================

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      console.error('❌ [CREATOR ANALYTICS] userId manquant');
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    console.log('👤 [CREATOR ANALYTICS] Récupération pour:', userId);

    // ============================================
    // 2️⃣ RÉCUPÉRATION DES COURS DU CRÉATEUR
    // ============================================

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, price, created_at')
      .eq('creator_id', userId);

    if (coursesError) {
      console.error('❌ [CREATOR ANALYTICS] Erreur récupération cours:', coursesError);
      return NextResponse.json({ error: 'Erreur récupération cours' }, { status: 500 });
    }

    if (!courses || courses.length === 0) {
      console.log('ℹ️ [CREATOR ANALYTICS] Aucun cours trouvé');
      return NextResponse.json({
        totalRevenue: 0,
        totalEnrollments: 0,
        averageCompletionRate: 0,
        topCoursesByRevenue: [],
        topCoursesByEnrollments: [],
        monthlyData: [],
        recentEnrollments: [],
      });
    }

    const courseIds = courses.map(c => c.id);

    // ============================================
    // 3️⃣ RÉCUPÉRATION DES INSCRIPTIONS
    // ============================================

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .in('course_id', courseIds)
      .eq('status', 'active');

    if (enrollmentsError) {
      console.error('❌ [CREATOR ANALYTICS] Erreur récupération inscriptions:', enrollmentsError);
      return NextResponse.json({ error: 'Erreur récupération inscriptions' }, { status: 500 });
    }

    // ============================================
    // 4️⃣ CALCUL DES STATISTIQUES GLOBALES
    // ============================================

    const totalRevenue = enrollments
      ?.filter(e => e.payment_status === 'paid')
      .reduce((sum, e) => sum + (e.payment_amount || 0), 0) || 0;

    const totalEnrollments = enrollments?.length || 0;

    const averageCompletionRate = enrollments && enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length
      : 0;

    console.log('📈 [CREATOR ANALYTICS] Stats globales:', {
      totalRevenue,
      totalEnrollments,
      averageCompletionRate: averageCompletionRate.toFixed(2) + '%',
    });

    // ============================================
    // 5️⃣ TOP 5 COURS PAR REVENUS
    // ============================================

    const courseRevenues = courses.map(course => {
      const courseEnrollments = enrollments?.filter(e => e.course_id === course.id && e.payment_status === 'paid') || [];
      const revenue = courseEnrollments.reduce((sum, e) => sum + (e.payment_amount || 0), 0);
      return {
        courseId: course.id,
        title: course.title,
        revenue,
        enrollments: courseEnrollments.length,
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // ============================================
    // 6️⃣ TOP 5 COURS PAR INSCRIPTIONS
    // ============================================

    const courseEnrollmentCounts = courses.map(course => {
      const count = enrollments?.filter(e => e.course_id === course.id).length || 0;
      return {
        courseId: course.id,
        title: course.title,
        enrollments: count,
        revenue: enrollments?.filter(e => e.course_id === course.id && e.payment_status === 'paid')
          .reduce((sum, e) => sum + (e.payment_amount || 0), 0) || 0,
      };
    }).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);

    // ============================================
    // 7️⃣ DONNÉES MENSUELLES (12 derniers mois)
    // ============================================

    const now = new Date();
    const monthlyData = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const monthEnrollments = enrollments?.filter(e => {
        const enrolledAt = new Date(e.enrolled_at);
        return enrolledAt >= new Date(monthStart) && enrolledAt <= new Date(monthEnd);
      }) || [];

      const monthRevenue = monthEnrollments
        .filter(e => e.payment_status === 'paid')
        .reduce((sum, e) => sum + (e.payment_amount || 0), 0);

      monthlyData.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue, // DÉJÀ EN EUROS
        enrollments: monthEnrollments.length,
      });
    }

    // ============================================
    // 8️⃣ INSCRIPTIONS RÉCENTES (10 dernières)
    // ============================================

    const { data: recentEnrollmentsData, error: recentError } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        payment_status,
        payment_amount,
        progress_percentage,
        course_id,
        user_id,
        stripe_payment_intent_id,
        payment_id,
        status
      `)
      .in('course_id', courseIds)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('❌ [CREATOR ANALYTICS] Erreur récupération inscriptions récentes:', recentError);
    }

    // Enrichir avec les noms de cours et utilisateurs
    const recentEnrollments = await Promise.all((recentEnrollmentsData || []).map(async (enrollment) => {
      const course = courses.find(c => c.id === enrollment.course_id);

      // Récupérer l'email de l'utilisateur depuis auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(enrollment.user_id);

      return {
        id: enrollment.id,
        enrolledAt: enrollment.enrolled_at,
        courseName: course?.title || 'Cours inconnu',
        studentEmail: authUser?.user?.email || 'Email inconnu',
        paymentStatus: enrollment.payment_status,
        amount: enrollment.payment_amount || 0, // DÉJÀ EN EUROS dans la DB
        progress: enrollment.progress_percentage || 0,
        stripePaymentIntentId: enrollment.stripe_payment_intent_id || enrollment.payment_id,
        status: enrollment.status,
      };
    }));

    // ============================================
    // 9️⃣ RÉPONSE FINALE
    // ============================================

    const response = {
      totalRevenue, // DÉJÀ EN EUROS
      totalEnrollments,
      averageCompletionRate: Math.round(averageCompletionRate),
      topCoursesByRevenue: courseRevenues, // DÉJÀ EN EUROS
      topCoursesByEnrollments: courseEnrollmentCounts, // DÉJÀ EN EUROS
      monthlyData,
      recentEnrollments,
    };

    console.log('✅ [CREATOR ANALYTICS] Analytics récupérés avec succès');

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('❌ [CREATOR ANALYTICS] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des analytics',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
