'use client';

// ============================================
// 💳 CHECKOUT CLIENT COMPONENT
// ============================================
// Composant client pour gérer le processus de paiement
//
// FLOW:
// 1. Vérifie que l'utilisateur est connecté
// 2. Charge les infos du cours
// 3. Appelle l'API pour créer une session Stripe
// 4. Redirige vers Stripe Checkout
//
// DEBUGGING:
// - Chercher les logs: [CHECKOUT]
// - Vérifier la console du navigateur
// - Redirection directe via URL (redirectToCheckout déprécié)
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface CheckoutClientProps {
  courseId: string;
}

export function CheckoutClient({ courseId }: CheckoutClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================
  // 🔄 CHARGEMENT INITIAL
  // ============================================

  useEffect(() => {
    console.log('💳 [CHECKOUT] Initialisation...');

    if (authLoading) {
      console.log('⏳ [CHECKOUT] Attente auth...');
      return;
    }

    if (!user) {
      console.log('❌ [CHECKOUT] Non connecté, redirection login');
      router.push(`/login?redirect=/courses/${courseId}/checkout`);
      return;
    }

    loadCourse();
  }, [user, authLoading, courseId]);

  // ============================================
  // 📚 CHARGEMENT DU COURS
  // ============================================

  const loadCourse = async () => {
    try {
      console.log('📚 [CHECKOUT] Chargement cours:', courseId);

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          subtitle,
          description,
          price,
          compare_price,
          cover_image,
          creator_id,
          profiles:creator_id (first_name, last_name)
        `)
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        console.error('❌ [CHECKOUT] Cours non trouvé:', courseError);
        setError('Cours non trouvé');
        setLoading(false);
        return;
      }

      console.log('✅ [CHECKOUT] Cours chargé:', {
        title: courseData.title,
        price: courseData.price,
      });

      // Vérifier que le cours est payant
      if (courseData.price === 0) {
        console.error('❌ [CHECKOUT] Cours gratuit, redirection /enroll');
        router.push(`/courses/${courseId}/enroll`);
        return;
      }

      // Vérifier que l'utilisateur n'est pas déjà inscrit
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user!.id)
        .eq('course_id', courseId)
        .single();

      if (enrollment) {
        console.log('ℹ️ [CHECKOUT] Déjà inscrit, redirection cours');
        router.push(`/learn/${courseId}`);
        return;
      }

      setCourse(courseData);
      setLoading(false);

      // Démarrer automatiquement le processus de paiement
      console.log('🚀 [CHECKOUT] Démarrage auto du paiement...');
      await handleCheckout();
    } catch (error) {
      console.error('❌ [CHECKOUT] Erreur chargement:', error);
      setError('Erreur lors du chargement du cours');
      setLoading(false);
    }
  };

  // ============================================
  // 💳 PROCESSUS DE PAIEMENT
  // ============================================

  const handleCheckout = async () => {
    if (!user || !courseId) {
      console.error('❌ [CHECKOUT] user ou courseId manquant');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('💳 [CHECKOUT] Création session Stripe...');

      // 1️⃣ Appeler l'API pour créer la session Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [CHECKOUT] Erreur API:', data);
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      console.log('✅ [CHECKOUT] Session créée:', data.sessionId);
      console.log('🔗 [CHECKOUT] URL Stripe:', data.url);

      // 2️⃣ Rediriger vers Stripe Checkout via l'URL
      // Note: redirectToCheckout() est déprécié depuis Stripe API 2025-09-30
      console.log('🔄 [CHECKOUT] Redirection vers Stripe...');

      if (!data.url) {
        throw new Error('URL de checkout Stripe manquante');
      }

      // Redirection directe via window.location
      window.location.href = data.url;
    } catch (error: any) {
      console.error('❌ [CHECKOUT] Erreur:', error);
      setError(error.message || 'Erreur lors du paiement');
      setIsProcessing(false);
    }
  };

  // ============================================
  // 🎨 RENDU
  // ============================================

  // État: Chargement
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

  // État: Erreur
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

  // État: Traitement du paiement
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <h1 className="mb-4 text-2xl font-bold">Redirection vers le paiement...</h1>
            <p className="mb-4 text-muted-foreground">
              Vous allez être redirigé vers notre plateforme de paiement sécurisée.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Paiement 100% sécurisé par Stripe</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État: Affichage du cours (avant redirection auto)
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <button
          onClick={() => router.push(`/courses/${courseId}`)}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au cours
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Résumé de la commande */}
          <div className="lg:col-span-2">
            <h1 className="mb-8 text-3xl font-bold">Finaliser votre achat</h1>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex gap-4">
                {course?.cover_image && (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-semibold">{course?.title}</h3>
                  {course?.subtitle && (
                    <p className="mb-2 text-sm text-muted-foreground">{course.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Par {course?.profiles?.first_name} {course?.profiles?.last_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Paiement 100% sécurisé</p>
                  <p className="text-muted-foreground">
                    Vos données bancaires sont cryptées et sécurisées par Stripe.
                    Garantie satisfait ou remboursé 30 jours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar prix */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Récapitulatif</h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prix du cours</span>
                  <span>{course?.compare_price || course?.price}€</span>
                </div>
                {course?.compare_price && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Réduction</span>
                    <span>-{(course.compare_price - course.price).toFixed(2)}€</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">{course?.price}€</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Procéder au paiement
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                En continuant, vous acceptez nos conditions générales de vente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
