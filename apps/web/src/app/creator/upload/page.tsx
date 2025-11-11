import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Upload de contenu</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary cursor-pointer">
            <Video className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold">Vidéo</h3>
            <p className="text-sm text-muted-foreground">Upload vers Mux</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary cursor-pointer">
            <FileText className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold">Document</h3>
            <p className="text-sm text-muted-foreground">PDF, DOCX</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary cursor-pointer">
            <Image className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold">Image</h3>
            <p className="text-sm text-muted-foreground">PNG, JPG</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Fichiers récents</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">video-lesson-{i}.mp4</p>
                    <p className="text-sm text-muted-foreground">Uploadé il y a 2h</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline">Utiliser</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
