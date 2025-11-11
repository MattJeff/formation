import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      features: ['Accès aux cours gratuits', 'Communauté', 'Portfolio public'],
      cta: 'Commencer',
      popular: false,
    },
    {
      name: 'Premium',
      price: '29€',
      period: '/mois',
      features: ['Tous les cours', 'Sandbox illimité', 'Certificats Pro', 'Coach IA', 'Support prioritaire'],
      cta: 'Essayer gratuitement',
      popular: true,
    },
    {
      name: 'Créateur Pro',
      price: '19€',
      period: '/mois',
      features: ['Cours illimités', 'Commission 5%', 'Analytics avancées', 'Marketing tools', 'Support dédié'],
      cta: 'Devenir créateur',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">SkillForge</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Choisissez votre plan</h1>
          <p className="text-lg text-muted-foreground">Commencez gratuitement, évoluez quand vous voulez</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-lg border p-8 ${plan.popular ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              {plan.popular && (
                <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Plus populaire
                </span>
              )}
              <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded-lg py-3 font-semibold ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border hover:bg-accent'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
