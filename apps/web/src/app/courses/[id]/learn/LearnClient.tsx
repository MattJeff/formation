'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, CheckCircle, PlayCircle, FileText, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface LearnClientProps {
  courseId: string;
}

export function LearnClient({ courseId }: LearnClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?redirect=/courses/${courseId}/learn`);
      return;
    }

    loadCourse();
  }, [user, authLoading, courseId]);

  const loadCourse = async () => {
    if (!user) return;

    try {
      console.log('📚 [LEARN] Chargement du cours:', courseId);

      // Vérifier l'inscription
      const { data: enrollmentData, error: enrollError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (enrollError || !enrollmentData) {
        console.error('❌ [LEARN] Non inscrit:', enrollError);
        router.push(`/courses/${courseId}`);
        return;
      }

      setEnrollment(enrollmentData);

      // Charger le cours
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:creator_id (first_name, last_name),
          sections(
            id,
            title,
            order_index,
            lessons(
              id,
              title,
              type,
              duration,
              description,
              content,
              file_url,
              video_url,
              order_index
            )
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        console.error('❌ [LEARN] Cours non trouvé:', courseError);
        setLoading(false);
        return;
      }

      console.log('✅ [LEARN] Cours chargé:', courseData.title);
      setCourse(courseData);

      // Expand all sections by default
      setExpandedSections(new Set(courseData.sections?.map((s: any) => s.id) || []));
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Cours non trouvé</h1>
        <Link href="/courses" className="text-primary hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link
          href={`/courses/${courseId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au cours
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.subtitle}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contenu du cours</h2>
            <div className="rounded-full bg-primary/10 px-4 py-2">
              <span className="text-sm font-medium text-primary">
                Progression: {enrollment?.progress_percentage || 0}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {course.sections?.map((section: any, sectionIndex: number) => (
              <div key={section.id} className="overflow-hidden rounded-lg border border-border">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between bg-secondary p-4 hover:bg-secondary/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Section {sectionIndex + 1}
                    </span>
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {expandedSections.has(section.id) && (
                  <div className="bg-card p-4">
                    <div className="space-y-2">
                      {section.lessons?.map((lesson: any, lessonIndex: number) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-accent"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                            {lesson.type === 'video' && <PlayCircle className="h-4 w-4 text-primary" />}
                            {lesson.type === 'text' && <FileText className="h-4 w-4 text-primary" />}
                            {lesson.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!course.sections || course.sections.length === 0) && (
            <div className="py-12 text-center text-muted-foreground">
              <p>Aucun contenu disponible pour le moment.</p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-center text-muted-foreground">
            🚧 <strong>Version basique :</strong> Le lecteur vidéo et le suivi de progression seront ajoutés prochainement.
          </p>
        </div>
      </div>
    </div>
  );
}
