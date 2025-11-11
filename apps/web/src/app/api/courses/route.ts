import { NextResponse } from 'next/server';
// TODO: Réactiver l'authentification
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';

// GET - Récupérer tous les cours
export async function GET(request: Request) {
  try {
    // Pas besoin d'authentification pour GET (liste publique)
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    // TODO: Récupérer depuis Prisma/Supabase
    // Pour l'instant, retourner des données mockées
    const courses = [
      {
        id: '1',
        title: 'Maîtriser React et Next.js',
        subtitle: 'Apprenez à construire des applications web modernes',
        description: 'Ce cours vous apprendra...',
        category: 'web-dev',
        level: 'intermediate',
        price: 99.99,
        comparePrice: 149.99,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        status: 'published',
        creatorId: creatorId || 'user-1',
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau cours
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, category, level, price, comparePrice, coverImage, sections, status } = body;

    // Pour l'instant, on simule l'authentification
    // TODO: Implémenter l'authentification réelle avec Supabase
    const userId = 'temp-user-' + Date.now();
    
    console.log('Création de cours pour utilisateur:', userId);

    // TODO: Sauvegarder dans Prisma
    // Pour l'instant, simuler la sauvegarde
    const newCourse = {
      id: Date.now().toString(),
      title,
      subtitle,
      description,
      category,
      level,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      coverImage,
      sections,
      status: status || 'draft',
      creatorId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Cours créé:', newCourse);

    return NextResponse.json({ 
      success: true, 
      course: newCourse,
      message: status === 'published' ? 'Cours publié avec succès !' : 'Brouillon sauvegardé !'
    });
  } catch (error) {
    console.error('Erreur création cours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du cours' },
      { status: 500 }
    );
  }
}
