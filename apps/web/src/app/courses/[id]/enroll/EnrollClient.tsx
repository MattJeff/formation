'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface EnrollClientProps {
  courseId: string;
}

export function EnrollClient({ courseId }: EnrollClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?redirect=/courses/${courseId}/enroll`);
      return;
    }

    loadCourse();
  }, [user, authLoading, courseId]);

  const loadCourse = async () => {
    try {
      console.log('📚 [ENROLL] Chargement du cours:', courseId);

      const { data: courseData, error } = await supabase
        .from('courses')
        .select('id, title, price, cover_image, creator_id')
        .eq('id', courseId)
        .single();

      if (error || !courseData) {
        console.error('❌ [ENROLL] Cours non trouvé:', error);
        setError('Cours non trouvé');
        setLoading(false);
        return;
      }

      // Vérifier que le cours est gratuit
      if (courseData.price > 0) {
        console.error('❌ [ENROLL] Ce cours n\'est pas gratuit');
        setError('Ce cours n\'est pas gratuit. Veuillez passer par le paiement.');
        setLoading(false);
        return;
      }

      console.log('✅ [ENROLL] Cours chargé:', courseData.title);
      setCourse(courseData);

      // Auto-inscription
      handleEnroll(courseData);
    } catch (error) {
      console.error('❌ [ENROLL] Erreur chargement cours:', error);
      setError('Erreur lors du chargement du cours');
      setLoading(false);
    }
  };

  const handleEnroll = async (courseData: any) => {
    if (!user) return;

    setEnrolling(true);
    setError(null);

    try {
      console.log('🎓 [ENROLL] Inscription au cours gratuit...');

      // Vérifier si déjà inscrit
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existingEnrollment) {
        console.log('ℹ️ [ENROLL] Déjà inscrit, redirection...');
        router.push(`/learn/${courseId}`);
        return;
      }

      // Créer l'inscription
      const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          payment_status: 'free',
          payment_amount: 0,
          status: 'active',
        })
        .select()
        .single();

      if (enrollError) {
        console.error('❌ [ENROLL] Erreur inscription:', enrollError);
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
        setEnrolling(false);
        return;
      }

      console.log('✅ [ENROLL] Inscription réussie!', enrollment);
      setSuccess(true);

      // Redirection après 1 seconde
      setTimeout(() => {
        router.push(`/learn/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error('❌ [ENROLL] Erreur:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setEnrolling(false);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h1 className="mb-4 text-2xl font-bold">Erreur</h1>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
            >
              Retour au cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="mb-4 text-2xl font-bold">Inscription réussie !</h1>
            <p className="mb-6 text-muted-foreground">
              Vous êtes maintenant inscrit à <strong>{course?.title}</strong>
            </p>
            <p className="text-sm text-muted-foreground">Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-4 text-2xl font-bold">Inscription en cours...</h1>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    </div>
  );
}
