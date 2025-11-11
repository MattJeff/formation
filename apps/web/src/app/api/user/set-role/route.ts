import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Mettre à jour le rôle dans les métadonnées utilisateur
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        role: role,
        onboarding_completed: true,
      },
    });

    if (updateError) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du rôle' },
        { status: 500 }
      );
    }

    // TODO: Créer l'entrée dans la table users de Prisma
    // avec le rôle approprié (LEARNER ou CREATOR)

    return NextResponse.json({ success: true, role });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
