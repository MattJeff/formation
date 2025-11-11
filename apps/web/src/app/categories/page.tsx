import Link from 'next/link';
import { Code, Database, Palette, Smartphone, Brain, TrendingUp } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    { name: 'Développement Web', icon: Code, count: 245, color: 'text-blue-500' },
    { name: 'Data Science', icon: Database, count: 128, color: 'text-green-500' },
    { name: 'Design', icon: Palette, count: 89, color: 'text-purple-500' },
    { name: 'Mobile', icon: Smartphone, count: 67, color: 'text-yellow-500' },
    { name: 'IA & Machine Learning', icon: Brain, count: 156, color: 'text-red-500' },
    { name: 'Business', icon: TrendingUp, count: 92, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">SkillForge</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Explorer par catégorie</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/courses?category=${category.name}`}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary"
            >
              <category.icon className={`mb-4 h-12 w-12 ${category.color}`} />
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count} cours disponibles</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
