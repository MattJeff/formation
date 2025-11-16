'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Zap, Users, Award, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SkillForge</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/courses" className="text-sm hover:text-primary transition-colors">
              Cours
            </Link>
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Se connecter
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
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/courses"
                className="block px-4 py-3 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cours
              </Link>
              <Link
                href="/login"
                className="block px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Se connecter
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Forgez vos compétences
          <br />
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            dans le feu de l'action
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          La plateforme d'apprentissage qui vous permet de construire des compétences réelles
          à travers des projets concrets et un suivi personnalisé.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/courses"
            className="group inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Explorer les cours
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg border border-border bg-background px-8 py-4 text-lg font-semibold hover:bg-accent transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
          Pourquoi SkillForge est différent
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Code2 className="h-10 w-10 text-primary" />}
            title="Formations Pratiques"
            description="Des cours structurés avec vidéos, exercices et projets concrets pour apprendre en faisant."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Progression Suivie"
            description="Suivez votre avancement en temps réel avec des statistiques détaillées et des objectifs clairs."
          />
          <FeatureCard
            icon={<Award className="h-10 w-10 text-primary" />}
            title="Certificats Vérifiables"
            description="Obtenez des certificats officiels téléchargeables pour valoriser vos compétences."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Créateurs Experts"
            description="Apprenez auprès de créateurs passionnés et bénéficiez de leurs retours personnalisés."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Prêt à transformer votre apprentissage ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Rejoignez des milliers de développeurs qui construisent leur avenir avec SkillForge.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-primary" />
                <span className="font-bold">SkillForge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme de formation en ligne nouvelle génération.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground transition-colors">
                    Catalogue de cours
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-foreground transition-colors">
                    Créer un compte
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Se connecter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/legal/mentions" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SkillForge. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
