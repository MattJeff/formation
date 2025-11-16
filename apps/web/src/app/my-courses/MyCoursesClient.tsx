'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Loader2, PlayCircle, Award, Download } from 'lucide-react';
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
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!user || authLoading) return;
    loadEnrollments();
  }, [user, authLoading]);

  useEffect(() => {
    let filtered = enrollments;

    // Filtre par recherche
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(e =>
        e.courses.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${e.courses.profiles?.first_name} ${e.courses.profiles?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter === 'completed') {
      filtered = filtered.filter(e => e.progress_percentage === 100);
    } else if (statusFilter === 'in_progress') {
      filtered = filtered.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100);
    }

    setFilteredEnrollments(filtered);
  }, [searchQuery, enrollments, statusFilter]);

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
      setFilteredEnrollments(transformedData as EnrollmentWithCourse[]);
    } catch (error) {
      console.error('❌ [MY COURSES] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (enrollmentId: string, courseTitle: string) => {
    try {
      setDownloadingCertificate(enrollmentId);
      console.log('📜 [MY COURSES] Téléchargement certificat:', enrollmentId);

      const response = await fetch(`/api/certificates/${enrollmentId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur téléchargement certificat');
      }

      // Créer un blob et télécharger
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificat-${courseTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ [MY COURSES] Certificat téléchargé');
    } catch (error: any) {
      console.error('❌ [MY COURSES] Erreur téléchargement:', error);
      alert(error.message);
    } finally {
      setDownloadingCertificate(null);
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent ${
                showFilters ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              <Filter className="h-5 w-5" />
              Filtres
            </button>
          </div>
        )}

        {/* Panel de filtres */}
        {showFilters && enrollments.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Filtrer par statut</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  statusFilter === 'all'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                Tous ({enrollments.length})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  statusFilter === 'in_progress'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                En cours ({enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  statusFilter === 'completed'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                Complétés ({enrollments.filter(e => e.progress_percentage === 100).length})
              </button>
            </div>
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
              <div
                key={enrollment.id}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all"
              >
                <Link href={`/learn/${enrollment.courses.id}`} className="block">
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
                    {enrollment.progress_percentage === 100 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Terminé
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/learn/${enrollment.courses.id}`}>
                    <h3 className="mb-2 font-semibold group-hover:text-primary line-clamp-2">
                      {enrollment.courses.title}
                    </h3>
                  </Link>
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

                    {/* Bouton Certificat */}
                    {enrollment.progress_percentage === 100 && (
                      <button
                        onClick={() => downloadCertificate(enrollment.id, enrollment.courses.title)}
                        disabled={downloadingCertificate === enrollment.id}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border-2 border-green-500 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
                      >
                        {downloadingCertificate === enrollment.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Télécharger le certificat
                          </>
                        )}
                      </button>
                    )}
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
