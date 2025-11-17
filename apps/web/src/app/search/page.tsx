import Link from 'next/link';
import { Search, Filter, X } from 'lucide-react';

export default function SearchPage() {
  const results = [
    { id: 1, title: 'Maîtriser React et Next.js', type: 'Cours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200' },
    { id: 2, title: 'Python pour la Data Science', type: 'Cours', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">Brainow</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              defaultValue="React"
              className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-lg"
              placeholder="Rechercher..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
              React
              <X className="h-3 w-3 cursor-pointer" />
            </span>
            <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm hover:bg-accent">
              <Filter className="h-3 w-3" />
              Filtres
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">{results.length} résultats trouvés</p>
          <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option>Plus pertinent</option>
            <option>Plus récent</option>
            <option>Mieux noté</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Link key={result.id} href={`/courses/${result.id}`} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary">
              <img src={result.thumbnail} alt={result.title} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {result.type}
                </span>
                <h3 className="font-semibold group-hover:text-primary">{result.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
