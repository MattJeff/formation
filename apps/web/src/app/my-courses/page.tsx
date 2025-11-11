import Link from 'next/link';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function MyCoursesPage() {
  const courses = [
    { id: 1, title: 'Maîtriser React et Next.js', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', instructor: 'John Doe', lastAccessed: '2024-11-10' },
    { id: 2, title: 'Python pour la Data Science', progress: 78, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', instructor: 'Jane Smith', lastAccessed: '2024-11-09' },
    { id: 3, title: 'Design UX/UI Moderne', progress: 23, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', instructor: 'Mike Johnson', lastAccessed: '2024-11-08' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Mes cours</h1>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Rechercher dans mes cours..." className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4" />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
            <Filter className="h-5 w-5" />
            Filtres
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/learn/${course.id}`} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary">
              <img src={course.thumbnail} alt={course.title} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <h3 className="mb-2 font-semibold group-hover:text-primary">{course.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">Par {course.instructor}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">Dernier accès: {course.lastAccessed}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
