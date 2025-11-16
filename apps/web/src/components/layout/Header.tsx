'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, TrendingUp, CreditCard, Menu, X, HelpCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const loading = authLoading || profileLoading;
  const isCreator = profile?.role === 'creator';
  const isLearner = profile?.role === 'learner';
  
  //console.log('📡 [HEADER] Render - User:', user?.email, 'Role:', profile?.role);

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
    console.log('🚪 [HEADER] Déconnexion...');
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/courses" className="text-sm hover:text-primary">
              Catalogue
            </Link>
            <Link href="/my-courses" className="text-sm hover:text-primary">
              Mes Cours
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Tableau de bord
            </Link>
            <Link href="/faq" className="flex items-center gap-1 text-sm hover:text-primary" title="Aide & Support">
              <HelpCircle className="h-4 w-4" />
              Aide
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/courses"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                href="/my-courses"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes Cours
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tableau de bord
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-4 w-4" />
                Aide & Support
              </Link>
              <hr className="border-border" />
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Mon Profil
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </nav>
          </div>
        )}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
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
            <Link href="/faq" className="flex items-center gap-1 text-sm hover:text-primary" title="Aide & Support">
              <HelpCircle className="h-4 w-4" />
              Aide
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

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
                  {/* TODO: Implement earnings page
                  <Link href="/creator/earnings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <TrendingUp className="h-4 w-4" />
                    Revenus
                  </Link>
                  */}
                  <Link href="/creator/settings/stripe" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                    <CreditCard className="h-4 w-4" />
                    Paiements Stripe
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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/creator/dashboard"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/creator/courses"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes Formations
              </Link>
              <Link
                href="/creator/students"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Étudiants
              </Link>
              <Link
                href="/creator/analytics"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-4 w-4" />
                Aide & Support
              </Link>
              <hr className="border-border" />
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Mon Profil
              </Link>
              {/* TODO: Implement earnings page
              <Link
                href="/creator/earnings"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <TrendingUp className="h-4 w-4" />
                Revenus
              </Link>
              */}
              <Link
                href="/creator/settings/stripe"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCard className="h-4 w-4" />
                Paiements Stripe
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </nav>
          </div>
        )}
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/courses" className="text-sm hover:text-primary">
            Cours
          </Link>
          <Link href="/faq" className="flex items-center gap-1 text-sm hover:text-primary" title="Aide & Support">
            <HelpCircle className="h-4 w-4" />
            Aide
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-accent"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/courses"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cours
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              Aide & Support
            </Link>
            <hr className="border-border" />
            <Link
              href="/login"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-center font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              S'inscrire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
