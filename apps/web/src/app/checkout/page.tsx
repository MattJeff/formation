import Link from 'next/link';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">Brainow</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link href="/courses/1" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au cours
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="mb-8 text-3xl font-bold">Paiement</h1>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Informations de facturation</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Prénom</label>
                      <input type="text" className="w-full rounded-md border border-input bg-background px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nom</label>
                      <input type="text" className="w-full rounded-md border border-input bg-background px-3 py-2" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input type="email" className="w-full rounded-md border border-input bg-background px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Pays</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <CreditCard className="h-5 w-5" />
                  Paiement sécurisé
                </h2>
                <div className="mb-4 rounded-md bg-primary/10 p-4 text-sm">
                  <Lock className="mb-2 h-5 w-5 text-primary" />
                  <p>Paiement 100% sécurisé via Stripe. Vos données bancaires sont cryptées.</p>
                </div>
                <div id="stripe-card-element" className="rounded-md border border-input bg-background p-4">
                  {/* Stripe Card Element sera monté ici */}
                  <p className="text-sm text-muted-foreground">Élément de paiement Stripe</p>
                </div>
              </div>

              <button className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                Payer 99.99€
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Résumé</h2>
              <div className="mb-4 flex gap-4">
                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100" alt="Course" className="h-16 w-16 rounded object-cover" />
                <div>
                  <h3 className="font-semibold">Maîtriser React et Next.js</h3>
                  <p className="text-sm text-muted-foreground">Par John Doe</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Prix original</span>
                  <span className="line-through">149.99€</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Réduction</span>
                  <span>-50.00€</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>99.99€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
