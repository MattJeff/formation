'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StripeSuccessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<'success' | 'pending' | 'error'>('pending');

  useEffect(() => {
    if (user?.id) {
      verifyStripeStatus();
    }
  }, [user?.id]);

  const verifyStripeStatus = async () => {
    if (!user?.id) return;

    try {
      setChecking(true);

      // Attendre un peu pour laisser Stripe mettre à jour
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(`/api/stripe/connect/status?userId=${user.id}`);

      if (!response.ok) {
        throw new Error('Erreur vérification statut');
      }

      const data = await response.json();

      if (data.status === 'connected') {
        setStatus('success');
      } else if (data.status === 'pending') {
        setStatus('pending');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('❌ [STRIPE SUCCESS] Erreur:', error);
      setStatus('error');
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Vérification de votre compte Stripe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          {status === 'success' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">Compte Stripe connecté !</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Votre compte est maintenant configuré et prêt à recevoir des paiements.
              </p>

              <div className="rounded-lg border border-border bg-card p-6 mb-8 text-left">
                <h2 className="font-bold mb-4">Prochaines étapes</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Vous recevrez <strong>96%</strong> du prix de chaque cours vendu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Les paiements seront transférés automatiquement sur votre compte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Gérez vos retraits depuis votre dashboard Stripe</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/creator/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Retour au dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/creator/courses/new"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10"
                >
                  Créer un cours
                </Link>
              </div>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">Configuration en cours</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Votre compte Stripe est en cours de vérification. Cela peut prendre quelques minutes.
              </p>

              <div className="rounded-lg border border-border bg-card p-6 mb-8 text-left">
                <h2 className="font-bold mb-2">Que se passe-t-il maintenant ?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Stripe vérifie les informations que vous avez fournies. Vous recevrez un email lorsque votre compte sera activé.
                </p>
                <p className="text-sm text-muted-foreground">
                  En attendant, vous pouvez continuer à créer vos cours. Les paiements seront activés dès que votre compte sera vérifié.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/creator/settings/stripe"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Vérifier le statut
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/creator/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10"
                >
                  Retour au dashboard
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                <CheckCircle className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">Un problème est survenu</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Nous n'avons pas pu vérifier le statut de votre compte Stripe.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => verifyStripeStatus()}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Réessayer
                </button>
                <Link
                  href="/creator/settings/stripe"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10"
                >
                  Paramètres Stripe
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
