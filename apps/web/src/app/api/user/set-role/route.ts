import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma, UserRole } from '@skillforge/database';

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

    // Créer ou mettre à jour l'entrée dans la table users de Prisma
    try {
      // Générer un username unique à partir de l'email
      const emailPrefix = user.email?.split('@')[0] || 'user';
      let username = emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '_');

      // Vérifier si le username existe déjà et ajouter un suffixe si nécessaire
      let finalUsername = username;
      let counter = 1;
      while (true) {
        const existingUser = await prisma.user.findUnique({
          where: { username: finalUsername }
        });

        if (!existingUser || existingUser.id === user.id) {
          break;
        }

        finalUsername = `${username}_${counter}`;
        counter++;
      }

      // Mapper le rôle string vers l'enum UserRole
      const userRole = role === 'creator' ? UserRole.CREATOR : UserRole.LEARNER;

      // Créer ou mettre à jour l'utilisateur dans Prisma
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          role: userRole,
        },
        create: {
          id: user.id,
          email: user.email!,
          username: finalUsername,
          role: userRole,
          emailVerified: !!user.email_confirmed_at,
        },
      });
    } catch (prismaError) {
      console.error('Erreur lors de la création/mise à jour de l\'utilisateur Prisma:', prismaError);
      // On ne fait pas échouer la requête car l'auth Supabase a réussi
      // mais on pourrait log l'erreur pour débogage
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
