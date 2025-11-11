import { Header } from '@/components/layout/Header';
import { Users, Search } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Étudiants</h1>
            <p className="text-muted-foreground">Gérez vos étudiants et suivez leur progression</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucun étudiant pour le moment</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Vos étudiants apparaîtront ici une fois qu'ils se seront inscrits à vos cours
          </p>
        </div>
      </div>
    </div>
  );
}
