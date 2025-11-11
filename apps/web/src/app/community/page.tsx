import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">SkillForge</Link>
          <nav className="flex items-center space-x-6">
            <Link href="/courses">Cours</Link>
            <Link href="/sandbox">Sandbox</Link>
            <Link href="/login" className="rounded-md bg-primary px-4 py-2">Se connecter</Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold">Communauté SkillForge</h1>
        <p className="text-lg text-muted-foreground">
          Rejoignez des milliers de développeurs qui apprennent ensemble
        </p>
      </section>
    </div>
  );
}
