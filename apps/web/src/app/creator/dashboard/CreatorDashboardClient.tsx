'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { DollarSign, Users, TrendingUp, BookOpen, Plus, Star, Clock, Loader2 } from 'lucide-react';

export function CreatorDashboardClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [stats, setStats] = useState({
    revenue: 0,
    students: 0,
    engagement: 0,
    activeCourses: 0
  });
  const [statsChanges, setStatsChanges] = useState({
    revenueChange: 0,
    studentsChange: 0,
    engagementChange: 0,
    activeCoursesChange: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔄 [DASHBOARD] useEffect appelé - authLoading:', authLoading, 'user:', !!user, 'userId:', user?.id, 'hasAttempted:', hasAttemptedLoad);

    // Attendre que l'auth soit chargée
    if (authLoading) return;

    // Si pas d'utilisateur, rediriger vers login
    if (!user) {
      router.push('/login');
      return;
    }

    // Si c'est un apprenant, rediriger vers le dashboard apprenant
    if (user.user_metadata?.role === 'learner') {
      router.push('/dashboard');
      return;
    }

    // Charger les cours du créateur UNE SEULE FOIS
    if (user.id && !hasAttemptedLoad) {
      console.log('🚀 [DASHBOARD] Déclenchement du chargement');
      setHasAttemptedLoad(true);
      loadCourses();
    }
  }, [user?.id, authLoading, hasAttemptedLoad]);

  const loadCourses = async () => {
    // VÉRIFICATION: S'assurer que user.id est défini
    if (!user?.id) {
      console.log('❌ [DASHBOARD] User ID non défini, abandon du chargement');
      return;
    }

    setLoadingCourses(true);
    console.log('📊 [DASHBOARD] Chargement des cours pour:', user.id);

    try {
      // Charger les cours
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('❌ [DASHBOARD] Error loading courses:', coursesError);
        return;
      }

      const allCourses = coursesData || [];
      setCourses(allCourses);
      console.log('✅ [DASHBOARD] Cours chargés:', allCourses.length, 'cours');

      // Calculer les statistiques
      const activeCourses = allCourses.filter(c => c.status === 'published').length;

      // Charger les inscriptions
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, course_id, created_at')
        .in('course_id', allCourses.map(c => c.id));

      const totalStudents = enrollments?.length || 0;

      // Calculer le revenu total
      let revenue = 0;
      enrollments?.forEach(enrollment => {
        const course = allCourses.find(c => c.id === enrollment.course_id);
        if (course) {
          revenue += course.price || 0;
        }
      });

      // Calculer le taux d'engagement (leçons complétées / total leçons)
      let engagement = 0;
      if (enrollments && enrollments.length > 0) {
        const enrollmentIds = enrollments.map(e => e.id);

        // Ne faire la requête que si on a des enrollment IDs
        if (enrollmentIds.length > 0) {
          try {
            const { data: progress, error: progressError } = await supabase
              .from('lesson_progress')
              .select('id, is_completed')
              .in('enrollment_id', enrollmentIds);

            // Si erreur (ex: permissions RLS), ignorer silencieusement
            if (!progressError && progress) {
              const completedLessons = progress.filter(p => p.is_completed).length || 0;
              const totalLessons = progress.length || 1;
              engagement = Math.round((completedLessons / totalLessons) * 100);
            }
          } catch (error) {
            // Ignorer les erreurs de permissions RLS
            console.log('ℹ️ [DASHBOARD] Impossible de charger lesson_progress (permissions?)');
          }
        }
      }

      setStats({
        revenue,
        students: totalStudents,
        engagement: engagement || 0,
        activeCourses
      });

      console.log('✅ [DASHBOARD] Stats calculées:', { revenue, totalStudents, engagement, activeCourses });

      // Calculer les variations (30 derniers jours vs. 30 jours précédents)
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Enrollments des 30 derniers jours
      const recentEnrollments = enrollments?.filter(e =>
        new Date(e.created_at) >= last30Days
      ) || [];

      // Enrollments des 30 jours précédents
      const previousEnrollments = enrollments?.filter(e =>
        new Date(e.created_at) >= previous30Days &&
        new Date(e.created_at) < last30Days
      ) || [];

      // Calculer revenus période précédente
      let previousRevenue = 0;
      previousEnrollments.forEach(enrollment => {
        const course = allCourses.find(c => c.id === enrollment.course_id);
        if (course) previousRevenue += course.price || 0;
      });

      // Calculer les changements en pourcentage
      const revenueChange = previousRevenue > 0
        ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100)
        : (revenue > 0 ? 100 : 0);

      const studentsChange = previousEnrollments.length > 0
        ? Math.round(((recentEnrollments.length - previousEnrollments.length) / previousEnrollments.length) * 100)
        : (recentEnrollments.length > 0 ? 100 : 0);

      setStatsChanges({
        revenueChange,
        studentsChange,
        engagementChange: 0, // Pas de comparaison pour l'engagement
        activeCoursesChange: activeCourses
      });

      // Charger activité récente (5 dernières inscriptions)
      const { data: recentEnrollmentsData } = await supabase
        .from('enrollments')
        .select('id, created_at, course_id, user_id')
        .in('course_id', allCourses.map(c => c.id))
        .order('created_at', { ascending: false })
        .limit(5);

      // Enrichir avec les données utilisateur et cours
      const enrichedActivity = await Promise.all(
        (recentEnrollmentsData || []).map(async (enrollment) => {
          const { data: user } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', enrollment.user_id)
            .single();

          const course = allCourses.find(c => c.id === enrollment.course_id);

          return {
            ...enrollment,
            user,
            course: { title: course?.title }
          };
        })
      );

      setRecentActivity(enrichedActivity);

      // Charger avis récents (5 derniers)
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, user_id, course_id')
        .in('course_id', allCourses.map(c => c.id))
        .order('created_at', { ascending: false })
        .limit(5);

      // Enrichir avec les données utilisateur et cours
      const enrichedReviews = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: user } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', review.user_id)
            .single();

          const course = allCourses.find(c => c.id === review.course_id);

          return {
            ...review,
            user,
            course: { title: course?.title }
          };
        })
      );

      setRecentReviews(enrichedReviews);

    } catch (error) {
      console.error('❌ [DASHBOARD] Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Revenus totaux',
      value: `${stats.revenue}€`,
      change: statsChanges.revenueChange > 0 ? `+${statsChanges.revenueChange}%` : `${statsChanges.revenueChange}%`,
      changeColor: statsChanges.revenueChange >= 0 ? 'text-green-500' : 'text-red-500',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total étudiants',
      value: stats.students.toString(),
      change: statsChanges.studentsChange > 0 ? `+${statsChanges.studentsChange}%` : `${statsChanges.studentsChange}%`,
      changeColor: statsChanges.studentsChange >= 0 ? 'text-green-500' : 'text-red-500',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: "Taux d'engagement",
      value: `${stats.engagement}%`,
      change: '30 derniers jours',
      changeColor: 'text-muted-foreground',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Cours actifs',
      value: stats.activeCourses.toString(),
      change: `${stats.activeCourses} publiés`,
      changeColor: 'text-muted-foreground',
      icon: BookOpen,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              Bienvenue, {user?.user_metadata?.first_name || 'Créateur'} ! 👨‍🏫
            </h1>
            <p className="text-muted-foreground">
              Gérez vos cours et suivez vos performances
            </p>
          </div>
          <Link
            href="/creator/courses/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 sm:flex-shrink-0"
          >
            <Plus className="h-5 w-5" />
            Nouveau cours
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className={`mt-1 text-sm ${stat.changeColor}`}>{stat.change}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/creator/courses/new"
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
              Créer un cours
            </h3>
            <p className="text-sm text-muted-foreground">
              Commencez à créer votre premier cours
            </p>
          </Link>

          {/* TODO: Implement upload content feature
          <Link
            href="/creator/upload"
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
              Upload contenu
            </h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez des vidéos et ressources
            </p>
          </Link>
          */}

          {/* TODO: Implement sandbox project feature
          <Link
            href="/creator/projects/new"
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
              Créer un projet Sandbox
            </h3>
            <p className="text-sm text-muted-foreground">
              Projet pratique pour vos étudiants
            </p>
          </Link>
          */}
        </div>

        {/* Empty State - Vos cours */}
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Vos cours</h2>
            {courses.length > 0 && (
              <Link href="/creator/courses" className="text-sm text-primary hover:underline">
                Voir tout
              </Link>
            )}
          </div>

          {loadingCourses ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Chargement des cours...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Aucun cours pour le moment</h3>
              <p className="mb-6 text-muted-foreground">
                Créez votre premier cours et commencez à partager vos connaissances
              </p>
              <Link
                href="/creator/courses/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Créer mon premier cours
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  href={`/creator/courses/${course.id}/edit`}
                  className="group overflow-hidden rounded-lg border border-border transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-secondary">
                    {course.cover_image ? (
                      <Image
                        src={course.cover_image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        course.status === 'published'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {course.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                      <span className="text-sm font-semibold">{course.price}€</span>
                    </div>
                    <h3 className="mb-2 font-semibold group-hover:text-primary line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.subtitle || course.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques récentes */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Activité récente</h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Aucune activité récente</span>
                </div>
              ) : (
                recentActivity.map((activity: any) => {
                  const userName = activity.user?.first_name && activity.user?.last_name
                    ? `${activity.user.first_name} ${activity.user.last_name}`
                    : activity.user?.email || 'Étudiant';
                  const timeAgo = new Date(activity.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{userName}</p>
                        <p className="text-muted-foreground">
                          s'est inscrit à <span className="font-medium">{activity.course?.title}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{timeAgo}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Avis récents</h3>
            <div className="space-y-4">
              {recentReviews.length === 0 ? (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>Aucun avis pour le moment</span>
                </div>
              ) : (
                recentReviews.map((review: any) => {
                  const userName = review.user?.first_name && review.user?.last_name
                    ? `${review.user.first_name} ${review.user.last_name}`
                    : 'Étudiant';
                  const timeAgo = new Date(review.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div key={review.id} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{userName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {review.comment || 'Pas de commentaire'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {review.course?.title} • {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
