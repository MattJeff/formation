'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { LogOut, User, Settings, BookOpen, LayoutDashboard } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const getUser = async () => {
      const { user: currentUser } = await auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
    router.refresh();
  };

  const userRole = user?.user_metadata?.role;
  const dashboardUrl = userRole === 'creator' ? '/creator/dashboard' : '/dashboard';

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          SkillForge
        </Link>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/courses" className="text-sm hover:text-primary">
                Cours
              </Link>
              <Link href={dashboardUrl} className="text-sm hover:text-primary">
                Dashboard
              </Link>
              {userRole === 'learner' && (
                <Link href="/my-courses" className="text-sm hover:text-primary">
                  Mes cours
                </Link>
              )}
              
              {/* Dropdown Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.user_metadata?.first_name || 'Utilisateur'}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg">
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </Link>
                    {userRole === 'creator' && (
                      <Link
                        href="/creator/courses"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                      >
                        <BookOpen className="h-4 w-4" />
                        Mes cours
                      </Link>
                    )}
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
