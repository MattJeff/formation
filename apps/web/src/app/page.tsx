import Link from 'next/link';
import { ArrowRight, Code2, Zap, Users, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Brainow</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/courses" className="text-sm hover:text-primary transition-colors">
              Cours
            </Link>
            <Link href="/sandbox" className="text-sm hover:text-primary transition-colors">
              Sandbox
            </Link>
            <Link href="/community" className="text-sm hover:text-primary transition-colors">
              Communauté
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </Link>
          </nav>
        </div>
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
          La première plateforme qui transforme l'apprentissage théorique en expérience
          professionnelle vérifiable. Travaillez avec un client IA, construisez un portfolio
          réel.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sandbox/demo"
            className="group inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Essayer le Sandbox
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center rounded-lg border border-border bg-background px-8 py-4 text-lg font-semibold hover:bg-accent transition-colors"
          >
            Explorer les cours
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
          Pourquoi Brainow est différent
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Sandbox Interactif"
            description="Un IDE cloud complet avec client IA qui simule de vraies relations professionnelles."
          />
          <FeatureCard
            icon={<Code2 className="h-10 w-10 text-primary" />}
            title="Portfolio-First"
            description="Construisez des projets concrets, pas seulement des certificats vides de sens."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Communauté Active"
            description="Apprenez avec d'autres, collaborez sur des projets, recevez du mentorat."
          />
          <FeatureCard
            icon={<Award className="h-10 w-10 text-primary" />}
            title="Compétences Vérifiables"
            description="Des preuves de compétence basées sur des projets réels, pas sur des QCM."
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
            Rejoignez des milliers de développeurs qui construisent leur avenir avec Brainow.
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
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-primary" />
                <span className="font-bold">Brainow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Forge your professional skills in the fire of action.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground transition-colors">
                    Cours
                  </Link>
                </li>
                <li>
                  <Link href="/sandbox" className="hover:text-foreground transition-colors">
                    Sandbox
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Tarifs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Communauté
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Brainow. Tous droits réservés.</p>
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
