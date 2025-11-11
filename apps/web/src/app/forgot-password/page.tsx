import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la connexion
        </Link>

        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Mot de passe oublié ?</h1>
            <p className="text-sm text-muted-foreground">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="vous@exemple.com"
              />
            </div>

            <button type="submit" className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90">
              Envoyer le lien de réinitialisation
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
