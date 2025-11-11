import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 rounded-lg border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Paiement réussi !</h1>
          <p className="mb-6 text-muted-foreground">
            Votre achat a été confirmé. Vous pouvez maintenant accéder à votre cours.
          </p>
          <Link href="/my-courses" className="block w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Accéder à mes cours
          </Link>
        </div>
      </div>
    </div>
  );
}
