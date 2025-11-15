'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Award,
  BookOpen,
  Target,
  Loader2,
  Star,
  Globe,
  ChevronDown,
  ChevronUp,
  Edit
} from 'lucide-react';

interface CourseDetailClientProps {
  courseId: string;
}

export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const hasLoadedCourse = useRef(false);

  useEffect(() => {
    if (!hasLoadedCourse.current) {
      hasLoadedCourse.current = true;
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (authLoading || !course) return;
    if (user) {
      checkEnrollment();
    }
  }, [user, course, authLoading]);

  const fetchCourse = async () => {
    try {
      console.log('📚 [COURSE DETAIL] Chargement du cours:', courseId);

      // Utiliser Supabase directement
      const { data: courseData, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:creator_id (first_name, last_name, avatar_url),
          sections(
            id,
            title,
            order_index,
            lessons(id, title, type, duration, order_index)
          )
        `)
        .eq('id', courseId)
        .single();

      if (error || !courseData) {
        console.error('❌ [COURSE DETAIL] Cours non trouvé:', error);
        setLoading(false);
        return;
      }

      // Charger le nombre d'inscriptions
      const { count: enrollmentsCount } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId);

      console.log('✅ [COURSE DETAIL] Cours chargé - Inscriptions:', enrollmentsCount);
      setEnrollmentCount(enrollmentsCount || 0);
      setCourse(courseData);
      setExpandedSections(new Set(courseData.sections?.map((s: any) => s.id) || []));
    } catch (error) {
      console.error('❌ [COURSE DETAIL] Erreur chargement cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, progress')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (enrollment) {
        setIsEnrolled(true);
        setHasProgress((enrollment.progress || 0) > 0);
      }
    } catch (error) {
      // Pas inscrit
      setIsEnrolled(false);
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

  if (loading || authLoading) {
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

  const totalLessons = course.sections?.reduce((acc: number, section: any) =>
    acc + (section.lessons?.length || 0), 0) || 0;

  const totalDuration = course.sections?.reduce((acc: number, section: any) =>
    acc + (section.lessons?.reduce((sum: number, lesson: any) =>
      sum + (lesson.duration || 0), 0) || 0), 0) || 0;

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Course Info */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {course.category?.replace('-', ' ').toUpperCase()}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {course.level === 'beginner' && 'Débutant'}
                  {course.level === 'intermediate' && 'Intermédiaire'}
                  {course.level === 'advanced' && 'Avancé'}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
              <p className="mb-6 text-xl text-muted-foreground">{course.subtitle}</p>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.rating} ({course.review_count || 0} avis)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{enrollmentCount} étudiant{enrollmentCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{hours}h{minutes > 0 && `${minutes}m`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Français</span>
                </div>
              </div>

              {course.profiles && (
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-lg font-bold">
                    {course.profiles.first_name?.[0]}{course.profiles.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      Créé par {course.profiles.first_name} {course.profiles.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">Formateur certifié</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Course Card */}
            <div className="lg:pl-8">
              <div className="sticky top-24 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                {course.cover_image && (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="p-6">
                  {!user && (
                    <>
                      <div className="mb-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{course.price}€</span>
                        {course.compare_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            {course.compare_price}€
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => router.push('/login')}
                        className="mb-3 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        {course.price === 0 ? "S'inscrire gratuitement" : "Acheter maintenant"}
                      </button>

                      <p className="mb-4 text-center text-xs text-muted-foreground">
                        Garantie satisfait ou remboursé 30 jours
                      </p>
                    </>
                  )}

                  {user && course.creator_id !== user?.id && (
                    <>
                      <div className="mb-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{course.price}€</span>
                        {course.compare_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            {course.compare_price}€
                          </span>
                        )}
                      </div>

                      {isEnrolled ? (
                        <Link
                          href={`/courses/${courseId}/learn`}
                          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                          <PlayCircle className="h-5 w-5" />
                          {hasProgress ? 'Continuer le cours' : 'Commencer le cours'}
                        </Link>
                      ) : (
                        <button
                          onClick={() => router.push(course.price === 0 ? `/courses/${courseId}/enroll` : `/courses/${courseId}/checkout`)}
                          className="mb-3 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                          {course.price === 0 ? "S'inscrire gratuitement" : "Acheter maintenant"}
                        </button>
                      )}

                      <p className="mb-4 text-center text-xs text-muted-foreground">
                        Garantie satisfait ou remboursé 30 jours
                      </p>
                    </>
                  )}

                  {course.creator_id === user?.id && (
                    <>
                      <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-center">
                        <p className="text-sm font-medium text-primary">
                          👨‍🏫 Vous êtes le créateur de ce cours
                        </p>
                      </div>

                      <Link
                        href={`/courses/${courseId}/learn`}
                        className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        <PlayCircle className="h-5 w-5" />
                        Prévisualiser le cours
                      </Link>

                      <Link
                        href={`/creator/courses/${courseId}/edit`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-transparent py-3 font-semibold text-primary hover:bg-primary/10"
                      >
                        <Edit className="h-5 w-5" />
                        Modifier le cours
                      </Link>
                    </>
                  )}

                  <div className="space-y-3 border-t border-border pt-4">
                    <h3 className="font-semibold">Ce cours inclut :</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary" />
                        <span>{totalLessons} leçons vidéo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Ressources téléchargeables</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Certificat de fin de formation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Accès à vie</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <p className="whitespace-pre-line text-muted-foreground">{course.description}</p>
            </div>

            {/* Learning Objectives */}
            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Ce que vous apprendrez</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {course.learning_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Contenu du cours</h2>
              <div className="space-y-2">
                {course.sections?.map((section: any) => (
                  <div key={section.id} className="overflow-hidden rounded-lg border border-border">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between bg-secondary p-4 hover:bg-secondary/80"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{section.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {section.lessons?.length || 0} leçons
                        </span>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {expandedSections.has(section.id) && (
                      <div className="divide-y divide-border">
                        {section.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-4">
                            {lesson.type === 'video' && <PlayCircle className="h-5 w-5 text-primary" />}
                            {lesson.type === 'quiz' && <FileText className="h-5 w-5 text-primary" />}
                            <span className="flex-1">{lesson.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration} min
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Prérequis</h2>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target Audience */}
            {course.target_audience && course.target_audience.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">À qui s'adresse ce cours ?</h2>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  {course.target_audience.map((audience: string, index: number) => (
                    <li key={index}>{audience}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm">Leçons</span>
                  </div>
                  <span className="font-semibold">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm">Durée</span>
                  </div>
                  <span className="font-semibold">{hours}h{minutes}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm">Niveau</span>
                  </div>
                  <span className="font-semibold capitalize">{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
