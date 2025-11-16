'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

interface StripeStatus {
  status: 'not_connected' | 'pending' | 'connected';
  hasStripeAccount: boolean;
  canReceivePayments: boolean;
  onboardingCompleted?: boolean;
  accountDetails?: {
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    email?: string;
  };
}

export default function StripeSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);

  useEffect(() => {
    if (user?.id) {
      checkStripeStatus();
    }
  }, [user?.id]);

  const checkStripeStatus = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/stripe/connect/status?userId=${user.id}`);

      if (!response.ok) {
        throw new Error('Erreur vérification statut');
      }

      const data = await response.json();
      setStripeStatus(data);
    } catch (error) {
      console.error('Erreur vérification statut Stripe:', error);
    } finally {
      setLoading(false);
    }
  };

  const startOnboarding = async () => {
    if (!user?.id) return;

    try {
      setConnecting(true);
      const response = await fetch('/api/stripe/connect/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur connexion Stripe');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Erreur démarrage onboarding Stripe:', error);
      alert(error.message);
      setConnecting(false);
    }
  };

  const getStatusBadge = () => {
    if (!stripeStatus) return null;

    switch (stripeStatus.status) {
      case 'connected':
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600">
            <CheckCircle className="h-4 w-4" />
            Connecté
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600">
            <AlertCircle className="h-4 w-4" />
            En attente
          </div>
        );
      case 'not_connected':
      default:
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-500/10 px-4 py-2 text-sm font-semibold text-gray-600">
            <XCircle className="h-4 w-4" />
            Non connecté
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/creator/dashboard"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paiements Stripe</h1>
          <p className="text-muted-foreground">
            Configurez votre compte Stripe pour recevoir vos revenus
          </p>
        </div>

        {/* Statut actuel */}
        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Statut de connexion</h2>
            {getStatusBadge()}
          </div>

          {stripeStatus?.status === 'not_connected' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vous devez connecter votre compte Stripe pour recevoir les paiements de vos cours.
              </p>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <h3 className="font-semibold text-blue-600 mb-2">Comment ça marche ?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Nous prenons une commission de <strong>4%</strong> sur chaque vente</li>
                  <li>• Vous recevez <strong>96%</strong> du prix de vos cours</li>
                  <li>• Les paiements sont transférés automatiquement sur votre compte</li>
                  <li>• Vous gérez vos retraits depuis votre dashboard Stripe</li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                disabled={connecting}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    Connecter mon compte Stripe
                  </>
                )}
              </button>
            </div>
          )}

          {stripeStatus?.status === 'pending' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Votre compte Stripe est en cours de configuration ou en attente de vérification.
              </p>

              {stripeStatus.accountDetails && (
                <div className="rounded-lg bg-secondary p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paiements activés:</span>
                    <span className={stripeStatus.accountDetails.chargesEnabled ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                      {stripeStatus.accountDetails.chargesEnabled ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Retraits activés:</span>
                    <span className={stripeStatus.accountDetails.payoutsEnabled ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                      {stripeStatus.accountDetails.payoutsEnabled ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Informations soumises:</span>
                    <span className={stripeStatus.accountDetails.detailsSubmitted ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                      {stripeStatus.accountDetails.detailsSubmitted ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              )}

              {!stripeStatus.accountDetails?.detailsSubmitted && (
                <button
                  onClick={startOnboarding}
                  disabled={connecting}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5" />
                      Terminer la configuration
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {stripeStatus?.status === 'connected' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p className="text-green-600 font-semibold mb-2">
                  Votre compte Stripe est connecté et opérationnel !
                </p>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez maintenant recevoir des paiements pour vos cours. Les fonds seront transférés automatiquement sur votre compte Stripe.
                </p>
              </div>

              {stripeStatus.accountDetails && (
                <div className="rounded-lg bg-secondary p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email Stripe:</span>
                    <span className="font-medium">{stripeStatus.accountDetails.email || 'Non disponible'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paiements:</span>
                    <span className="text-green-600 font-semibold">Activés ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Retraits:</span>
                    <span className="text-green-600 font-semibold">Activés ✓</span>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <h3 className="font-semibold text-blue-600 mb-2">Répartition des revenus</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Commission plateforme: <strong>4%</strong></li>
                  <li>• Vous recevez: <strong>96%</strong> du prix de vos cours</li>
                  <li>• Les transferts sont automatiques après chaque vente</li>
                </ul>
              </div>

              <button
                onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                className="w-full rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                Accéder à mon dashboard Stripe
              </button>
            </div>
          )}
        </div>

        {/* Aide */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Besoin d'aide ?</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Comment retirer mes fonds ?</strong><br />
              Connectez-vous à votre dashboard Stripe pour gérer vos retraits vers votre compte bancaire.
            </p>
            <p>
              <strong>Quand vais-je recevoir mes paiements ?</strong><br />
              Les fonds sont transférés automatiquement sur votre compte Stripe après chaque vente.
              Le délai de retrait vers votre banque dépend de votre configuration Stripe.
            </p>
            <p>
              <strong>Problème de connexion ?</strong><br />
              Cliquez sur "Connecter mon compte Stripe" ou "Terminer la configuration" pour reprendre le processus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
