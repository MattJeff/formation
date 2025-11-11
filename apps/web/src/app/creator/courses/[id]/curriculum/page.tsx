import Link from 'next/link';
import { ArrowLeft, Plus, GripVertical, Video, FileText, Code } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function CurriculumPage({ params }: { params: { id: string } }) {
  const sections = [
    {
      id: 1,
      title: 'Introduction',
      lessons: [
        { id: 1, title: 'Bienvenue dans le cours', type: 'video', duration: '5:30' },
        { id: 2, title: 'Prérequis et installation', type: 'video', duration: '10:15' },
      ],
    },
    {
      id: 2,
      title: 'Les fondamentaux',
      lessons: [
        { id: 3, title: 'Composants React', type: 'video', duration: '15:45' },
        { id: 4, title: 'Props et State', type: 'video', duration: '12:30' },
        { id: 5, title: 'Exercice pratique', type: 'code', duration: '30:00' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Structure du cours</h1>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-5 w-5" />
            Ajouter une section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <button className="text-sm text-primary hover:underline">
                  Éditer
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        {lesson.type === 'video' && <Video className="h-4 w-4 text-blue-500" />}
                        {lesson.type === 'code' && <Code className="h-4 w-4 text-green-500" />}
                        {lesson.type === 'text' && <FileText className="h-4 w-4 text-yellow-500" />}
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        <button className="text-sm text-primary hover:underline">
                          Éditer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline">
                  <Plus className="h-4 w-4" />
                  Ajouter une leçon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
