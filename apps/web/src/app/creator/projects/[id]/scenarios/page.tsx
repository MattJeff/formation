import Link from 'next/link';
import { ArrowLeft, Sparkles, Wand2, Play } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function ScenariosPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href={`/creator/projects/${params.id}/edit`} className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au projet
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Scenario Builder IA</h1>
          </div>
          <p className="text-muted-foreground">
            Générez automatiquement des scénarios de test et des cas d'usage avec l'intelligence artificielle
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-primary bg-primary/5 p-6">
              <h2 className="mb-4 text-xl font-semibold">Génération automatique</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                L'IA analysera votre projet et générera des scénarios de test pertinents
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Type de scénarios</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Tests fonctionnels</option>
                    <option>Tests d'intégration</option>
                    <option>Tests de performance</option>
                    <option>Tests de sécurité</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Niveau de complexité</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Nombre de scénarios</label>
                  <input
                    type="number"
                    defaultValue={5}
                    min={1}
                    max={20}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                  <Wand2 className="h-5 w-5" />
                  Générer les scénarios
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Scénario personnalisé</h2>
              <form className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Description du scénario</label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez le comportement que vous voulez tester..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Critères de réussite</label>
                  <textarea
                    rows={3}
                    placeholder="Qu'est-ce qui indique que le test a réussi ?"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
                  <Sparkles className="h-5 w-5" />
                  Générer avec l'IA
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Scénarios générés</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: 'Ajouter une tâche',
                    description: 'L\'utilisateur peut ajouter une nouvelle tâche à la liste',
                    steps: ['Cliquer sur le champ de saisie', 'Entrer le texte', 'Cliquer sur Ajouter', 'Vérifier que la tâche apparaît'],
                  },
                  {
                    id: 2,
                    title: 'Marquer comme complété',
                    description: 'L\'utilisateur peut marquer une tâche comme complétée',
                    steps: ['Cliquer sur la checkbox', 'Vérifier le style barré', 'Vérifier l\'état dans le store'],
                  },
                ].map((scenario) => (
                  <div key={scenario.id} className="rounded-lg border border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold">{scenario.title}</h3>
                      <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Play className="h-4 w-4" />
                        Tester
                      </button>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Étapes:</p>
                      {scenario.steps.map((step, i) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          {i + 1}. {step}
                        </p>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="text-sm text-primary hover:underline">Éditer</button>
                      <button className="text-sm text-primary hover:underline">Convertir en test</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Suggestions IA</h2>
              <div className="space-y-3">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="mb-2 text-sm font-medium">💡 Test de validation</p>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez un test pour vérifier que les champs vides ne peuvent pas être soumis
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="mb-2 text-sm font-medium">💡 Test d'accessibilité</p>
                  <p className="text-xs text-muted-foreground">
                    Vérifiez que tous les éléments interactifs sont accessibles au clavier
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="mb-2 text-sm font-medium">💡 Test de performance</p>
                  <p className="text-xs text-muted-foreground">
                    Testez le comportement avec 100+ tâches dans la liste
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
