'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Settings, Award, BookOpen, Target, Loader2 } from 'lucide-react';

export function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user: currentUser } = await auth.getUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userRole = user?.user_metadata?.role;
  const firstName = user?.user_metadata?.first_name || 'Utilisateur';
  const lastName = user?.user_metadata?.last_name || '';
  const fullName = user?.user_metadata?.full_name || `${firstName} ${lastName}`;
  const email = user?.email || '';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-3xl font-bold">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">{email}</p>
              <p className="mt-2 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {userRole === 'creator' ? '👨‍🏫 Créateur' : '🎓 Apprenant'}
                </span>
                <span className="ml-2 text-muted-foreground">
                  Membre depuis {createdAt}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Modifier le profil
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <BookOpen className="mb-4 h-12 w-12 text-blue-500" />
            <h3 className="mb-2 text-2xl font-bold">0</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Cours créés' : 'Cours suivis'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Award className="mb-4 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-2xl font-bold">0</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Étudiants' : 'Certificats obtenus'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Target className="mb-4 h-12 w-12 text-green-500" />
            <h3 className="mb-2 text-2xl font-bold">0h</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Contenu créé' : "Temps d'apprentissage"}
            </p>
          </div>
        </div>

        {userRole === 'learner' && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Badges & Réalisations</h2>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                Commencez à suivre des cours pour débloquer des badges !
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Explorer les cours
              </Link>
            </div>
          </div>
        )}

        {userRole === 'creator' && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Vos cours</h2>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé de cours
              </p>
              <Link
                href="/creator/courses/new"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Créer votre premier cours
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
