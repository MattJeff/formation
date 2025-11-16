'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Header } from '@/components/layout/Header';
import { BookOpen, Trophy, Target, TrendingUp, Loader2, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EnrollmentWithCourse {
  id: string;
  progress_percentage: number;
  created_at: string;
  courses: {
    id: string;
    title: string;
    description: string;
    cover_image: string;
    price: number;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

export function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const loading = authLoading || profileLoading;
  const isCreator = profile?.role === 'creator';

  console.log('📊 [DASHBOARD] Render - User:', user?.email, 'Role:', profile?.role);

  useEffect(() => {
    if (!user || isCreator) return;
    loadEnrollments();
  }, [user, isCreator]);

  const loadEnrollments = async () => {
    if (!user) return;

    try {
      console.log('📚 [DASHBOARD] Chargement des inscriptions...');

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress_percentage,
          created_at,
          courses:course_id (
            id,
            title,
            description,
            cover_image,
            price,
            profiles:creator_id (first_name, last_name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [DASHBOARD] Erreur chargement:', error);
        return;
      }

      console.log('✅ [DASHBOARD] Inscriptions chargées:', data?.length || 0);

      // Transformer les données pour correspondre au type attendu
      const transformedData = data?.map((enrollment: any) => {
        const courses = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses;
        if (courses && courses.profiles && Array.isArray(courses.profiles)) {
          courses.profiles = courses.profiles[0];
        }
        return {
          ...enrollment,
          courses,
        };
      }) || [];

      setEnrollments(transformedData as EnrollmentWithCourse[]);
    } catch (error) {
      console.error('❌ [DASHBOARD] Erreur:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Afficher le loader pendant le chargement
  if (loading) {
    console.log('⏳ [DASHBOARD] Chargement...');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  // Si pas connecté, afficher message
  if (!user) {
    console.log('❌ [DASHBOARD] Non connecté');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Vous devez être connecté</p>
          <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Si creator, afficher message
  if (isCreator) {
    console.log('🚫 [DASHBOARD] Creator détecté, redirection...');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Redirection vers le dashboard créateur...</p>
          <Link href="/creator/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Aller au dashboard créateur
          </Link>
        </div>
      </div>
    );
  }

  console.log('✅ [DASHBOARD] Affichage du dashboard learner');

  // Calculer les stats
  const inProgressCourses = enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100);
  const completedCourses = enrollments.filter(e => e.progress_percentage === 100);
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length)
    : 0;

  const stats = [
    { label: 'Cours en cours', value: String(inProgressCourses.length), icon: BookOpen, color: 'text-blue-500' },
    { label: 'Cours terminés', value: String(completedCourses.length), icon: Trophy, color: 'text-yellow-500' },
    { label: 'Cours total', value: String(enrollments.length), icon: Target, color: 'text-green-500' },
    { label: 'Progression', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Bienvenue, {profile?.first_name || 'Apprenant'} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Continuez votre parcours d'apprentissage
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {loadingCourses ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enrollments.length === 0 ? (
          <>
            {/* Section: Commencer l'apprentissage */}
            <div className="mb-8 rounded-lg border border-border bg-card p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Commencez votre apprentissage</h2>
              <p className="mb-6 text-muted-foreground">
                Vous n'avez pas encore de cours. Explorez notre catalogue et commencez à apprendre !
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/courses"
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 text-center"
                >
                  Explorer les cours
                </Link>
                <Link
                  href="/categories"
                  className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-accent text-center"
                >
                  Parcourir par catégorie
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Section: Mes cours */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Mes cours</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/learn/${enrollment.courses.id}`}
                    className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all"
                  >
                    <div className="relative aspect-video w-full">
                      <Image
                        src={enrollment.courses.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                        alt={enrollment.courses.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-16 w-16 text-white" />
                      </div>
                      {enrollment.progress_percentage > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${enrollment.progress_percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-semibold group-hover:text-primary line-clamp-2">
                        {enrollment.courses.title}
                      </h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {enrollment.courses.profiles?.first_name} {enrollment.courses.profiles?.last_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {enrollment.progress_percentage === 100 ? (
                            <span className="text-green-500 font-medium">✓ Terminé</span>
                          ) : enrollment.progress_percentage > 0 ? (
                            <span className="text-primary font-medium">
                              {enrollment.progress_percentage}% complété
                            </span>
                          ) : (
                            <span>Commencer</span>
                          )}
                        </div>
                        {enrollment.courses.price === 0 && (
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                            Gratuit
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Section: Explorer plus de cours */}
            <div className="text-center">
              <Link
                href="/courses"
                className="inline-block rounded-lg border border-border px-6 py-3 font-semibold hover:bg-accent"
              >
                Explorer plus de cours
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
