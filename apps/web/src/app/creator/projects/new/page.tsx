import Link from 'next/link';
import { ArrowLeft, Code, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Créer un projet Sandbox</h1>

        <form className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations du projet</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Nom du projet</label>
                <input
                  type="text"
                  placeholder="Ex: Créer une Todo App avec React"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  placeholder="Décrivez ce que les étudiants vont construire..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Langage principal</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>JavaScript</option>
                    <option>TypeScript</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>Go</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Framework</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>React</option>
                    <option>Vue.js</option>
                    <option>Angular</option>
                    <option>Next.js</option>
                    <option>Svelte</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Cours associé</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Sélectionner un cours</option>
                  <option>Maîtriser React et Next.js</option>
                  <option>Python pour la Data Science</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Configuration de l'environnement</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Template de départ</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Vide</option>
                  <option>React + Vite</option>
                  <option>Next.js App Router</option>
                  <option>Express.js API</option>
                  <option>Python Flask</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Dépendances npm</label>
                <textarea
                  rows={3}
                  placeholder="react, react-dom, axios..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Variables d'environnement</label>
                <textarea
                  rows={3}
                  placeholder="API_KEY=xxx&#10;DATABASE_URL=xxx"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Génération IA (Bêta)</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Utilisez l'IA pour générer automatiquement les tests et scénarios pour votre projet
            </p>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-5 w-5" />
              Générer avec l'IA
            </button>
          </div>

          <div className="flex gap-4">
            <Link href="/creator/dashboard" className="rounded-lg border border-border px-6 py-2 hover:bg-accent">
              Annuler
            </Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
