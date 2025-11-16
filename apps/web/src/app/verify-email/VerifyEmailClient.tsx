'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailClient() {
  const router = useRouter();
  const [error] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté (token dans l'URL)
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Stocker l'email de l'utilisateur pour le renvoi
          setUserEmail(session.user.email || null);

          // Nettoyer le localStorage si l'utilisateur est vérifié
          localStorage.removeItem('pendingVerificationEmail');

          // L'utilisateur est connecté, vérifier s'il a déjà choisi un rôle
          const hasRole = session.user.user_metadata?.role;
          const onboardingCompleted = session.user.user_metadata?.onboarding_completed;

          if (hasRole && onboardingCompleted) {
            // Rediriger vers le dashboard approprié
            if (hasRole === 'creator') {
              router.push('/creator/dashboard');
            } else {
              router.push('/dashboard');
            }
          } else {
            // Rediriger vers la page de choix de rôle
            router.push('/onboarding/role');
          }
        } else {
          // Pas de session, récupérer l'email depuis localStorage si disponible
          const storedEmail = localStorage.getItem('pendingVerificationEmail');
          if (storedEmail) {
            setUserEmail(storedEmail);
          }
          setChecking(false);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      setResendError('Email non trouvé. Veuillez vous réinscrire.');
      return;
    }

    try {
      setResending(true);
      setResendError(null);
      setResendSuccess(false);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        throw error;
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error resending email:', err);
      setResendError(err.message || 'Erreur lors du renvoi de l\'email');
    } finally {
      setResending(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 rounded-lg border border-border bg-card p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Vérification en cours...</h1>
            <p className="text-muted-foreground">
              Nous vérifions votre email, veuillez patienter
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 rounded-lg border border-border bg-card p-8">
          {error ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">Erreur de vérification</h1>
              <p className="mb-6 text-destructive">{error}</p>
              <Link
                href="/signup"
                className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Créer un nouveau compte
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">Vérifiez votre email</h1>
              <p className="mb-6 text-muted-foreground">
                Nous avons envoyé un email de vérification à votre adresse
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Cliquez sur le lien dans l'email pour activer votre compte et choisir votre rôle
              </p>

              <div className="rounded-lg bg-primary/10 p-4 text-sm">
                <CheckCircle className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-medium">Vérifiez votre boîte de réception</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  N'oubliez pas de vérifier vos spams
                </p>
              </div>

              {resendSuccess && (
                <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-600">
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Email renvoyé avec succès !
                </div>
              )}

              {resendError && (
                <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600">
                  <XCircle className="inline h-4 w-4 mr-2" />
                  {resendError}
                </div>
              )}

              <button
                onClick={handleResendEmail}
                disabled={resending || !userEmail}
                className="mt-6 w-full rounded-md border border-border py-2 text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resending && <Loader2 className="h-4 w-4 animate-spin" />}
                {resending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Besoin d'aide ?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contactez le support
          </Link>
        </p>
      </div>
    </div>
  );
}
