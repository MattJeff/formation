'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Loader2, CheckCircle, Circle, FileText, Video, Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface LearnClientProps {
  courseId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export function LearnClient({ courseId }: LearnClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?redirect=/learn/${courseId}`);
      return;
    }

    loadCourseData();
  }, [user, authLoading, courseId]);

  useEffect(() => {
    if (allLessons.length > 0 && allLessons[currentLessonIndex]) {
      loadComments(allLessons[currentLessonIndex].id);
    }
  }, [currentLessonIndex, allLessons]);

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

      // Aplatir toutes les leçons de toutes les sections
      const lessons = courseData.sections
        ?.flatMap((section: any) =>
          section.lessons?.map((lesson: any) => ({
            ...lesson,
            sectionTitle: section.title,
          })) || []
        )
        .sort((a: any, b: any) => a.order_index - b.order_index) || [];

      setAllLessons(lessons);

      // Charger la progression
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('completed', true);

      if (progressData) {
        setCompletedLessons(new Set(progressData.map((p: any) => p.lesson_id)));
      }

      // Trouver la première leçon non complétée ou la première
      const firstIncomplete = lessons.findIndex(
        (lesson: any) => !progressData?.some((p: any) => p.lesson_id === lesson.id)
      );
      setCurrentLessonIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (lessonId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (first_name, last_name, avatar_url)
        `)
        .eq('lesson_id', lessonId)
        .eq('course_id', courseId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [LEARN] Erreur chargement commentaires:', error);
        return;
      }

      setComments((data as any) || []);
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const sendComment = async () => {
    if (!newComment.trim() || !user) return;

    setSendingComment(true);
    try {
      const currentLesson = allLessons[currentLessonIndex];

      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: currentLesson.id,
          course_id: courseId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) {
        console.error('❌ [LEARN] Erreur envoi commentaire:', error);
        return;
      }

      setNewComment('');
      await loadComments(currentLesson.id);
      console.log('✅ [LEARN] Commentaire envoyé');
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    } finally {
      setSendingComment(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('❌ [LEARN] Erreur marquage leçon:', error);
        return;
      }

      setCompletedLessons(prev => new Set([...prev, lessonId]));

      const newCompleted = completedLessons.size + 1;
      const progressPercentage = Math.round((newCompleted / allLessons.length) * 100);

      await supabase
        .from('enrollments')
        .update({ progress_percentage: progressPercentage })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      console.log('✅ [LEARN] Leçon marquée comme complétée');
    } catch (error) {
      console.error('❌ [LEARN] Erreur:', error);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const currentLesson = allLessons[currentLessonIndex];
      if (!completedLessons.has(currentLesson.id)) {
        markLessonComplete(currentLesson.id);
      }
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const selectLesson = (index: number) => {
    setCurrentLessonIndex(index);
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

  const currentLesson = allLessons[currentLessonIndex];
  const progressPercentage = allLessons.length > 0
    ? Math.round((completedLessons.size / allLessons.length) * 100)
    : 0;

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        return currentLesson.video_url ? (
          <video
            controls
            className="h-full w-full"
            src={currentLesson.video_url}
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            <Video className="h-20 w-20" />
          </div>
        );

      case 'pdf':
        return currentLesson.file_url ? (
          <iframe
            src={currentLesson.file_url}
            className="h-full w-full"
            title={currentLesson.title}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            <FileText className="h-20 w-20" />
          </div>
        );

      case 'article':
        return (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-background p-8">
            <div className="max-w-3xl">
              <FileText className="mx-auto mb-4 h-20 w-20 text-primary" />
              <h3 className="text-center text-2xl font-bold text-white">Article</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Le contenu est disponible ci-dessous
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-full items-center justify-center text-white">
            <Play className="h-20 w-20" />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href={`/courses/${courseId}`} className="font-semibold hover:text-primary">
          ← Retour au cours
        </Link>
        <h1 className="text-lg font-semibold">{course.title}</h1>
        <div className="text-sm text-muted-foreground">
          {progressPercentage}% terminé
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
                  {section.lessons?.map((lesson: any) => {
                    const lessonIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
                    const isCompleted = completedLessons.has(lesson.id);
                    const isCurrent = lessonIndex === currentLessonIndex;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lessonIndex)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-accent ${
                          isCurrent ? 'bg-primary/10' : ''
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <>
              <div className="aspect-video w-full bg-black">
                {renderLessonContent()}
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentLesson.type === 'video' && '📹 Vidéo'}
                      {currentLesson.type === 'pdf' && '📄 PDF'}
                      {currentLesson.type === 'article' && '📝 Article'}
                      {' • '}{currentLesson.duration}
                    </p>
                  </div>
                  {completedLessons.has(currentLesson.id) ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Complété</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      Marquer comme complété
                    </button>
                  )}
                </div>

                {/* Description et contenu */}
                <div className="prose prose-invert max-w-none mb-8">
                  {currentLesson.description && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{currentLesson.description}</p>
                    </div>
                  )}
                  {currentLesson.content && (
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-lg font-semibold mb-2">Contenu</h3>
                      <div className="whitespace-pre-wrap text-muted-foreground">
                        {currentLesson.content}
                      </div>
                    </div>
                  )}
                  {currentLesson.file_url && currentLesson.type !== 'pdf' && (
                    <div className="mt-4">
                      <a
                        href={currentLesson.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary/10"
                      >
                        <FileText className="h-4 w-4" />
                        Télécharger le fichier
                      </a>
                    </div>
                  )}
                </div>

                {/* Section Commentaires */}
                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <MessageCircle className="h-5 w-5" />
                    Commentaires ({comments.length})
                  </h3>

                  {/* Formulaire nouveau commentaire */}
                  <div className="mb-6 rounded-lg border border-border bg-card p-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Posez une question ou partagez vos réflexions..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={sendComment}
                        disabled={!newComment.trim() || sendingComment}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sendingComment ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Publier
                      </button>
                    </div>
                  </div>

                  {/* Liste des commentaires */}
                  {loadingComments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                      Aucun commentaire pour le moment. Soyez le premier à commenter!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
                          <div className="mb-2 flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                              {comment.profiles?.first_name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {comment.profiles?.first_name} {comment.profiles?.last_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between border-t border-border pt-6">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Leçon précédente
                  </button>
                  <button
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex === allLessons.length - 1}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
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
