'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Header } from '@/components/layout/Header';
import { BookOpen, Trophy, Target, TrendingUp, Loader2 } from 'lucide-react';

export function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  const loading = authLoading || profileLoading;
  const isCreator = profile?.role === 'creator';
  
  console.log('📊 [DASHBOARD] Render - User:', user?.email, 'Role:', profile?.role);

  // Afficher le loader pendant le chargement
  if (loading) {
    console.log('⏳ [DASHBOARD] Chargement...');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  // Si pas connecté, afficher message
  if (!user) {
    console.log('❌ [DASHBOARD] Non connecté');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Vous devez être connecté</p>
          <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Si creator, afficher message
  if (isCreator) {
    console.log('🚫 [DASHBOARD] Creator détecté, redirection...');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Redirection vers le dashboard créateur...</p>
          <Link href="/creator/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Aller au dashboard créateur
          </Link>
        </div>
      </div>
    );
  }
  
  console.log('✅ [DASHBOARD] Affichage du dashboard learner');

  const stats = [
    { label: 'Cours en cours', value: '0', icon: BookOpen, color: 'text-blue-500' },
    { label: 'Cours terminés', value: '0', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Heures apprises', value: '0', icon: Target, color: 'text-green-500' },
    { label: 'Progression', value: '0%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Bienvenue, {profile?.first_name || 'Apprenant'} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Continuez votre parcours d'apprentissage
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Section: Commencer l'apprentissage */}
        <div className="mb-8 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Commencez votre apprentissage</h2>
          <p className="mb-6 text-muted-foreground">
            Vous n'avez pas encore de cours. Explorez notre catalogue et commencez à apprendre !
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/courses"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Explorer les cours
            </Link>
            <Link
              href="/categories"
              className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-accent"
            >
              Parcourir par catégorie
            </Link>
          </div>
        </div>

        {/* Section: Cours recommandés */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Cours recommandés pour vous</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: 'Maîtriser React et Next.js',
                instructor: 'John Doe',
                price: '99.99€',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                rating: 4.8,
                students: 1234,
              },
              {
                id: 2,
                title: 'Python pour la Data Science',
                instructor: 'Jane Smith',
                price: '79.99€',
                thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
                rating: 4.9,
                students: 2156,
              },
              {
                id: 3,
                title: 'Design UX/UI Moderne',
                instructor: 'Mike Johnson',
                price: '89.99€',
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                rating: 4.7,
                students: 987,
              },
            ].map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-2 font-semibold group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="mb-2 text-sm text-muted-foreground">{course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students})</span>
                    </div>
                    <span className="font-bold text-primary">{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
