import { PrismaClient, UserRole, CourseLevel, CourseStatus, ProjectDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer des catégories
  const webDevCategory = await prisma.category.create({
    data: {
      name: 'Développement Web',
      slug: 'web-development',
      description: 'HTML, CSS, JavaScript, React, Next.js',
      icon: '🌐',
    },
  });

  const dataCategory = await prisma.category.create({
    data: {
      name: 'Data Science',
      slug: 'data-science',
      description: 'Python, Machine Learning, Data Analysis',
      icon: '📊',
    },
  });

  // Créer un créateur
  const creator = await prisma.user.create({
    data: {
      email: 'creator@brainow.com',
      username: 'john_creator',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CREATOR,
      emailVerified: true,
      creatorProfile: {
        create: {
          displayName: 'John Doe',
          tagline: 'Expert en développement web moderne',
          website: 'https://johndoe.dev',
        },
      },
    },
  });

  // Créer un apprenant
  const learner = await prisma.user.create({
    data: {
      email: 'learner@brainow.com',
      username: 'jane_learner',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.LEARNER,
      emailVerified: true,
    },
  });

  // Créer un projet Sandbox
  const portfolioProject = await prisma.project.create({
    data: {
      title: 'Portfolio de Photographe Interactif',
      description:
        'Créer un site portfolio avec une galerie interactive et un formulaire de contact',
      difficulty: ProjectDifficulty.MEDIUM,
      clientName: 'Chloé Dubois',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
      initialBrief: `Salut ! Je suis **Chloé**, photographe professionnelle. J'ai besoin d'un site portfolio pour exposer mon travail.

Pour la V1, je veux :
- Une page d'accueil avec mon nom en grand
- Une grille de **6 photos** cliquables
- Un pied de page avec mon email

J'ai déposé 6 images dans le dossier \`/images\`. À toi de jouer ! 📸`,
      creatorId: creator.id,
      objectives: {
        create: [
          {
            text: 'Mettre en place la structure HTML de base',
            testId: 'html-structure',
            order: 1,
          },
          {
            text: 'Créer une grille de 6 photos',
            testId: 'grid-structure',
            order: 2,
          },
          {
            text: 'Rendre les photos cliquables pour les afficher en grand',
            testId: 'image-click-event',
            order: 3,
          },
          {
            text: 'Ajouter un formulaire de contact',
            testId: 'contact-form-exists',
            order: 4,
          },
        ],
      },
    },
  });

  // Créer un cours
  const course = await prisma.course.create({
    data: {
      title: 'Maîtriser React et Next.js',
      slug: 'maitriser-react-nextjs',
      description:
        'Apprenez à construire des applications web modernes avec React et Next.js',
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      price: 99.99,
      creatorId: creator.id,
      categoryId: webDevCategory.id,
      publishedAt: new Date(),
      tags: {
        create: [{ name: 'React' }, { name: 'Next.js' }, { name: 'TypeScript' }],
      },
      modules: {
        create: [
          {
            title: 'Introduction à React',
            description: 'Les bases de React',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Qu\'est-ce que React ?',
                  type: 'VIDEO',
                  order: 1,
                  duration: 600,
                  videoUrl: 'https://mux.com/video/example',
                },
                {
                  title: 'Votre premier composant',
                  type: 'VIDEO',
                  order: 2,
                  duration: 900,
                },
              ],
            },
          },
          {
            title: 'Projet : Portfolio Interactif',
            description: 'Mettez en pratique vos compétences',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Construire un portfolio avec un client IA',
                  type: 'SANDBOX',
                  order: 1,
                  projectId: portfolioProject.id,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Créer une inscription
  await prisma.enrollment.create({
    data: {
      userId: learner.id,
      courseId: course.id,
      pricePaid: 99.99,
      progress: 15,
    },
  });

  // Créer des achievements
  await prisma.achievement.createMany({
    data: [
      {
        name: 'Premier Projet',
        description: 'Terminer votre premier projet Sandbox',
        icon: '🎯',
        category: 'completion',
      },
      {
        name: 'Code Propre',
        description: 'Obtenir un score de qualité de code de 95%+',
        icon: '✨',
        category: 'quality',
      },
      {
        name: 'Mentor Actif',
        description: 'Aider 10 autres apprenants dans la communauté',
        icon: '🤝',
        category: 'community',
      },
      {
        name: 'Marathon',
        description: 'Compléter 5 cours en un mois',
        icon: '🏃',
        category: 'completion',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`
📊 Created:
  - ${2} Categories
  - ${1} Creator (${creator.email})
  - ${1} Learner (${learner.email})
  - ${1} Course
  - ${1} Sandbox Project
  - ${4} Achievements
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
