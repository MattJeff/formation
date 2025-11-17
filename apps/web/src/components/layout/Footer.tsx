import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold text-primary">
              Brainow
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Plateforme de formation en ligne pour développer vos compétences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Catalogue de cours
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mon espace
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Devenir formateur
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="mb-3 font-semibold">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/mentions"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/stripe-compliance"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Conformité Stripe
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@brainow.com"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Brainow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
