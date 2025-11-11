import Link from 'next/link';
import { ArrowLeft, Upload, FileText, File } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function UploadResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/upload" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'upload
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Upload ressources</h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Sélectionner des fichiers</h2>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-12 transition-colors hover:border-primary">
              <div className="text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">Cliquez pour uploader ou glissez-déposez</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, ZIP, code source jusqu'à 100MB</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Nom de la ressource</label>
                <input
                  type="text"
                  placeholder="Ex: Guide PDF du cours"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description de la ressource..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Type de ressource</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>PDF</option>
                    <option>Code source</option>
                    <option>Document</option>
                    <option>Archive</option>
                  </select>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Accès</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="access" defaultChecked className="h-4 w-4" />
                <div>
                  <p className="font-medium">Gratuit</p>
                  <p className="text-sm text-muted-foreground">Accessible à tous</p>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="access" className="h-4 w-4" />
                <div>
                  <p className="font-medium">Réservé aux étudiants inscrits</p>
                  <p className="text-sm text-muted-foreground">Uniquement pour ceux qui ont acheté le cours</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/creator/upload" className="rounded-lg border border-border px-6 py-2 hover:bg-accent">
              Annuler
            </Link>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
              <Upload className="h-5 w-5" />
              Uploader la ressource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
