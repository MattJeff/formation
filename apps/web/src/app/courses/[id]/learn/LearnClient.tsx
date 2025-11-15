'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  FileText,
  Download,
  ExternalLink,
  Edit,
  Loader2,
  MessageCircle,
  Send,
  Reply,
  CheckCircle,
  X,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'pdf' | 'link' | 'file';
  duration: number;
  description?: string;
  content?: string;
  video_url?: string;
  file_url?: string;
  order_index: number;
  section_id: string;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover_image?: string;
  creator_id: string;
  sections: Section[];
}

interface Comment {
  id: string;
  user_id: string;
  lesson_id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  is_validated: boolean;
  profiles: {
    first_name: string;
    last_name: string;
  };
  replies?: Comment[];
}

export function LearnClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const isCreator = user?.id === course?.creator_id;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCourse();
    loadAllProgress();
  }, [courseId, user]);

  useEffect(() => {
    const lessonId = searchParams.get('lesson');
    if (lessonId && course) {
      // Trouver la leçon correspondante
      for (const section of course.sections) {
        const lesson = section.lessons.find(l => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          loadComments(lessonId);
          return;
        }
      }
    } else if (course && course.sections.length > 0 && course.sections[0].lessons.length > 0) {
      // Par défaut, afficher la première leçon
      const firstLesson = course.sections[0].lessons[0];
      setCurrentLesson(firstLesson);
      loadComments(firstLesson.id);
    }
  }, [searchParams, course]);

  const checkEnrollment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsEnrolled(data.enrolled);
      }
    } catch (error) {
      console.error('Erreur vérification enrollment:', error);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const loadAllProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // On chargera la progression une fois qu'on aura le cours
      // Cette fonction sera appelée après le chargement du cours
    } catch (error) {
      console.error('Erreur chargement progression:', error);
    }
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok && data.course) {
        // Trier les sections et leçons
        const sortedCourse = {
          ...data.course,
          sections: (data.course.sections || [])
            .sort((a: Section, b: Section) => a.order_index - b.order_index)
            .map((section: Section) => ({
              ...section,
              lessons: (section.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index),
            })),
        };

        setCourse(sortedCourse);

        // Vérifier l'enrollment (sauf pour le créateur)
        if (user?.id !== sortedCourse.creator_id) {
          await checkEnrollment();
        } else {
          // Le créateur est automatiquement "inscrit"
          setIsEnrolled(true);
          setCheckingEnrollment(false);
        }

        // Charger la progression pour toutes les leçons
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const allLessonIds: string[] = [];
          sortedCourse.sections.forEach((section: Section) => {
            section.lessons.forEach((lesson: Lesson) => {
              allLessonIds.push(lesson.id);
            });
          });

          // Charger la progression pour chaque leçon
          const progressPromises = allLessonIds.map(async (lessonId) => {
            try {
              const progressResponse = await fetch(`/api/lessons/${lessonId}/progress`, {
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                },
              });
              const progressData = await progressResponse.json();
              if (progressResponse.ok && progressData.progress?.completed) {
                return lessonId;
              }
            } catch (error) {
              console.error(`Erreur chargement progression leçon ${lessonId}:`, error);
            }
            return null;
          });

          const completedLessonIds = (await Promise.all(progressPromises)).filter(id => id !== null) as string[];
          setCompletedLessons(new Set(completedLessonIds));
        }
      } else {
        alert('Cours non trouvé');
        router.push('/courses');
      }
    } catch (error) {
      console.error('Erreur chargement cours:', error);
      alert('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (lessonId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !currentLesson || !course) return;

    try {
      setSendingComment(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/lessons/${currentLesson.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: newComment,
          courseId: course.id,
        }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments(currentLesson.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de l\'envoi du commentaire');
      }
    } catch (error) {
      console.error('Erreur envoi commentaire:', error);
      alert('Erreur lors de l\'envoi du commentaire');
    } finally {
      setSendingComment(false);
    }
  };

  const handleSendReply = async (parentId: string) => {
    if (!replyContent.trim() || !currentLesson || !course) return;

    try {
      setSendingComment(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/lessons/${currentLesson.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: replyContent,
          courseId: course.id,
          parentId,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        loadComments(currentLesson.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      console.error('Erreur envoi réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    } finally {
      setSendingComment(false);
    }
  };

  const handleValidateComment = async (commentId: string) => {
    if (!currentLesson || !isCreator) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/comments/${commentId}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        loadComments(currentLesson.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur validation commentaire:', error);
      alert('Erreur lors de la validation');
    }
  };

  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // Créer une map de tous les commentaires
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Construire l'arbre
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies!.push(commentNode);
        }
      } else {
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!course) return;

    const isCompleted = completedLessons.has(lessonId);
    const newCompleted = !isCompleted;

    // Mettre à jour l'UI immédiatement
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newCompleted) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      return newSet;
    });

    // Sauvegarder dans la base de données
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          completed: newCompleted,
          courseId: course.id,
        }),
      });

      if (!response.ok) {
        // Si ça échoue, annuler le changement dans l'UI
        setCompletedLessons(prev => {
          const newSet = new Set(prev);
          if (isCompleted) {
            newSet.add(lessonId);
          } else {
            newSet.delete(lessonId);
          }
          return newSet;
        });
        const data = await response.json();
        alert(data.error || 'Erreur lors de la sauvegarde de la progression');
      }
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error);
      // Annuler le changement dans l'UI
      setCompletedLessons(prev => {
        const newSet = new Set(prev);
        if (isCompleted) {
          newSet.add(lessonId);
        } else {
          newSet.delete(lessonId);
        }
        return newSet;
      });
    }
  };

  const goToLesson = (lesson: Lesson) => {
    router.push(`/courses/${courseId}/learn?lesson=${lesson.id}`);
  };

  const goToPreviousLesson = () => {
    if (!currentLesson || !course) return;

    let previousLesson: Lesson | null = null;
    let found = false;

    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (found) {
          // On a déjà trouvé la leçon courante, donc on sort
          break;
        }
        if (lesson.id === currentLesson.id) {
          found = true;
          break;
        }
        previousLesson = lesson;
      }
      if (found) break;
    }

    if (previousLesson) {
      goToLesson(previousLesson);
    }
  };

  const goToNextLesson = () => {
    if (!currentLesson || !course) return;

    let foundCurrent = false;

    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (foundCurrent) {
          goToLesson(lesson);
          return;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
  };

  const hasPreviousLesson = () => {
    if (!currentLesson || !course) return false;
    const firstLesson = course.sections[0]?.lessons[0];
    return currentLesson.id !== firstLesson?.id;
  };

  const hasNextLesson = () => {
    if (!currentLesson || !course) return false;
    const lastSection = course.sections[course.sections.length - 1];
    const lastLesson = lastSection?.lessons[lastSection.lessons.length - 1];
    return currentLesson.id !== lastLesson?.id;
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        if (currentLesson.video_url) {
          // Vérifier si c'est une URL YouTube ou Vimeo
          const isYouTube = currentLesson.video_url.includes('youtube.com') || currentLesson.video_url.includes('youtu.be');
          const isVimeo = currentLesson.video_url.includes('vimeo.com');

          if (isYouTube || isVimeo) {
            return (
              <div className="aspect-video w-full">
                <iframe
                  src={currentLesson.video_url}
                  className="h-full w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          } else {
            // Vidéo uploadée
            return (
              <video
                src={currentLesson.video_url}
                controls
                className="w-full rounded-lg"
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            );
          }
        }
        return <p className="text-muted-foreground">Aucune vidéo disponible</p>;

      case 'text':
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{currentLesson.content || 'Aucun contenu'}</div>
          </div>
        );

      case 'pdf':
        if (currentLesson.file_url) {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium">Document PDF</p>
                    <p className="text-sm text-muted-foreground">Cliquez pour télécharger ou visualiser</p>
                  </div>
                </div>
                <a
                  href={currentLesson.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </a>
              </div>
              <iframe
                src={currentLesson.file_url}
                className="h-[600px] w-full rounded-lg border border-border"
              />
            </div>
          );
        }
        return <p className="text-muted-foreground">Aucun PDF disponible</p>;

      case 'link':
        if (currentLesson.content) {
          return (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <ExternalLink className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Lien externe</p>
                  <p className="text-sm text-muted-foreground">Cliquez pour ouvrir dans un nouvel onglet</p>
                </div>
              </div>
              <a
                href={currentLesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir le lien
              </a>
            </div>
          );
        }
        return <p className="text-muted-foreground">Aucun lien disponible</p>;

      case 'file':
        if (currentLesson.file_url) {
          return (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Download className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Fichier téléchargeable</p>
                  <p className="text-sm text-muted-foreground">Téléchargez le fichier pour cette leçon</p>
                </div>
              </div>
              <a
                href={currentLesson.file_url}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Télécharger le fichier
              </a>
            </div>
          );
        }
        return <p className="text-muted-foreground">Aucun fichier disponible</p>;

      default:
        return <p className="text-muted-foreground">Type de contenu non supporté</p>;
    }
  };

  if (loading || checkingEnrollment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cours non trouvé</p>
      </div>
    );
  }

  // Bloquer l'accès si l'utilisateur n'est pas inscrit et n'est pas le créateur
  if (!isEnrolled && !isCreator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="rounded-full bg-orange-500/10 p-4">
          <Lock className="h-12 w-12 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold">Accès restreint</h1>
        <p className="max-w-md text-center text-muted-foreground">
          Vous devez vous inscrire à ce cours pour accéder au contenu.
        </p>
        <div className="flex gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="rounded-lg border border-border px-6 py-2 hover:bg-accent"
          >
            Voir les détails du cours
          </Link>
          <Link
            href={`/courses/${courseId}`}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Liste des leçons */}
      <div className="hidden w-80 flex-shrink-0 border-r border-border bg-card lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border p-4">
            <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              Retour au cours
            </Link>
            <h2 className="mt-3 line-clamp-2 font-semibold">{course.title}</h2>
          </div>

          {/* Liste des sections et leçons */}
          <div className="p-4">
            {course.sections.map((section, sectionIndex) => (
              <div key={section.id} className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Section {sectionIndex + 1}: {section.title}
                </h3>
                <div className="space-y-1">
                  {section.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isCurrent = currentLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => goToLesson(lesson)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{lessonIndex + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`truncate text-sm ${isCurrent ? 'font-medium' : ''}`}>
                            {lesson.title}
                          </p>
                          <p className={`text-xs ${isCurrent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {lesson.duration} min
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        <div className="mx-auto max-w-5xl p-6">
          {/* En-tête */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
              {currentLesson?.description && (
                <p className="mt-1 text-muted-foreground">{currentLesson.description}</p>
              )}
            </div>
            {isCreator && (
              <Link
                href={`/creator/courses/${courseId}/edit`}
                className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20"
              >
                <Edit className="h-4 w-4" />
                Éditer la formation
              </Link>
            )}
          </div>

          {/* Contenu de la leçon */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6">
            {renderLessonContent()}
          </div>

          {/* Marquer comme terminé */}
          {currentLesson && (
            <div className="mb-6">
              <button
                onClick={() => toggleLessonCompletion(currentLesson.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                  completedLessons.has(currentLesson.id)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <Check className="h-4 w-4" />
                {completedLessons.has(currentLesson.id) ? 'Leçon terminée' : 'Marquer comme terminé'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={goToPreviousLesson}
              disabled={!hasPreviousLesson()}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Leçon précédente
            </button>
            <button
              onClick={goToNextLesson}
              disabled={!hasNextLesson()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Leçon suivante
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Section commentaires */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <MessageCircle className="h-5 w-5" />
              Discussion
            </h2>

            {/* Formulaire de commentaire */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Poser une question ou partager votre avis..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 min-h-[100px]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSendComment}
                  disabled={sendingComment || !newComment.trim()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {sendingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Envoyer
                </button>
              </div>
            </div>

            {/* Liste des commentaires */}
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Aucun commentaire pour l'instant. Soyez le premier à commenter !
              </p>
            ) : (
              <div className="space-y-4">
                {buildCommentTree(comments).map((comment) => {
                  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
                    <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-3' : ''}`}>
                      <div className="rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                              {comment.profiles.first_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {comment.profiles.first_name} {comment.profiles.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            {comment.is_validated && (
                              <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Validée
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="mb-3 text-sm">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(comment.id);
                              setReplyContent('');
                            }}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Reply className="h-3 w-3" />
                            Répondre
                          </button>
                          {isCreator && !comment.is_validated && depth > 0 && (
                            <button
                              onClick={() => handleValidateComment(comment.id)}
                              className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Marquer comme validée
                            </button>
                          )}
                        </div>

                        {/* Formulaire de réponse */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-muted-foreground">
                                Réponse à {comment.profiles.first_name}
                              </p>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                className="rounded p-1 hover:bg-accent"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Écrivez votre réponse..."
                              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                              autoFocus
                              dir="ltr"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-accent"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleSendReply(comment.id)}
                                disabled={sendingComment || !replyContent.trim()}
                                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                              >
                                {sendingComment ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3" />
                                )}
                                Envoyer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Réponses imbriquées */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                          {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                          ))}
                        </div>
                      )}
                    </div>
                  );

                  return <CommentItem key={comment.id} comment={comment} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
