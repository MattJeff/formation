import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function CreatorCoursesPage() {
  const courses = [
    { id: 1, title: 'Maîtriser React et Next.js', status: 'Publié', students: 1234 },
    { id: 2, title: 'Python pour la Data Science', status: 'Publié', students: 2156 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        <div className="mb-8 flex justify-between">
          <h1 className="text-3xl font-bold">Mes cours</h1>
          <Link href="/creator/courses/new" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
            <Plus className="h-5 w-5" />
            Créer un cours
          </Link>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.status} • {course.students} étudiants</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
