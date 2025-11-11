import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, Eye, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function AnalyticsPage({ params: _params }: { params: { id: string } }) {
  const stats = [
    { label: 'Vues totales', value: '12,450', change: '+12%', icon: Eye, color: 'text-blue-500' },
    { label: 'Étudiants actifs', value: '1,234', change: '+8%', icon: Users, color: 'text-green-500' },
    { label: 'Taux de complétion', value: '68%', change: '+5%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Temps moyen', value: '4h 32m', change: '+15%', icon: Clock, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/creator/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Analytics du cours</h1>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-green-500">{stat.change}</p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Progression par section</h3>
            <div className="space-y-4">
              {[
                { section: 'Introduction', completion: 95 },
                { section: 'Les fondamentaux', completion: 78 },
                { section: 'Concepts avancés', completion: 45 },
                { section: 'Projet final', completion: 23 },
              ].map((item) => (
                <div key={item.section}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{item.section}</span>
                    <span className="font-medium">{item.completion}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Activité récente</h3>
            <div className="space-y-3">
              {[
                { action: 'Nouvelle inscription', time: 'Il y a 2h', count: 3 },
                { action: 'Leçon complétée', time: 'Il y a 5h', count: 12 },
                { action: 'Nouvel avis', time: 'Il y a 1j', count: 2 },
                { action: 'Question posée', time: 'Il y a 2j', count: 5 },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {activity.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
