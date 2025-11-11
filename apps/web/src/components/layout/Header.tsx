'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Settings, TrendingUp } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'learner' | 'creator' | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté et son rôle
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Récupérer le rôle depuis la table profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error('❌ Erreur récupération profil:', error);
          // Fallback: utiliser le rôle des métadonnées si la table n'existe pas
          const roleFromMetadata = currentUser.user_metadata?.role || 'learner';
          setRole(roleFromMetadata as 'learner' | 'creator');
        } else if (profile) {
          setRole(profile.role as 'learner' | 'creator');
        }
      }
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Récupérer le rôle
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('❌ Erreur récupération profil:', error);
          // Fallback
          const roleFromMetadata = session.user.user_metadata?.role || 'learner';
          setRole(roleFromMetadata as 'learner' | 'creator');
        } else if (profile) {
          setRole(profile.role as 'learner' | 'creator');
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push('/');
    router.refresh();
  };

  // Navigation pour LEARNER
  if (role === 'learner') {
    return (
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            SkillForge
          </Link>

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
                  {user?.user_metadata?.first_name || 'Apprenant'}
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
  if (role === 'creator') {
    return (
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            SkillForge
          </Link>

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
                  {user?.user_metadata?.first_name || 'Créateur'}
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
        <Link href="/" className="text-xl font-bold">
          SkillForge
        </Link>

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
