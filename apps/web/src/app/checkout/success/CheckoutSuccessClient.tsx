'use client';

// ============================================
// ✅ CHECKOUT SUCCESS CLIENT
// ============================================
// Composant client pour la page de succès
// Vérifie le paiement et redirige vers le cours
// ============================================

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('✅ [CHECKOUT SUCCESS] Page chargée');

    const sessionId = searchParams.get('session_id');
    console.log('📋 [CHECKOUT SUCCESS] Session ID:', sessionId);

    if (!sessionId) {
      console.error('❌ [CHECKOUT SUCCESS] Pas de session_id dans l\'URL');
      setError('Session de paiement non trouvée');
      setLoading(false);
      return;
    }

    if (authLoading) {
      console.log('⏳ [CHECKOUT SUCCESS] Attente auth...');
      return;
    }

    if (!user) {
      console.log('❌ [CHECKOUT SUCCESS] Non connecté');
      router.push('/login');
      return;
    }

    verifyPaymentAndRedirect(sessionId);
  }, [searchParams, user, authLoading]);

  const verifyPaymentAndRedirect = async (sessionId: string) => {
    try {
      console.log('🔍 [CHECKOUT SUCCESS] Vérification et création enrollment...');

      // Appeler la nouvelle API qui vérifie ET crée l'enrollment
      const response = await fetch('/api/stripe/verify-and-enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId: user!.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [CHECKOUT SUCCESS] Erreur API:', data);
        setError(data.error || 'Erreur lors de la vérification du paiement');
        setLoading(false);
        return;
      }

      console.log('✅ [CHECKOUT SUCCESS] Enrollment OK:', data);

      const { courseId, alreadyExists } = data;

      if (alreadyExists) {
        console.log('ℹ️ [CHECKOUT SUCCESS] Enrollment existait déjà');
      }

      // Récupérer le titre du cours
      const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single();

      setCourseId(courseId);
      setCourseName(course?.title || 'votre cours');
      setLoading(false);

      // Redirection automatique après 2 secondes
      setTimeout(() => {
        router.push(`/learn/${courseId}`);
      }, 2000);
    } catch (error) {
      console.error('❌ [CHECKOUT SUCCESS] Erreur:', error);
      setError('Erreur lors de la vérification du paiement');
      setLoading(false);
    }
  };

  // État: Chargement
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-lg border border-border bg-card p-8">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <h1 className="mb-2 text-2xl font-bold">Vérification du paiement...</h1>
              <p className="text-muted-foreground">
                Nous vérifions votre paiement, veuillez patienter.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État: Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-8">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h1 className="mb-2 text-2xl font-bold">Paiement en cours</h1>
              <p className="mb-6 text-muted-foreground">
                {error}
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Votre paiement est en cours de traitement. Vous recevrez un email de confirmation
                dans quelques instants.
              </p>
              <Link
                href="/my-courses"
                className="block w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Accéder à mes cours
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État: Succès
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">🎉 Paiement réussi !</h1>
            <p className="mb-6 text-muted-foreground">
              Félicitations ! Vous êtes maintenant inscrit à <strong>{courseName}</strong>
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Redirection automatique dans 2 secondes...
            </p>
            {courseId && (
              <Link
                href={`/learn/${courseId}`}
                className="block w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Commencer le cours maintenant
              </Link>
            )}
            <Link
              href="/my-courses"
              className="mt-4 block text-sm text-muted-foreground hover:text-foreground"
            >
              Voir tous mes cours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
