import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function EditCoursePage({ params: _params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Éditer le cours</h1>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            <Save className="h-5 w-5" />
            Sauvegarder
          </button>
        </div>

        <form className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations de base</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Titre du cours</label>
                <input 
                  type="text" 
                  defaultValue="Maîtriser React et Next.js"
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Sous-titre</label>
                <input 
                  type="text" 
                  defaultValue="Apprenez à construire des applications web modernes"
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea 
                  rows={6} 
                  defaultValue="Ce cours vous apprendra..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Catégorie</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Développement Web</option>
                    <option>Data Science</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Niveau</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Débutant</option>
                    <option selected>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Tarification</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Prix (€)</label>
                <input 
                  type="number" 
                  defaultValue="99.99"
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Prix barré (€)</label>
                <input 
                  type="number" 
                  defaultValue="149.99"
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/creator/courses" className="rounded-lg border border-border px-6 py-2 hover:bg-accent">
              Annuler
            </Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
              Sauvegarder les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
