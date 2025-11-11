import Link from 'next/link';
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Download, MessageSquare } from 'lucide-react';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // Données mockées - seront remplacées par l'API
  const course = {
    id: params.id,
    title: 'Maîtriser React et Next.js',
    subtitle: 'Construisez des applications web modernes et performantes',
    description: `Apprenez à créer des applications web professionnelles avec React et Next.js. 
    Ce cours complet vous guidera de zéro à héros, en couvrant tous les concepts essentiels 
    et les meilleures pratiques de l'industrie.`,
    price: 99.99,
    originalPrice: 149.99,
    level: 'Intermédiaire',
    duration: '12 heures',
    students: 1234,
    rating: 4.8,
    reviews: 342,
    language: 'Français',
    lastUpdated: '2024-11-01',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    instructor: {
      name: 'John Doe',
      title: 'Senior Full-Stack Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      students: 5420,
      courses: 8,
      rating: 4.9,
    },
    whatYouWillLearn: [
      'Maîtriser les fondamentaux de React (Hooks, Context, etc.)',
      'Construire des applications avec Next.js 14',
      'Gérer l\'état avec Zustand et React Query',
      'Implémenter l\'authentification et les paiements',
      'Déployer sur Vercel et gérer la production',
      'Optimiser les performances et le SEO',
    ],
    requirements: [
      'Connaissances de base en JavaScript',
      'Familiarité avec HTML et CSS',
      'Un ordinateur avec Node.js installé',
    ],
    modules: [
      {
        id: 1,
        title: 'Introduction à React',
        lessons: 8,
        duration: '1h 30min',
        lessons_detail: [
          { id: 1, title: 'Qu\'est-ce que React ?', duration: '10:23', free: true },
          { id: 2, title: 'Votre premier composant', duration: '15:45', free: true },
          { id: 3, title: 'Props et State', duration: '12:30', free: false },
        ],
      },
      {
        id: 2,
        title: 'Hooks Avancés',
        lessons: 12,
        duration: '2h 15min',
        lessons_detail: [
          { id: 4, title: 'useState et useEffect', duration: '18:20', free: false },
          { id: 5, title: 'useContext et useReducer', duration: '22:15', free: false },
        ],
      },
      {
        id: 3,
        title: 'Next.js Fundamentals',
        lessons: 10,
        duration: '2h 00min',
        lessons_detail: [],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            SkillForge
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/courses" className="text-sm hover:text-primary">
              Cours
            </Link>
            <Link href="/sandbox" className="text-sm hover:text-primary">
              Sandbox
            </Link>
            <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="container mx-auto px-4 py-12">
          <Link href="/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux cours
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {course.level}
                </span>
                <span className="text-sm text-muted-foreground">Mis à jour le {course.lastUpdated}</span>
              </div>

              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
              <p className="mb-6 text-lg text-muted-foreground">{course.subtitle}</p>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">({course.reviews} avis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.students.toLocaleString()} étudiants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <p className="text-sm text-muted-foreground">Créé par</p>
                  <Link href={`/creators/${course.instructor.name}`} className="font-semibold hover:text-primary">
                    {course.instructor.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{course.price}€</span>
                    <span className="text-lg text-muted-foreground line-through">{course.originalPrice}€</span>
                  </div>
                  <p className="text-sm text-destructive">Offre limitée !</p>
                </div>

                <button className="mb-3 w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                  Acheter maintenant
                </button>
                <button className="w-full rounded-md border border-border py-3 font-medium hover:bg-accent">
                  Ajouter au panier
                </button>

                <div className="mt-6 space-y-2 text-sm">
                  <p className="font-semibold">Ce cours inclut :</p>
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration} de vidéo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>Ressources téléchargeables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Accès à vie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Accès à la communauté</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-2xl font-bold">Ce que vous allez apprendre</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <p className="whitespace-pre-line text-muted-foreground">{course.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Prérequis</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Contenu du cours</h2>
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <details key={module.id} className="group rounded-lg border border-border bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold hover:bg-accent">
                      <span>{module.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {module.lessons} leçons • {module.duration}
                      </span>
                    </summary>
                    <div className="border-t border-border p-4">
                      {module.lessons_detail.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lesson.title}</span>
                            {lesson.free && (
                              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Gratuit
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Instructor Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Votre instructeur</h3>
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <Link href={`/creators/${course.instructor.name}`} className="font-semibold hover:text-primary">
                    {course.instructor.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.instructor.rating} note instructeur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.instructor.students.toLocaleString()} étudiants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span>{course.instructor.courses} cours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
