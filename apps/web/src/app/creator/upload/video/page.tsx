import Link from 'next/link';
import { ArrowLeft, Upload, Video, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function UploadVideoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/upload" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'upload
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Upload vidéo vers Mux</h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Sélectionner une vidéo</h2>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-12 transition-colors hover:border-primary">
              <div className="text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">Cliquez pour uploader ou glissez-déposez</p>
                <p className="text-xs text-muted-foreground">MP4, MOV, AVI jusqu'à 5GB</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations de la vidéo</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Titre de la vidéo</label>
                <input
                  type="text"
                  placeholder="Ex: Introduction au cours"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  placeholder="Description de la vidéo..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Cours associé</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Sélectionner un cours</option>
                    <option>Maîtriser React et Next.js</option>
                    <option>Python pour la Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Section</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Sélectionner une section</option>
                    <option>Introduction</option>
                    <option>Les fondamentaux</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Options de traitement</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                <div>
                  <p className="font-medium">Générer les sous-titres automatiquement</p>
                  <p className="text-sm text-muted-foreground">Utilise l'IA pour créer des sous-titres</p>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                <div>
                  <p className="font-medium">Optimiser pour le streaming</p>
                  <p className="text-sm text-muted-foreground">Qualité adaptative selon la connexion</p>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                <div>
                  <p className="font-medium">Ajouter un filigrane</p>
                  <p className="text-sm text-muted-foreground">Protection contre le piratage</p>
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
              Commencer l'upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
