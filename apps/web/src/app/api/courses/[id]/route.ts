import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Récupérer un cours spécifique
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Récupérer depuis Prisma/Supabase
    const course = {
      id,
      title: 'Maîtriser React et Next.js',
      subtitle: 'Apprenez à construire des applications web modernes',
      description: 'Ce cours vous apprendra...',
      category: 'web-dev',
      level: 'intermediate',
      price: 99.99,
      comparePrice: 149.99,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      status: 'published',
      sections: [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du cours' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un cours
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // TODO: Mettre à jour dans Prisma
    console.log('Mise à jour cours:', id, body);

    return NextResponse.json({ 
      success: true,
      message: 'Cours mis à jour avec succès !'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du cours' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un cours
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // TODO: Supprimer de Prisma
    console.log('Suppression cours:', id);

    return NextResponse.json({ 
      success: true,
      message: 'Cours supprimé avec succès !'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du cours' },
      { status: 500 }
    );
  }
}
