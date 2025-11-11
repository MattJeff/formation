import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 rounded-lg border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Paiement annulé</h1>
          <p className="mb-6 text-muted-foreground">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>
          <div className="flex gap-4">
            <Link href="/courses" className="flex-1 rounded-lg border border-border py-3 font-medium hover:bg-accent">
              Retour aux cours
            </Link>
            <Link href="/checkout" className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
              Réessayer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
