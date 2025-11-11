'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté (token dans l'URL)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
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
          // Pas de session, rester sur la page
          setChecking(false);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

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

              <button className="mt-6 w-full rounded-md border border-border py-2 text-sm hover:bg-accent">
                Renvoyer l'email
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
