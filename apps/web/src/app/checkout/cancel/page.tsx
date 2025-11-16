// ============================================
// ❌ CHECKOUT CANCEL PAGE
// ============================================
// Route: /checkout/cancel
// Affichée quand l'utilisateur annule le paiement sur Stripe
//
// DEBUGGING:
// - Chercher les logs: [CHECKOUT CANCEL]
// - Aucun enrollment n'est créé
// - Aucun montant débité
// ============================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function CheckoutCancelPage() {
  useEffect(() => {
    console.log('❌ [CHECKOUT CANCEL] Paiement annulé par l\'utilisateur');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Paiement annulé</h1>
            <p className="mb-6 text-muted-foreground">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Vous pouvez réessayer à tout moment. Le cours restera disponible.
            </p>
            <div className="flex gap-4">
              <Link
                href="/courses"
                className="flex-1 rounded-lg border border-border py-3 font-medium hover:bg-accent"
              >
                Retour aux cours
              </Link>
              <Link
                href="/my-courses"
                className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Mes cours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
