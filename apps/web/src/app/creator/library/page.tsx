import Link from 'next/link';
import { ArrowLeft, Video, FileText, Image as ImageIcon, Search, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function LibraryPage() {
  const media = [
    { id: 1, name: 'intro-video.mp4', type: 'video', size: '125 MB', date: '2024-11-10', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200' },
    { id: 2, name: 'guide-cours.pdf', type: 'document', size: '2.5 MB', date: '2024-11-09' },
    { id: 3, name: 'cover-image.jpg', type: 'image', size: '850 KB', date: '2024-11-08', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200' },
    { id: 4, name: 'lesson-2.mp4', type: 'video', size: '98 MB', date: '2024-11-07', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/creator/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bibliothèque de médias</h1>
            <p className="text-muted-foreground">{media.length} fichiers • 226.35 MB utilisés</p>
          </div>
          <Link href="/creator/upload" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Uploader un fichier
          </Link>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher dans la bibliothèque..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
            <Filter className="h-5 w-5" />
            Filtres
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Tous
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            Vidéos
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            Documents
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            Images
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all">
              {item.type === 'video' || item.type === 'image' ? (
                <div className="aspect-video overflow-hidden bg-secondary">
                  <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-secondary">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {item.type === 'video' && <Video className="h-4 w-4 text-blue-500" />}
                  {item.type === 'document' && <FileText className="h-4 w-4 text-yellow-500" />}
                  {item.type === 'image' && <ImageIcon className="h-4 w-4 text-green-500" />}
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
