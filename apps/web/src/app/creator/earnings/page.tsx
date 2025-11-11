import Link from 'next/link';
import { DollarSign, TrendingUp, Download, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function EarningsPage() {
  const earnings = [
    { month: 'Novembre 2024', amount: '2,450€', students: 156, status: 'En attente' },
    { month: 'Octobre 2024', amount: '2,180€', students: 142, status: 'Payé' },
    { month: 'Septembre 2024', amount: '1,920€', students: 128, status: 'Payé' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Revenus</h1>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <DollarSign className="mb-4 h-12 w-12 text-green-500" />
            <p className="text-sm text-muted-foreground">Revenus totaux</p>
            <p className="text-3xl font-bold">12,450€</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <TrendingUp className="mb-4 h-12 w-12 text-blue-500" />
            <p className="text-sm text-muted-foreground">Ce mois</p>
            <p className="text-3xl font-bold">2,450€</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Download className="mb-4 h-12 w-12 text-purple-500" />
            <p className="text-sm text-muted-foreground">Prochain paiement</p>
            <p className="text-3xl font-bold">2,450€</p>
            <p className="text-sm text-muted-foreground">30 nov. 2024</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Historique des paiements</h2>
          <div className="space-y-4">
            {earnings.map((earning, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                <div>
                  <p className="font-semibold">{earning.month}</p>
                  <p className="text-sm text-muted-foreground">{earning.students} nouveaux étudiants</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{earning.amount}</p>
                  <p className={`text-sm ${earning.status === 'Payé' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {earning.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
