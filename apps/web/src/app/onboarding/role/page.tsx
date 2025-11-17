'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, Loader2, CheckCircle } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'learner' | 'creator' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role: 'learner' | 'creator') => {
    setSelectedRole(role);
    setLoading(true);

    try {
      // Enregistrer le rôle dans le profil utilisateur
      const response = await fetch('/api/user/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Rediriger vers le dashboard approprié
        setTimeout(() => {
          if (role === 'creator') {
            router.push('/creator/dashboard');
          } else {
            router.push('/dashboard');
          }
        }, 1000);
      } else {
        // En cas d'erreur, rediriger quand même vers le dashboard
        setTimeout(() => {
          router.push(role === 'creator' ? '/creator/dashboard' : '/dashboard');
        }, 1000);
      }
    } catch (error) {
      // En cas d'erreur, rediriger vers le dashboard par défaut
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Email vérifié avec succès !</h1>
          <p className="text-lg text-muted-foreground">
            Bienvenue sur Brainow. Comment souhaitez-vous utiliser la plateforme ?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Option Apprenant */}
          <button
            onClick={() => handleRoleSelection('learner')}
            disabled={loading}
            className={`group relative overflow-hidden rounded-lg border-2 p-8 text-left transition-all ${
              selectedRole === 'learner'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary hover:bg-accent'
            } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="relative z-10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Je veux apprendre</h3>
              <p className="mb-4 text-muted-foreground">
                Accédez à des cours, développez vos compétences et obtenez des certificats
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Accès aux cours</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Projets pratiques dans le Sandbox</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Portfolio professionnel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificats de compétences</span>
                </li>
              </ul>
              {selectedRole === 'learner' && loading && (
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Configuration en cours...</span>
                </div>
              )}
            </div>
          </button>

          {/* Option Créateur */}
          <button
            onClick={() => handleRoleSelection('creator')}
            disabled={loading}
            className={`group relative overflow-hidden rounded-lg border-2 p-8 text-left transition-all ${
              selectedRole === 'creator'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary hover:bg-accent'
            } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="relative z-10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Je veux enseigner</h3>
              <p className="mb-4 text-muted-foreground">
                Créez des cours, partagez vos connaissances et générez des revenus
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Créer des cours illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Projets Sandbox interactifs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Analytics détaillées</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Revenus via Stripe Connect</span>
                </li>
              </ul>
              {selectedRole === 'creator' && loading && (
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Configuration en cours...</span>
                </div>
              )}
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous pourrez changer de rôle à tout moment dans vos paramètres
        </p>
      </div>
    </div>
  );
}
