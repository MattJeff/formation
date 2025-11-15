'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Plus, BookOpen, Users, Clock, TrendingUp, Edit, Eye } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  price: number;
  compare_price: number | null;
  cover_image: string | null;
  status: 'draft' | 'published' | 'archived';
  total_students: number;
  total_lessons: number;
  total_duration: number;
  created_at: string;
}

export default function CoursesClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    console.log('🔄 [COURSES] useEffect appelé - authLoading:', authLoading, 'user:', !!user, 'userId:', user?.id, 'hasAttempted:', hasAttemptedLoad);

    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Charger UNE SEULE FOIS
    if (user.id && !hasAttemptedLoad) {
      console.log('🚀 [COURSES] Déclenchement du chargement');
      setHasAttemptedLoad(true);
      loadCourses();
    }
  }, [user?.id, authLoading, hasAttemptedLoad]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      console.log('📚 [COURSES] Chargement des cours pour:', user?.id);

      // Utiliser directement Supabase au lieu de l'API route
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [COURSES] Erreur chargement cours:', error);
        return;
      }

      console.log('✅ [COURSES] Cours chargés:', courses?.length || 0, 'cours');
      setCourses(courses || []);
    } catch (error) {
      console.error('❌ [COURSES] Erreur chargement cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((acc, c) => acc + c.total_students, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mes Formations</h1>
            <p className="text-muted-foreground">Gérez vos cours et suivez leurs performances</p>
          </div>
          <Link
            href="/creator/courses/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Créer un cours
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cours</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publiés</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Edit className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === 'published'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            Publiés ({stats.published})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === 'draft'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            Brouillons ({stats.draft})
          </button>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Chargement de vos cours...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {filter === 'all' ? 'Aucun cours créé' : `Aucun cours ${filter === 'published' ? 'publié' : 'en brouillon'}`}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === 'all' 
                ? 'Commencez par créer votre premier cours'
                : `Vous n'avez pas encore de cours ${filter === 'published' ? 'publié' : 'en brouillon'}`
              }
            </p>
            {filter === 'all' && (
              <Link
                href="/creator/courses/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Créer mon premier cours
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-colors">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                  {course.cover_image ? (
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        course.status === 'published'
                          ? 'bg-green-500 text-white'
                          : course.status === 'draft'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {course.status === 'published' ? 'Publié' : course.status === 'draft' ? 'Brouillon' : 'Archivé'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2">{course.title}</h3>
                  {course.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.subtitle}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.total_students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.total_lessons} leçons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(course.total_duration / 60)}h</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold">{course.price}€</span>
                    {course.compare_price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {course.compare_price}€
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/creator/courses/${course.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
