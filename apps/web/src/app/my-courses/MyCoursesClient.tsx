'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface EnrollmentWithCourse {
  id: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
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

export function MyCoursesClient() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user || authLoading) return;
    loadEnrollments();
  }, [user, authLoading]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEnrollments(enrollments);
    } else {
      const filtered = enrollments.filter(e =>
        e.courses.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${e.courses.profiles?.first_name} ${e.courses.profiles?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEnrollments(filtered);
    }
  }, [searchQuery, enrollments]);

  const loadEnrollments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress_percentage,
          created_at,
          updated_at,
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
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ [MY COURSES] Erreur:', error);
        return;
      }

      setEnrollments(data as EnrollmentWithCourse[] || []);
      setFilteredEnrollments(data as EnrollmentWithCourse[] || []);
    } catch (error) {
      console.error('❌ [MY COURSES] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Mes cours ({enrollments.length})</h1>

        {enrollments.length > 0 && (
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans mes cours..."
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
              <Filter className="h-5 w-5" />
              Filtres
            </button>
          </div>
        )}

        {filteredEnrollments.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">
              {enrollments.length === 0 ? 'Aucun cours' : 'Aucun résultat'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {enrollments.length === 0
                ? 'Vous n\'êtes inscrit à aucun cours pour le moment.'
                : 'Aucun cours ne correspond à votre recherche.'}
            </p>
            {enrollments.length === 0 && (
              <Link
                href="/courses"
                className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Explorer les cours
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/learn/${enrollment.courses.id}`}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all"
              >
                <div className="relative">
                  <img
                    src={enrollment.courses.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={enrollment.courses.title}
                    className="aspect-video w-full object-cover"
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
                  <p className="mb-3 text-sm text-muted-foreground">
                    Par {enrollment.courses.profiles?.first_name} {enrollment.courses.profiles?.last_name}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dernier accès: {new Date(enrollment.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
