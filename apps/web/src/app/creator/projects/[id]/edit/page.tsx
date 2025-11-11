import Link from 'next/link';
import { ArrowLeft, Save, Play, Code } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Éditer le projet Sandbox</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
              <Play className="h-5 w-5" />
              Tester
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90">
              <Save className="h-5 w-5" />
              Sauvegarder
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Informations</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nom du projet</label>
                  <input
                    type="text"
                    defaultValue="Todo App avec React"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    defaultValue="Créez une application de gestion de tâches..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Fichiers du projet</h2>
              <div className="space-y-2">
                {[
                  { name: 'src/App.jsx', icon: Code },
                  { name: 'src/components/TodoList.jsx', icon: Code },
                  { name: 'src/styles.css', icon: Code },
                  { name: 'package.json', icon: Code },
                ].map((file) => (
                  <button
                    key={file.name}
                    className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-accent"
                  >
                    <file.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{file.name}</span>
                  </button>
                ))}
                <button className="w-full rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                  + Ajouter un fichier
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Éditeur de code</h2>
              <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                <option>src/App.jsx</option>
                <option>src/components/TodoList.jsx</option>
              </select>
            </div>
            <div className="rounded-lg bg-secondary p-4 font-mono text-sm">
              <pre className="text-muted-foreground">
{`import React, { useState } from 'react';
import './styles.css';

function App() {
  const [todos, setTodos] = useState([]);
  
  return (
    <div className="app">
      <h1>Ma Todo App</h1>
      {/* Votre code ici */}
    </div>
  );
}

export default App;`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/creator/projects/${params.id}/tests`}
            className="rounded-lg border border-border bg-card p-6 hover:border-primary"
          >
            <h3 className="mb-2 text-lg font-semibold">Configurer les tests</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez des tests Playwright pour valider le projet
            </p>
          </Link>

          <Link
            href={`/creator/projects/${params.id}/scenarios`}
            className="rounded-lg border border-border bg-card p-6 hover:border-primary"
          >
            <h3 className="mb-2 text-lg font-semibold">Scenario Builder (IA)</h3>
            <p className="text-sm text-muted-foreground">
              Générez des scénarios de test avec l'IA
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
