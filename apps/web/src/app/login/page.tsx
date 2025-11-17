import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        <div className="rounded-lg border border-border bg-card p-8">
          <h1 className="mb-2 text-3xl font-bold">Connexion</h1>
          <p className="mb-8 text-muted-foreground">
            Connectez-vous à votre compte Brainow
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
