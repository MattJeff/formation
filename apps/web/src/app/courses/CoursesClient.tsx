'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Search, Filter } from 'lucide-react';

export function CoursesClient() {
  const [_user, setUser] = useState<any>(null);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const courses = [
    {
      id: 1,
      title: 'Maîtriser React et Next.js',
      description: 'Apprenez à construire des applications web modernes',
      level: 'Intermédiaire',
      price: '99.99€',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      students: 1234,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Python pour la Data Science',
      description: 'Analyse de données et Machine Learning',
      level: 'Débutant',
      price: '79.99€',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      students: 2156,
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Design UX/UI Moderne',
      description: 'Créez des interfaces utilisateur exceptionnelles',
      level: 'Intermédiaire',
      price: '89.99€',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      students: 876,
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-secondary py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Explorez nos cours</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Des formations pratiques pour développer vos compétences professionnelles
          </p>

          {/* Search Bar */}
          <div className="flex max-w-2xl gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 hover:bg-accent">
              <Filter className="h-5 w-5" />
              Filtres
            </button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tous les cours</h2>
          <select className="rounded-md border border-input bg-background px-4 py-2">
            <option>Plus populaires</option>
            <option>Plus récents</option>
            <option>Mieux notés</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {course.level}
                  </span>
                  <span className="text-lg font-bold">{course.price}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {course.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{course.students.toLocaleString()} étudiants</span>
                  <span className="flex items-center gap-1">
                    ⭐ {course.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="rounded-lg border border-border bg-background px-8 py-3 font-medium hover:bg-accent">
            Charger plus de cours
          </button>
        </div>
      </section>
    </div>
  );
}
