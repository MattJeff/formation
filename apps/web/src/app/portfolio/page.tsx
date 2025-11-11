import Link from 'next/link';
import { Plus, ExternalLink, Github } from 'lucide-react';

export default function PortfolioPage() {
  const projects = [
    { id: 1, title: 'E-commerce Platform', description: 'Full-stack app avec Next.js', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400', skills: ['React', 'Next.js', 'Stripe'] },
    { id: 2, title: 'Dashboard Analytics', description: 'Tableau de bord interactif', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', skills: ['React', 'D3.js', 'API'] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">SkillForge</Link>
          <Link href="/portfolio/edit" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
            <Plus className="h-4 w-4" />
            Ajouter un projet
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10"></div>
          <h1 className="mb-2 text-3xl font-bold">John Doe</h1>
          <p className="text-muted-foreground">Full-Stack Developer</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><ExternalLink className="h-5 w-5" /></a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary">
              <img src={project.image} alt={project.title} className="aspect-video w-full object-cover" />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">{project.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
