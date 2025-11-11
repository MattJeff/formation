import Link from 'next/link';
import { ArrowLeft, Plus, Play, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function TestsPage({ params }: { params: { id: string } }) {
  const tests = [
    { id: 1, name: 'Affichage de la liste', status: 'passed', duration: '1.2s' },
    { id: 2, name: 'Ajout d\'une tâche', status: 'passed', duration: '0.8s' },
    { id: 3, name: 'Suppression d\'une tâche', status: 'failed', duration: '1.5s' },
    { id: 4, name: 'Marquer comme complété', status: 'passed', duration: '0.9s' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href={`/creator/projects/${params.id}/edit`} className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au projet
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tests Playwright</h1>
            <p className="text-muted-foreground">Configurez les tests automatisés pour valider le projet</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
              <Play className="h-5 w-5" />
              Lancer tous les tests
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5" />
              Nouveau test
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{tests.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Réussis</p>
            <p className="text-3xl font-bold text-green-500">
              {tests.filter(t => t.status === 'passed').length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Échoués</p>
            <p className="text-3xl font-bold text-destructive">
              {tests.filter(t => t.status === 'failed').length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Liste des tests</h2>
            {tests.map((test) => (
              <div key={test.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {test.status === 'passed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-semibold">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:underline">Éditer</button>
                    <button className="text-sm text-primary hover:underline">Lancer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Créer un nouveau test</h2>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Nom du test</label>
                <input
                  type="text"
                  placeholder="Ex: Vérifier l'ajout d'une tâche"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez ce que le test doit vérifier..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Code Playwright</label>
                <textarea
                  rows={8}
                  placeholder="test('mon test', async ({ page }) => {&#10;  // Votre code ici&#10;});"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
                Créer le test
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Exemples de tests</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-2 font-semibold">Test de navigation</h3>
              <pre className="overflow-x-auto rounded bg-secondary p-3 text-xs">
{`test('navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Todo/);
});`}
              </pre>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-2 font-semibold">Test d'interaction</h3>
              <pre className="overflow-x-auto rounded bg-secondary p-3 text-xs">
{`test('ajouter tâche', async ({ page }) => {
  await page.fill('input', 'Ma tâche');
  await page.click('button');
  await expect(page.locator('li')).toHaveText('Ma tâche');
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
