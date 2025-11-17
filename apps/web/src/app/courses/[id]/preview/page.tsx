import Link from 'next/link';
import { ArrowLeft, Play, Lock } from 'lucide-react';

export default function CoursePreviewPage({ params }: { params: { id: string } }) {
  const previewLessons = [
    { id: 1, title: 'Introduction à React', duration: '10:23', free: true },
    { id: 2, title: 'Votre premier composant', duration: '15:45', free: true },
    { id: 3, title: 'Props et State', duration: '12:30', free: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">Brainow</Link>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link href={`/courses/${params.id}`} className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au cours
        </Link>

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Aperçu gratuit du cours</h1>
          <p className="text-muted-foreground">
            Découvrez les premières leçons gratuitement avant d'acheter le cours complet
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 aspect-video w-full rounded-lg bg-black">
              <div className="flex h-full items-center justify-center text-white">
                <Play className="h-20 w-20" />
              </div>
            </div>

            <h2 className="mb-4 text-2xl font-bold">Introduction à React</h2>
            <p className="text-muted-foreground">
              Dans cette première leçon, nous allons découvrir ce qu'est React et pourquoi c'est devenu
              la bibliothèque JavaScript la plus populaire pour construire des interfaces utilisateur...
            </p>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Leçons disponibles</h3>
              <div className="space-y-2">
                {previewLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${
                      lesson.free ? 'hover:bg-accent' : 'opacity-50'
                    }`}
                    disabled={!lesson.free}
                  >
                    {lesson.free ? (
                      <Play className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-primary/10 p-4">
                <p className="mb-3 text-sm font-medium">Débloquez le cours complet</p>
                <Link
                  href={`/courses/${params.id}`}
                  className="block w-full rounded-lg bg-primary py-2 text-center font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Acheter maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
