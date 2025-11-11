import { Header } from '@/components/layout/Header';
import { TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Analytics</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-3">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus</p>
                <p className="text-2xl font-bold">0€</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cours Actifs</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux Complétion</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Analytics en cours de développement</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Les statistiques détaillées seront bientôt disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
