'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { DollarSign, Users, TrendingUp, BookOpen, Plus, Star, Clock, Loader2 } from 'lucide-react';

export function CreatorDashboardClient() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const hasLoadedCourses = useRef(false);

  useEffect(() => {
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

    // Charger les cours du créateur (une seule fois)
    if (session && !hasLoadedCourses.current) {
      hasLoadedCourses.current = true;
      loadCourses();
    }
  }, [user, session, authLoading, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCourses = async () => {
    setLoadingCourses(true);

    try {
      // Utiliser directement Supabase au lieu de l'API route
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading courses:', error);
        return;
      }

      setCourses(courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
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

  const stats = [
    { 
      label: 'Revenus ce mois', 
      value: '0€', 
      change: '+0%', 
      icon: DollarSign, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Nouveaux étudiants', 
      value: '0', 
      change: '+0%', 
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: "Taux d'engagement", 
      value: '0%', 
      change: '+0%', 
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Cours actifs', 
      value: '0', 
      change: '+0', 
      icon: BookOpen, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
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
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Nouveau cours
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-green-500">{stat.change}</p>
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
                  <div className="aspect-video overflow-hidden bg-secondary">
                    {course.cover_image ? (
                      <img
                        src={course.cover_image}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Aucune activité récente</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Avis récents</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>Aucun avis pour le moment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
