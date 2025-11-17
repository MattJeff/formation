import Link from 'next/link';

export default function CreatorProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">Brainow</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10"></div>
          <div>
            <h1 className="mb-2 text-3xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Senior Full-Stack Developer</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-3xl font-bold">5,420</p>
            <p className="text-muted-foreground">Étudiants</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-3xl font-bold">8</p>
            <p className="text-muted-foreground">Cours</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-3xl font-bold">4.9</p>
            <p className="text-muted-foreground">Note moyenne</p>
          </div>
        </div>
      </div>
    </div>
  );
}
