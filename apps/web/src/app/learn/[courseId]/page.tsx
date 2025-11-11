import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle, Play } from 'lucide-react';

export default function LearnPage({ params }: { params: { courseId: string } }) {
  const lessons = [
    { id: 1, title: 'Introduction à React', completed: true, duration: '10:23' },
    { id: 2, title: 'Votre premier composant', completed: true, duration: '15:45' },
    { id: 3, title: 'Props et State', completed: false, duration: '12:30', current: true },
    { id: 4, title: 'Hooks: useState', completed: false, duration: '18:20' },
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/my-courses" className="font-semibold hover:text-primary">← Mes cours</Link>
        <h1 className="text-lg font-semibold">Maîtriser React et Next.js</h1>
        <div className="text-sm text-muted-foreground">45% terminé</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 overflow-y-auto border-r border-border bg-card p-4">
          <h2 className="mb-4 font-semibold">Contenu du cours</h2>
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${params.courseId}/lesson/${lesson.id}`} className={`flex items-center gap-3 rounded-lg p-3 hover:bg-accent ${lesson.current ? 'bg-primary/10' : ''}`}>
                {lesson.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Play className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="aspect-video w-full bg-black">
            <div className="flex h-full items-center justify-center text-white">
              <Play className="h-20 w-20" />
            </div>
          </div>

          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Props et State</h2>
            <div className="prose prose-invert max-w-none">
              <p>Dans cette leçon, nous allons explorer les concepts fondamentaux de Props et State dans React...</p>
            </div>

            <div className="mt-8 flex justify-between">
              <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
                <ChevronLeft className="h-5 w-5" />
                Leçon précédente
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Leçon suivante
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
