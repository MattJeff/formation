'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export function Header() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  const loading = authLoading || profileLoading;
  const isCreator = profile?.role === 'creator';
  const isLearner = profile?.role === 'learner';

  // Afficher un skeleton pendant le chargement
  if (loading) {
    return (
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
          <div className="flex gap-4">
            <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
            <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
            <div className="h-10 w-32 animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Navigation pour LEARNER
  if (isLearner) {
    return (
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold cursor-pointer" onClick={() => router.push('/dashboard')}>
            SkillForge
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/courses" className="text-sm hover:text-primary">
              Catalogue
            </Link>
            <Link href="/my-courses" className="text-sm hover:text-primary">
              Mes Cours
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Tableau de bord
            </Link>
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  {profile?.first_name || 'Apprenant'}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-50">
                <div className="p-2">
                  <Link href="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <User className="h-4 w-4" />
                    Mon Profil
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>
                  <hr className="my-2 border-border" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // Navigation pour CREATOR
  if (isCreator) {
    return (
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold cursor-pointer" onClick={() => router.push('/creator/dashboard')}>
            SkillForge
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/creator/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </Link>
            <Link href="/creator/courses" className="text-sm hover:text-primary">
              Mes Formations
            </Link>
            <Link href="/creator/students" className="text-sm hover:text-primary">
              Étudiants
            </Link>
            <Link href="/creator/analytics" className="text-sm hover:text-primary">
              Analytics
            </Link>
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  {profile?.first_name || 'Créateur'}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-50">
                <div className="p-2">
                  <Link href="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <User className="h-4 w-4" />
                    Mon Profil
                  </Link>
                  <Link href="/creator/earnings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <TrendingUp className="h-4 w-4" />
                    Revenus
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>
                  <hr className="my-2 border-border" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // Navigation publique (non connecté)
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>
          SkillForge
        </div>

        <nav className="flex items-center space-x-6">
          <Link href="/courses" className="text-sm hover:text-primary">
            Cours
          </Link>
          <Link href="/login" className="text-sm hover:text-primary">
            Connexion
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            S'inscrire
          </Link>
        </nav>
      </div>
    </header>
  );
}
