// ============================================
// 🚧 SANDBOX - FONCTIONNALITÉ V2
// ============================================
// Cette feature sera disponible dans la version 2.0
// Pour le MVP, nous nous concentrons sur les cours et l'apprentissage structuré

import Link from 'next/link';
import { Code2, ArrowLeft } from 'lucide-react';

export default function SandboxPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Code2 className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold">Sandbox en construction</h1>

        <p className="mb-6 text-muted-foreground">
          Notre environnement de développement interactif arrive bientôt !
          En attendant, découvrez nos cours structurés pour apprendre efficacement.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Voir les cours
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

// import { SandboxLayout } from '@/components/sandbox/SandboxLayout';
// export default function SandboxPage() {
//   return <SandboxLayout />;
// }
