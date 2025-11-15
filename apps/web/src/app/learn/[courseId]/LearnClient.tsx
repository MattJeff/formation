'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface LearnClientProps {
  courseId: string;
}

export function LearnClient({ courseId }: LearnClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?redirect=/learn/${courseId}`);
      return;
    }

    loadCourseData();
  }, [user, authLoading, courseId]);

  const loadCourseData = async () => {
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

      // Charger le cours avec sections et leçons
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
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <h1 className="mb-4 text-2xl font-bold">Cours non trouvé</h1>
        <Link href="/dashboard" className="text-primary hover:underline">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  // Aplatir toutes les leçons de toutes les sections
  const allLessons = course.sections
    ?.flatMap((section: any) =>
      section.lessons?.map((lesson: any) => ({
        ...lesson,
        sectionTitle: section.title,
      })) || []
    )
    .sort((a: any, b: any) => a.order_index - b.order_index) || [];

  const currentLesson = allLessons[0]; // Pour l'instant on affiche la première

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href={`/courses/${courseId}`} className="font-semibold hover:text-primary">
          ← Retour au cours
        </Link>
        <h1 className="text-lg font-semibold">{course.title}</h1>
        <div className="text-sm text-muted-foreground">
          {enrollment?.progress_percentage || 0}% terminé
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 overflow-y-auto border-r border-border bg-card p-4">
          <h2 className="mb-4 font-semibold">Contenu du cours</h2>
          <div className="space-y-4">
            {course.sections?.map((section: any, sectionIndex: number) => (
              <div key={section.id}>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Section {sectionIndex + 1}: {section.title}
                </h3>
                <div className="space-y-1">
                  {section.lessons?.map((lesson: any, lessonIndex: number) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-3 rounded-lg p-3 hover:bg-accent ${
                        lessonIndex === 0 && sectionIndex === 0 ? 'bg-primary/10' : ''
                      }`}
                    >
                      <Play className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <>
              <div className="aspect-video w-full bg-black">
                {currentLesson.type === 'video' && currentLesson.video_url ? (
                  <video
                    controls
                    className="h-full w-full"
                    src={currentLesson.video_url}
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                ) : (
                  <div className="flex h-full items-center justify-center text-white">
                    <Play className="h-20 w-20" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="mb-4 text-2xl font-bold">{currentLesson.title}</h2>
                <div className="prose prose-invert max-w-none">
                  {currentLesson.description && <p>{currentLesson.description}</p>}
                  {currentLesson.content && (
                    <div className="mt-4 whitespace-pre-wrap">
                      {currentLesson.content}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
                    <ChevronLeft className="h-5 w-5" />
                    Leçon précédente
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                    Leçon suivante
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Aucun contenu disponible</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
